import { Microphone, SendIcon } from "@components/Icons";
import { Fragment } from "react/jsx-runtime";
import senseiUrl from "@assets/sensei.svg";
import { createContext, useContext, useState } from "react";
import { SystemBubble, UserBubble } from "@components/Bubble";

const __ChatContext__ = createContext<{
  chats: Message[];
  addChatLog: (message: Message) => void;
}>({ chats: [], addChatLog: () => {} });

export default function () {
  const [chats, setChats] = useState<Message[]>([]);

  return (
    <Fragment>
      <__ChatContext__.Provider
        value={{
          chats,
          addChatLog: (message) => setChats(chats.concat(message)),
        }}
      >
        <div className="overflow-y-scroll overflow-x-hidden h-[calc(100vh-300px)] px-2">
          <div className="mx-auto w-fit scale-75">
            <img src={senseiUrl} alt="" />
          </div>
          <MessagesComponent />
        </div>
        <PromptInput />
      </__ChatContext__.Provider>
    </Fragment>
  );
}

const PromptInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [isReady, setIsReady] = useState(true);
  const chatcontext = useContext(__ChatContext__);

  const sendPrompt = (text: string) => {
    chatcontext.addChatLog({
      intent: [],
      messaage: text,
      sender: chatcontext.chats.at(-1)?.sender == "system" ? "user" : "system",
    });
  };

  return (
    <div className="sticky bottom-0 h-32 w-full flex gap-3 items-start border rounded-2xl p-3 bg-[#3C3C3C] border-[#3C3C3C]">
      <div className="size-4 rounded-full bg-[#F11313] my-1" />
      <textarea
        name=""
        id=""
        className="w-full h-full bg-transparent outline-none transition-all duration-300"
        placeholder={isListening ? "Listening..." : "Message sensei..."}
        onKeyDown={(ev) => {
          if (ev.shiftKey && ev.code == "Enter") {
            ev.currentTarget.value += "\n";
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
        }`}
        disabled={!isReady}
        // onClick={() => setIsListening(!isListening)}
      >
        {
          /* {isListening
          ? <span className="size-4 rounded block bg-[#F11313]" />
          : <Microphone />} */
        }
        <SendIcon className="text-white size-5" />
      </button>
    </div>
  );
};

const MessagesComponent = () => {
  return (
    <__ChatContext__.Consumer>
      {({ chats }) => (
        <div className="flex flex-col gap-4">
          {chats.map((message, idx) => (
            <Fragment key={idx}>
              {message.sender == "system"
                ? <SystemBubble {...message} />
                : <UserBubble {...message} />}
            </Fragment>
          ))}
        </div>
      )}
    </__ChatContext__.Consumer>
  );
};
