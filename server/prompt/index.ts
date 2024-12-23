import Anthropic from "@anthropic-ai/sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import {
    accountExists as _accountExists,
    prepareTokenTransfer,
} from "./spl_token_transfer";
import { prepareSOLTransfer } from "./sol_transfer";

export const anthropic = new Anthropic({ apiKey: Bun.env.ANTHROPIC_API_KEY });
export const connection = new Connection(
    Bun.env.SOLANA_ENDPOINT as string,
    "confirmed",
);

export function parseJSONOrObject(input: any) {
    if (typeof input === "object" && input !== null) {
        return input;
    }

    if (typeof input === "string") {
        try {
            return JSON.parse(input);
        } catch {
            return null;
        }
    }

    return null;
}

export const accountExists = async (address: PublicKey) =>
    await _accountExists(connection, address);

export { prepareSOLTransfer, prepareTokenTransfer };
