import { Fragment } from "react/jsx-runtime";
import senseiUrl from "@assets/sensei.svg";
import { useContext, useEffect, useRef } from "react";
import { SystemBubble, UserBubble } from "@components/Bubble";
import { GetChatHistory } from "../../utils/get_chat_history";
import useSelectedAccount from "@hooks/useSelectedAccount";
import ChatProvider, {
  __ChatContext__,
} from "../../providers/chat.provider.client";
import PromptInput from "@components/PromptInput";

const GreetingMessage = () => (
  <div className="bg-[#292929] p-3 rounded-lg">
    <p>GM, GM</p>
    <br />
    <p>
      I am Sensei, your personal trading companion. I help you track your
      trades, and automate swap and transfers. What can I do for you, mate?
    </p>
  </div>
);

export default function () {
  const account = useSelectedAccount();

  const _load_chat_history = async (account: string) => {
    await GetChatHistory(account);
  };

  useEffect(() => {
    if (!account) return;
    _load_chat_history(account.toString());

    const ws = new WebSocket("/live");
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (msg) => {
      const tranx = msg.data.transactions;
    };

    return () => ws.close();
  }, [account]);

  return (
    <ChatProvider>
      <div className="flex flex-col justify-between h-[calc(100vh-160px)]">
        <MessagesComponent />
        <PromptInput />
      </div>
    </ChatProvider>
  );
}

const MessagesComponent = () => {
  const { chats, isTyping } = useContext(__ChatContext__);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto flex-grow h-[calc(100vh-400px)] px-2">
      <__ChatContext__.Consumer>
        {({ chats, isTyping: isReady }) => (
          <Fragment>
            {chats.length == 0 && (
              <div className="flex flex-col gap-3 items-center">
                <div className="w-fit scale-75">
                  <img src={senseiUrl} alt="Sensei" />
                </div>
                <GreetingMessage />
              </div>
            )}
            {chats.map((message, idx) => (
              <Fragment key={idx}>
                {message.sender == "system"
                  ? <SystemBubble {...message} />
                  : <UserBubble {...message} />}
              </Fragment>
            ))}
          </Fragment>
        )}
      </__ChatContext__.Consumer>
      <div ref={messagesEndRef} />
      {/* Ensures auto-scroll to the latest message */}
      {isTyping && (
        <div className="text-gray-500 italic">Sensei is typing...</div>
      )}
    </div>
  );
};
