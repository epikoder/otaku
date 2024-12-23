import useSelectedAccount from "@hooks/useSelectedAccount";
import { GetIntentFromPrompt } from "@utils/get_intent_from_prompt";
import { createContext, ReactNode, useState } from "react";
import { navigate } from "vike/client/router";

export const __ChatContext__ = createContext<{
    chats: Message[];
    laoding: boolean;
    addChat: (message: Message) => void;
    clearChat: VoidFunction;
}>({ chats: [], addChat: () => {}, clearChat: () => {}, laoding: true });

const ChatProvider = ({ children }: { children: ReactNode }): ReactNode => {
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const account = useSelectedAccount();

    const addChat = async (message: Message) => {
        setChatLog((prev) => prev.concat(message));
        setIsLoading(true);
        GetIntentFromPrompt(message.messaage).then((systemMessage) => {
            new Promise(() =>
                setTimeout(() =>
                    setIsLoading((prev) => {
                        console.log(prev);
                        return false;
                    }), 500)
            );
            setChatLog((prev) =>
                prev.concat({
                    messaage: systemMessage.reply,
                    sender: "system",
                    intent: [systemMessage.intent],
                })
            );
        });
    };

    const clearChat = () => {
        navigate("/");
        document.dispatchEvent(new Event("new-chat"));
    };

    return (
        <__ChatContext__.Provider
            value={{
                laoding: isLoading,
                chats: chatLog,
                addChat,
                clearChat,
            }}
        >
            {children}
        </__ChatContext__.Provider>
    );
};

export default ChatProvider;
