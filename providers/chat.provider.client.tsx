import { GetIntentFromPrompt } from "@utils/get_intent_from_prompt";
import { createContext, ReactNode, useEffect, useState } from "react";
import { navigate } from "vike/client/router";

export const startNewChat = () => {
    navigate("/");
    document.dispatchEvent(new Event("new-chat"));
};

export const __ChatContext__ = createContext<{
    chats: Message[];
    isTyping: boolean;
    addMessage: (message: UserMessage) => void;
    addSystemMessage: (message: SystemMessage) => void;
}>({
    chats: [],
    addMessage: () => {},
    addSystemMessage: () => {},
    isTyping: false,
});

const ChatProvider = ({ children }: { children: ReactNode }): ReactNode => {
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState<boolean>(false);

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
    useEffect(() => {
        if (typeof document == "undefined") return;
        const fn = () => {};
        document.addEventListener("new-chat", fn);
        return () => document.removeEventListener("new-chat", fn);
    }, []);

    return (
        <__ChatContext__.Provider
            value={{
                isTyping: isTyping,
                chats: chatLog,
                addMessage: addChat,
                addSystemMessage: (systemMessage) =>
                    setChatLog((prev) => [...prev, systemMessage]),
            }}
        >
            {children}
        </__ChatContext__.Provider>
    );
};

export default ChatProvider;
