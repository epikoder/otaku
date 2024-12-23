import { Connection, PublicKey } from "@solana/web3.js";

export const connection = new Connection(
    Bun.env.SOLANA_ENDPOINT as string,
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
