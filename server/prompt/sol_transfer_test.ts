import { expect, test } from "bun:test";
import { prepareSOLTransfer } from "./sol_transfer";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { connection } from ".";

test("test_sol_transfer_address", async () => {
    const prompt = "Send 1 SOL to 7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh";
    const pubkey = new PublicKey(
        "7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh",
    );
    const txObject = await prepareSOLTransfer(
        prompt,
        pubkey,
    );
    expect(txObject.amount).toEqual(1);
    expect(txObject.recipientAddress).toEqual(
        "7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh",
    );
});

test("test_sol_transfer_contact", async () => {
    const prompt = "Send 1 SOL to Mark";
    const txObject = await prepareSOLTransfer(
        prompt,
        new PublicKey("7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh"),
    );
    expect(txObject.amount).toEqual(1);
    expect(txObject.contact).toEqual("Mark");
});
