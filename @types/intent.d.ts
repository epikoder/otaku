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
