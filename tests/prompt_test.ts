import { expect, test } from "bun:test";
import { getIntent } from "server/prompt/intent";

test("test-prompt", async () => {
    await getIntent("Swap USDC for 30 sol");
    await getIntent("Swap 20 USDC for sol");
    await getIntent("What's SOL price in market today");
});
