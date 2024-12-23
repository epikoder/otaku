import { SendIcon } from "@components/Icons";
import { Fragment } from "react/jsx-runtime";
import senseiUrl from "@assets/sensei.svg";
import { useContext, useEffect, useRef, useState } from "react";
import { SystemBubble, UserBubble } from "@components/Bubble";
import { GetChatHistory } from "../../utils/get_chat_history";
import useSelectedAccount from "@hooks/useSelectedAccount";
import { __ChatContext__ } from "../chat.context.client";

export default function () {
  const account = useSelectedAccount();

  const _load_chat_history = async (account: string) => {
    await GetChatHistory(account);
  };

  useEffect(() => {
    if (account) {
      _load_chat_history(account);
    }
  }, [account]);

  return (
    <Fragment>
      <div className="overflow-y-scroll overflow-x-hidden h-[calc(100vh-300px)] pt-12 px-2">
        <MessagesComponent />
      </div>
      <PromptInput />
    </Fragment>
  );
}

const PromptInput = () => {
  const [isListening, setIsListening] = useState(false);
  const chatcontext = useContext(__ChatContext__);
  const isReady = chatcontext.laoding ?? true;

  const ref = useRef<HTMLTextAreaElement>(null);
  const sendPrompt = async (text: string) => {
    if (text.trim().length == 0) return;
    chatcontext.addChat({
      intent: [],
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
    <div className="sticky bottom-0 h-32 w-full flex gap-3 items-start border rounded-2xl p-3 bg-[#3C3C3C] border-[#3C3C3C]">
      <div className="size-4 rounded-full bg-[#F11313] my-1" />
      <textarea
        ref={ref}
        className="w-full h-full bg-transparent outline-none transition-all duration-300 resize-y text-sm"
        style={{ lineHeight: 1 }}
        placeholder={isListening ? "Listening..." : "Message sensei..."}
        onKeyDown={(ev) => {
          if (ev.shiftKey && ev.code == "Enter") {
            ev.currentTarget.value += "\n";
            ev.currentTarget.scrollBy({ behavior: "smooth", top: 100 });
            ev.preventDefault();
            return;
          }

          if (ev.code == "Enter") {
            ev.preventDefault();
            const value = ev.currentTarget.value.trim();
            if (value.length == 0 || !isReady) return;
            ev.currentTarget.value = "";
            return sendPrompt(value);
          }
        }}
      >
      </textarea>
      <button
        className={`transition-all duration-300 p-2 rounded-xl ${
          isListening ? "bg-white p-[10px]" : "bg-[#F11313]"
        } disabled:bg-zinc-700`}
        disabled={!isReady}
        onClick={() => sendPrompt(ref.current!.value)}
      >
        <SendIcon className="text-white size-5" />
      </button>
    </div>
  );
};

const MessagesComponent = () => {
  return (
    <__ChatContext__.Consumer>
      {({ chats }) => (
        <Fragment>
          {chats.length == 0 && (
            <div className="mx-auto w-fit scale-75">
              <img src={senseiUrl} alt="" />
            </div>
          )}
          <div className="flex flex-col gap-4 px-2">
            {chats.map((message, idx) => (
              <Fragment key={idx}>
                {message.sender == "system"
                  ? <SystemBubble {...message} />
                  : <UserBubble {...message} />}
              </Fragment>
            ))}
          </div>
        </Fragment>
      )}
    </__ChatContext__.Consumer>
  );
};
