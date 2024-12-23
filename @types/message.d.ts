type Message = UserMessage | SystemMessage;

interface UserMessage {
    sender: "user";
    messaage: string;
}

interface SystemMessage {
    sender: "system";
    reply: string;
    intent: Intent | null;
}
