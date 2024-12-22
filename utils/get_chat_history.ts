import { createRedisCache } from "server/util";

export async function GetChatHistory(address: string) {
    const resp = await fetch("/api/chat-history/" + address);
    switch (resp.status) {
        case 200:
            return resp.json();
        default:
            return [];
    }
}
