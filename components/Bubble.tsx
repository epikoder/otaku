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
import { showDialog } from "./Dialog";
import { SendIcon } from "./Icons";
import {
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import useSelectedAccount from "@hooks/useSelectedAccount";
import { connection } from "@utils/web3";
import useSelectedProvider from "@hooks/useSelectedProvider";
import { Phantom } from "web3-react-phantom";
import PhantomWallet from "./Phantom";

export const SystemBubble = (message: SystemMessage) => {
    const account = useSelectedAccount();
    const provider = useSelectedProvider();

    const { contact } = useContext(__ContactContext__);
    const [str, setStr] = useState("");
    const [intents, setIntents] = useState(
        message.intent ? [message.intent] : [],
    );

    const renderText = async () => {
        setStr(message.reply);
    };

    const contactInputRef = useRef<HTMLInputElement>(null);

    const transferTokenToAddress = (intent: TransferIntent) => {
        console.log(intent);
        const pubKey = new PublicKey(intent.address!);
        console.log(pubKey, account);
        const transfer = SystemProgram.transfer({
            fromPubkey: new PublicKey(account!),
            toPubkey: new PublicKey(intent.address!),
            lamports: intent.amount * LAMPORTS_PER_SOL,
        });
        console.log(transfer);
        const transaction = new Transaction().add(transfer);
        console.log(transaction);
        const signer = provider!.getSigner();
        console.log(signer);
    };

    const handleIntent = (intent: Intent): ReactNode => {
        switch (intent.intent) {
            case "transfer:select_contact":
                return (
                    <button
                        className="bg-[#F11313] text-white px-3 py-1 text-xs uppercase rounded-md"
                        onClick={() => {
                            showDialog(({ closeFn }) => (
                                <div>
                                    <div>
                                        Saved contacts
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <input
                                                ref={contactInputRef}
                                                placeholder="enter address manually"
                                                className="flex-1"
                                            />
                                            <button
                                                className="bg-[#F11313] p-2 py-3"
                                                onClick={() => {
                                                    const address =
                                                        contactInputRef
                                                            .current!
                                                            .value;
                                                    if (!address) return;
                                                    setIntents([
                                                        {
                                                            ...(message
                                                                .intent! as TransferIntent),
                                                            address,
                                                        } satisfies TransferIntent,
                                                    ]);
                                                    closeFn();
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
                                    </div>
                                </div>
                            ), false);
                        }}
                    >
                        Select contact
                    </button>
                );
            case "transfer":
                return (
                    <button
                        className="bg-[#F11313] text-white px-3 py-3 text-xs uppercase rounded-md"
                        onClick={() => transferTokenToAddress(intent)}
                    >
                        Execute {intent.intent}
                    </button>
                );
            case "login_intent":
                return (
                    <>
                        <PhantomWallet />
                    </>
                );
            default:
                break;
        }
    };

    useEffect(() => {
        renderText();
    }, []);

    useEffect(() => {
        if (!message.intent) return;
        switch (message.intent.intent) {
            case "transfer": {
                if (!account) {
                    return setIntents([{ intent: "login_intent" }]);
                }
                if (!message.intent.address) {
                    if (message.intent.contact) {
                        let address = contact[message.intent.contact];
                        if (!address) {
                            setIntents([{ intent: "transfer:select_contact" }]);
                            return;
                        }
                        message.intent.address = address;
                    }
                    if (!message.intent.address) return setIntents([]);
                }
                setIntents([message.intent]);
                break;
            }

            default:
                break;
        }
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
