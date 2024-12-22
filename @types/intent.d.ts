type Intent = SwapIntent | OpenIntent;

interface SwapIntent {
    action: "swap";
    token: string;
    amount: number;
    price?: number;
    text: string;
}

interface OpenIntent {
    action: "open";
    url: string;
    text: string;
}

interface SendIntent {
    action: "send";
    token: string;
    amount: number;
    reciever: string;
    text: string;
}

interface JournalIntent {
    action: "journal";
    token: string;
    amount: number;
    price?: number;
    profit?: number;
}

// interface CommandIntent {
//     action: "command";
//     type: "journal" | "send";
// }
