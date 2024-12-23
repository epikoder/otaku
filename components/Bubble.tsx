import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

export const SystemBubble = (message: Message) => {
    const [str, setStr] = useState("");

    const renderText = async () => {
        // for (const char of message.messaage) {
        //     setStr((prev) => prev + char);
        //     // await new Promise((resolve) => setTimeout(resolve, 50)); //50ms delay
        // }
        setStr(message.messaage);
    };

    useEffect(() => {
        renderText();
    }, []);

    return (
        <div className="flex justify-start">
            <div className="w-fit max-w-[60%] text-wrap mr-auto bg-[#292929] p-4">
                <Markdown>{str}</Markdown>
            </div>
        </div>
    );
};

export const UserBubble = (message: Message) => {
    return (
        <div className="flex justify-end">
            <div className="w-fit max-w-[60%] ml-auto bg-[#171717] p-4">
                <Markdown>
                    {message.messaage}
                </Markdown>
            </div>
        </div>
    );
};
