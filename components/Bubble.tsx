import { __ContactContext__ } from "../providers/contact.provider.client";
import {
    Fragment,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import Markdown from "react-markdown";
import { showAlertDialog, showDialog } from "./Dialog";
import { SendIcon } from "./Icons";
import {
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import useSelectedAccount from "@hooks/useSelectedAccount";
import { swapToken, transferToken } from "@utils/web3";
import { __ChatContext__ } from "../providers/chat.provider.client";
import WalletConnect from "./WallectConnect";

export const SystemBubble = (message: SystemMessage) => {
    const account = useSelectedAccount();
    const chatContext = useContext(__ChatContext__);

    const { contact } = useContext(__ContactContext__);
    const [str, setStr] = useState("");
    const [intents, setIntents] = useState(
        message.intent ? [message.intent] : [],
    );

    const renderText = async () => {
        setStr(message.reply);
    };

    const contactInputRef = useRef<HTMLInputElement>(null);

    const handleContactSelect = (address: string) => {
        showAlertDialog({
            title: (
                <span className="text-white">
                    {`Save
                contact
                ${
                        (message
                            .intent as TransferIntent)
                            .contact
                    }`}
                </span>
            ),
            message: (
                <div>
                    <span>
                        {`Do you want to Save address: {address} as`}
                    </span>
                    <span>
                        {(message
                            .intent as TransferIntent)
                            .contact}
                    </span>
                </div>
            ),
            onContinue: () => {
                setIntents([
                    {
                        ...(message
                            .intent! as TransferIntent),
                        address,
                    } satisfies TransferIntent,
                ]);
                // TODO: save contact
            },
            onCancel: () =>
                setIntents([
                    {
                        ...(message
                            .intent! as TransferIntent),
                        address,
                    } satisfies TransferIntent,
                ]),
            onCancelText: "No",
            onContinueText: "Yes",
        });
    };

    const handleIntent = (intent: Intent): ReactNode => {
        switch (intent.intent) {
            case "login_intent":
                return (
                    <>
                        <WalletConnect />
                    </>
                );
            case "transfer:select_contact":
                return (
                    <button
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md"
                        onClick={() => {
                            showDialog(
                                ({ closeFn }) => (
                                    <div className="rounded-lg flex flex-col gap-3 items-center p-4 min-w-96 text-sm">
                                        <div className="text-white">
                                            Saved contacts
                                        </div>
                                        <div className="w-full">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    ref={contactInputRef}
                                                    placeholder="enter address manually"
                                                    className="flex-1 outline-none bg-inherit border-b text-zinc-200"
                                                    onKeyDown={(ev) => {
                                                        if (
                                                            ev.key == "Enter"
                                                        ) {
                                                            ev.preventDefault();
                                                            const address =
                                                                ev.currentTarget
                                                                    .value;
                                                            if (!address) {
                                                                return;
                                                            }
                                                            closeFn();
                                                            handleContactSelect(
                                                                address,
                                                            );
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className="bg-[#F11313] p-1 rounded-lg text-zinc-100"
                                                    onClick={() => {
                                                        const address =
                                                            contactInputRef
                                                                .current!
                                                                .value;
                                                        if (!address) return;
                                                        closeFn();
                                                        handleContactSelect(
                                                            address,
                                                        );
                                                    }}
                                                >
                                                    <SendIcon className="size-4" />
                                                </button>
                                            </div>
                                            {Object.entries(contact).map((
                                                [k, v],
                                                idx,
                                            ) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setIntents([
                                                            {
                                                                ...(message
                                                                    .intent! as TransferIntent),
                                                                address: v,
                                                            } satisfies TransferIntent,
                                                        ]);
                                                        closeFn();
                                                    }}
                                                >
                                                    {k}: {v}
                                                </div>
                                            ))}
                                            {Object.entries(contact).length ==
                                                    0 && (
                                                <div className="text-center py-4 text-zinc-200">
                                                    No saved contact
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ),
                                false,
                            );
                        }}
                    >
                        Select contact
                    </button>
                );
            case "transfer":
                return (
                    <button
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md"
                        onClick={() => transferToken(intent, account!)}
                    >
                        Execute {intent.intent}
                    </button>
                );
            case "swap":
                return (
                    <button
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md"
                        onClick={() => swapToken(intent, account!)}
                    >
                        Swap {intent.intent}
                    </button>
                );
            case "token":
            case "journal":
            default:
                break;
        }
    };

    useEffect(() => {
        renderText();
    }, []);

    // Prepare intent
    const prepareIntent = (intent: Intent) => {
        switch (intent.intent) {
            case "transfer": {
                if (!account) {
                    return setIntents([{ intent: "login_intent" }]);
                }
                if (!intent.address) {
                    if (intent.contact) {
                        let address = contact[intent.contact];
                        if (!address) {
                            setIntents([{ intent: "transfer:select_contact" }]);
                            return;
                        }
                        intent.address = address;
                    }
                    if (!intent.address) {
                        setIntents([]);
                        chatContext.addSystemMessage({
                            reply:
                                `Sorry, I'm unable to process your request due to missing fields`,
                            sender: "system",
                            intent: null,
                        });
                        return;
                    }
                }
                setIntents([intent]);
                break;
            }
            case "swap": {
                if (!account) {
                    return setIntents([{ intent: "login_intent" }]);
                }
                if (!intent.coint_a || !intent.coint_b) {
                    chatContext.addSystemMessage({
                        reply:
                            "Please specify a Token to swap with: \n Example: Swap 3.5 SOL for USDC",
                        sender: "system",
                        intent: null,
                    });
                    return;
                }

                if (intent.coin_a_amount == 0 && intent.coin_b_amount == 0) {
                    chatContext.addSystemMessage({
                        reply: `Yo! what magic are you trying to perform?`,
                        sender: "system",
                        intent: null,
                    });
                    return;
                }
                setIntents([intent]);
                break;
            }
            case "token":
                if (!account) {
                    return setIntents([{ intent: "login_intent" }]);
                }
            case "journal":
                if (!account) {
                    return setIntents([{ intent: "login_intent" }]);
                }
            default:
                break;
        }
    };
    useEffect(() => {
        if (!message.intent) return;
        prepareIntent(message.intent);
    }, [account]);

    console.log(intents);
    return (
        <div>
            <div className="w-fit max-w-[60%] mr-auto bg-[#292929] p-4 rounded-t-2xl rounded-r-2xl">
                <Markdown>{str}</Markdown>
            </div>
            {intents.length != 0 && (
                <div className="flex flex-wrap gap-3 py-2">
                    {intents.map((intent, idx) => (
                        <Fragment key={idx}>
                            {handleIntent(intent)}
                        </Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export const UserBubble = (message: UserMessage) => {
    return (
        <div className="w-fit max-w-[60%] ml-auto bg-[#171717] p-4 rounded-t-2xl rounded-l-2xl">
            <Markdown>
                {message.messaage}
            </Markdown>
        </div>
    );
};
