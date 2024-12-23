import { useContext, useEffect, useRef, useState } from "react";
import { SendIcon } from "./Icons";
import { __ChatContext__ } from "../providers/chat.provider.client";

const PromptInput = () => {
    const chatcontext = useContext(__ChatContext__);
    const { isTyping } = chatcontext;

    const ref = useRef<HTMLTextAreaElement>(null);
    const sendPrompt = async (text: string) => {
        if (text.trim().length == 0) return;
        chatcontext.addChat({
            messaage: text,
            sender: "user",
        });
    };

    useEffect(() => {
        if (typeof document == "undefined") return;
        document.addEventListener("new-chat", () => {
            ref.current!.value = "";
        });
    }, []);

    return (
        <div className="w-full flex gap-3 min-h-32 items-start border rounded-2xl p-3 bg-[#3C3C3C] border-[#3C3C3C]">
            <textarea
                ref={ref}
                className="w-full h-full bg-transparent outline-none transition-all duration-300 resize-y text-sm"
                style={{ lineHeight: 1 }}
                placeholder={"Message sensei..."}
                onKeyDown={(ev) => {
                    if (ev.shiftKey && ev.code == "Enter") {
                        ev.currentTarget.value += "\n";
                        ev.currentTarget.scrollBy({
                            behavior: "smooth",
                            top: 100,
                        });
                        ev.preventDefault();
                        return;
                    }

                    if (ev.code == "Enter") {
                        ev.preventDefault();
                        const value = ev.currentTarget.value.trim();
                        if (value.length == 0 || isTyping) {
                            return;
                        }
                        ev.currentTarget.value = "";
                        return sendPrompt(value);
                    }
                }}
            >
            </textarea>
            <button
                className={`transition-all duration-300 p-2 rounded-xl ${"bg-[#F11313]"} disabled:bg-zinc-700`}
                disabled={isTyping}
                onClick={() => sendPrompt(ref.current!.value)}
            >
                <SendIcon className="text-white size-5" />
            </button>
        </div>
    );
};

export default PromptInput;
