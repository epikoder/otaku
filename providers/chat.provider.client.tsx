import useSelectedAccount from "@hooks/useSelectedAccount";
import { GetIntentFromPrompt } from "@utils/get_intent_from_prompt";
import { createContext, ReactNode, useState } from "react";
import { navigate } from "vike/client/router";

export const __ChatContext__ = createContext<{
    chats: Message[];
    isTyping: boolean;
    addMessage: (message: UserMessage) => void;
    addSystemMessage: (message: SystemMessage) => void;
    clearChat: VoidFunction;
}>({
    chats: [],
    addMessage: () => {},
    addSystemMessage: () => {},
    clearChat: () => {},
    isTyping: false,
});

const ChatProvider = ({ children }: { children: ReactNode }): ReactNode => {
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const account = useSelectedAccount();

    const addChat = async (message: UserMessage) => {
        setChatLog((prev) => [...prev, message]);

        setIsTyping(true);
        GetIntentFromPrompt(message.messaage).then(
            (systemMessage: SystemMessage) => {
                setIsTyping(false);
                setChatLog((prev) => [...prev, {
                    reply: systemMessage.reply,
                    sender: "system",
                    intent: systemMessage.intent,
                }]);
            },
        );
    };

    const clearChat = () => {
        navigate("/");
        document.dispatchEvent(new Event("new-chat"));
    };

    return (
        <__ChatContext__.Provider
            value={{
                isTyping: isTyping,
                chats: chatLog,
                addMessage: addChat,
                clearChat,
                addSystemMessage: (systemMessage) =>
                    setChatLog((prev) => [...prev, systemMessage]),
            }}
        >
            {children}
        </__ChatContext__.Provider>
    );
};

export default ChatProvider;
