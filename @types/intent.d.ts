type Intent =
    | SwapIntent
    | TransferIntent
    | TokenIntent
    | JournalIntent
    | SelectContactIntent
    | AuthIntent;

interface SwapIntent {
    intent: "swap";
    coin_a: string;
    coin_b: string;
    coin_a_amount: number;
    coin_b_amount: number;
}

interface TransferIntent {
    intent: "transfer";
    token: string;
    amount: number;
    contact: string | null;
    address: string | null;
}

interface SelectContactIntent {
    intent: "transfer:select_contact";
}

interface TokenIntent {
    intent: "token";
    token: string;
    amount?: number;
}

interface JournalIntent {
    intent: "journal";
    token: string;
    price?: number;
    amount: number;
    profit?: number;
}

interface AuthIntent {
    intent: "login_intent";
}
