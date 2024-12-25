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
import useSelectedAccount from "@hooks/useSelectedAccount";
import { swapToken, transferToken } from "@utils/web3";
import { __ChatContext__ } from "../providers/chat.provider.client";
import WalletConnect from "./WallectConnect";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

// Prepare intent
const prepareIntent = (
    intent: Intent,
    account: PublicKey | null,
    contact: Record<string, string>,
    reply: (message: SystemMessage) => void,
): Intent[] => {
    switch (intent.intent) {
        case "transfer": {
            if (!account) {
                return [{ intent: "login_intent" }];
            }
            if (!intent.address) {
                if (intent.contact) {
                    let address = contact[intent.contact];
                    if (!address) {
                        return [{ intent: "transfer:select_contact" }];
                    }
                    intent.address = address;
                }
                if (!intent.address) {
                    reply({
                        reply:
                            `Sorry, I'm unable to process your request due to missing fields`,
                        sender: "system",
                        intent: null,
                    });
                    return [];
                }
            }
            return [intent];
        }
        case "swap": {
            if (!account) {
                return [{ intent: "login_intent" }];
            }
            if (!intent.coint_a || !intent.coint_b) {
                reply({
                    reply:
                        "Please specify a Token to swap with: \n Example: Swap 3.5 SOL for USDC",
                    sender: "system",
                    intent: null,
                });
                return [];
            }

            if (intent.coin_a_amount == 0 && intent.coin_b_amount == 0) {
                reply({
                    reply: `Yo! what magic are you trying to perform?`,
                    sender: "system",
                    intent: null,
                });
                return [];
            }
            return [intent];
        }
        case "token":
            if (!account) {
                return [{ intent: "login_intent" }];
            }
        case "journal":
            if (!account) {
                return [{ intent: "login_intent" }];
            }
        default:
            return [];
    }
};

export const SystemBubble = (message: SystemMessage) => {
    const { publicKey: account } = useWallet();
    const chatContext = useContext(__ChatContext__);

    const { contact } = useContext(__ContactContext__);
    const [str, setStr] = useState("");
    const [intents, setIntents] = useState(
        message.intent
            ? prepareIntent(
                message.intent,
                account,
                contact,
                chatContext.addSystemMessage,
            )
            : [],
    );

    const renderText = async () => {
        setStr(message.reply);
    };

    const contactInputRef = useRef<HTMLInputElement>(null);

    // select contact from contact list
    const onContactSelect = (address: string) => {
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

    const renderIntent = (intent: Intent): ReactNode => {
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
                                                            onContactSelect(
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
                                                        onContactSelect(
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

    useEffect(() => {
        if (account && message.intent) {
            setIntents(prepareIntent(
                message.intent,
                account,
                contact,
                chatContext.addSystemMessage,
            ));
        }
    }, [account]);

    return (
        <div>
            <div className="w-fit max-w-[60%] mr-auto bg-[#292929] p-4 rounded-t-2xl rounded-r-2xl">
                <Markdown>{str}</Markdown>
            </div>
            {intents.length != 0 && (
                <div className="flex flex-wrap gap-3 py-2">
                    {intents.map((intent, idx) => (
                        <Fragment key={idx}>
                            {renderIntent(intent)}
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
