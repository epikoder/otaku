import { SystemBubble } from "@components/Bubble";
import { __ContactContext__ } from "../../providers/contact.provider.client";
import { useContext } from "react";
import ChatProvider from "../../providers/chat.provider.client";

// Test your components here href: /test
export default function () {
    const contact = useContext(__ContactContext__);
    contact.contact["Alice"] = "7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh";
    return (
        <ChatProvider>
            <SystemBubble
                {...{
                    intent: {
                        intent: "transfer",
                        address: "",
                        amount: 100,
                        contact: null,
                        token: "SOL",
                    },
                    reply: "Test without address and contact",
                    sender: "system",
                }}
            />
            <SystemBubble
                {...{
                    intent: {
                        intent: "transfer",
                        address: null,
                        amount: 100,
                        contact: "Alice",
                        token: "SOL",
                    },
                    reply: "Test with existing contact",
                    sender: "system",
                }}
            />
            <SystemBubble
                {...{
                    intent: {
                        intent: "transfer",
                        address: null,
                        amount: 100,
                        contact: "Mark",
                        token: "SOL",
                    },
                    reply: "Test with non-existing contact",
                    sender: "system",
                }}
            />
            <SystemBubble
                {...{
                    intent: {
                        intent: "transfer",
                        address: "7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh",
                        amount: 100,
                        contact: null,
                        token: "SOL",
                    },
                    reply: "Test with Address",
                    sender: "system",
                }}
            />
            <SystemBubble
                {...{
                    intent: {
                        intent: "swap",
                        coin_a: "SOL",
                        coin_b: "USDC",
                        coin_a_amount: 100,
                        coin_b_amount: 0,
                    },
                    reply: "Test swap",
                    sender: "system",
                }}
            />
            <SystemBubble
                {...{
                    intent: {
                        intent: "journal",
                        amount: 20,
                        token: "SOL",
                        price: 185.45,
                        profit: 5
                    },
                    reply: "Oh thats great let's add this to your journal for future reference",
                    sender: "system",
                }}
            />
        </ChatProvider>
    );
}
