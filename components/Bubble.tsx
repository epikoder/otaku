import { useEffect, useRef } from "react";

export const SystemBubble = (message: Message) => {
    const ref = useRef<HTMLDivElement>(null);
    const renderText = async () => {
        for (const char of message.messaage) {
            ref.current!.innerText += char;
            await new Promise((resolve) => setTimeout(resolve, 50)); // 100ms delay
        }
    };

    useEffect(() => {
        if (!ref.current) return;
        renderText();
    }, []);

    return (
        <div className="flex justify-start">
            <div
                ref={ref}
                className="w-fit max-w-[60%] text-wrap mr-auto bg-[#292929] p-4"
            />
        </div>
    );
};

export const UserBubble = (message: Message) => {
    return (
        <div className="flex justify-end">
            <div className="w-fit max-w-[60%] ml-auto bg-[#171717] p-4">
                {message.messaage}
            </div>
        </div>
    );
};
