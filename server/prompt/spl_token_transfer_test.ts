import { PublicKey } from "@solana/web3.js";
import { prepareTokenTransfer } from "./spl_token_transfer";
import { test } from "bun:test";

test("test_spl_token_tranfer", async () => {
    const senderPublicKey = new PublicKey(
        "8LbNkQgvJHkGsF6poBTRzxi3TNEFE7xHzfwQKjMWNLko",
    );
    const prompt =
        "Send 100 USDC to FX5qToQUZztsaoTpDiitb9tNCB8L9gEnsoc6Hq38Lfkq";

    const { transaction, details } = await prepareTokenTransfer(
        prompt,
        senderPublicKey,
    );
    console.log("Transaction prepared:", details);
    console.log("Transaction object:", transaction);
});
