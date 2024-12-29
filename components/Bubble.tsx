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
import { swapToken, transferToken } from "@utils/web3";
import { __ChatContext__ } from "../providers/chat.provider.client";
import WalletConnect from "./WallectConnect";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { BaseSignInMessageSignerWalletAdapter } from "@solana/wallet-adapter-base";

// Prepare intent
const prepareIntent = (
    intent: Intent,
    account: PublicKey | null,
    contact: Record<string, string>,
): Intent | undefined => {
    switch (intent.intent) {
        case "transfer": {
            if (!account) {
                return { intent: "login_intent" };
            }
            if (!intent.address) {
                if (intent.contact) {
                    let address = contact[intent.contact];
                    if (!address) {
                        return { intent: "transfer:select_contact" };
                    }
                    intent.address = address;
                }
                if (!intent.address) {
                    return;
                }
            }
            return intent;
        }
        case "swap": {
            if (!account) {
                return { intent: "login_intent" };
            }
            if (!intent.coint_a || !intent.coint_b) {
                return;
            }

            if (intent.coin_a_amount == 0 && intent.coin_b_amount == 0) {
                return;
            }
            return intent;
        }
        case "token":
            return intent;
        case "journal":
            return intent;
        default:
            return;
    }
};

export const SystemBubble = (message: SystemMessage) => {
    const { publicKey: account } = useWallet();
    const wallet = useWallet();

    const { contact } = useContext(__ContactContext__);
    const [intents, setIntents] = useState(
        message.intent
            ? [prepareIntent(
                message.intent,
                account,
                contact,
            )]
            : [],
    );

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
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md font-semibold"
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
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md font-semibold"
                        onClick={() => transferToken(intent, account!)}
                    >
                        Execute Transfer
                    </button>
                );
            case "swap":
                return (
                    <button
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md font-semibold"
                        onClick={() =>
                            swapToken(
                                intent,
                                wallet as unknown as BaseSignInMessageSignerWalletAdapter,
                            )}
                    >
                        Execute Swap
                    </button>
                );
            case "token":
            case "journal":
                return (
                    <button
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md font-semibold"
                        onClick={() => {}}
                    >
                        Update Journal
                    </button>
                );
            default:
                break;
        }
    };

    useEffect(() => {
        if (account && message.intent) {
            setIntents([prepareIntent(
                message.intent,
                account,
                contact,
            )]);
        }
    }, [account]);

    return (
        <div>
            <div className="w-fit max-w-[60%] mr-auto bg-[#292929] p-4 rounded-t-2xl rounded-r-2xl">
                <Markdown>{message.reply}</Markdown>
            </div>
            {intents.length != 0 && (
                <div className="flex flex-wrap gap-3 py-2">
                    {intents.filter((i) => !!i).map((intent, idx) => (
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
