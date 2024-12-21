interface Message {
    sender: "system" | "user";
    messaage: string;
    intent: Intent[];
}
