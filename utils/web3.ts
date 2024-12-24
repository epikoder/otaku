import { Connection, PublicKey } from "@solana/web3.js";
import { useWeb3React } from "@web3-react/core";

type Provider = ReturnType<
    ReturnType<typeof useWeb3React>["hooks"]["useSelectedProvider"]
>;

const SOLANA_ENDPOINT = process.env.NODE_ENV == "development"
    ? "https://api.devnet-beta.solana.com"
    : "https://api.testnet-beta.solana.com";
export const connection = new Connection(
    SOLANA_ENDPOINT,
    "confirmed",
);

async function _accountExists(
    connection: Connection,
    account: PublicKey,
): Promise<boolean> {
    try {
        const accountInfo = await connection.getAccountInfo(account);
        return accountInfo !== null && accountInfo !== undefined;
    } catch (error) {
        return false;
    }
}

export const accountExists = async (address: PublicKey) =>
    await _accountExists(connection, address);

export const swapToken = async (
    intent: SwapIntent,
    account: PublicKey,
    // provider: Provider,
) => {};

export const transferToken = async (
    intent: TransferIntent,
    account: PublicKey,
    // provider: Provider,
) => {};
