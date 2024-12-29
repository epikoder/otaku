import {
    createJupiterApiClient,
    QuoteGetRequest,
    QuoteResponse,
    ResponseError,
} from "@jup-ag/api";
import { Keypair } from "@solana/web3.js";

const ENDPOINT = `https://public.jupiterapi.com/`;
const CONFIG = {
    basePath: ENDPOINT,
};

const quoteRequest: QuoteGetRequest = {
    inputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    outputMint: "So11111111111111111111111111111111111111112",
    amount: 10.03 * 1e6,
    /*     slippageBps: 100,
        swapMode: "ExactIn", */
};

async function getQuote(): Promise<void> {
    const jupiterApi = createJupiterApiClient(CONFIG);
    const wallet = Keypair.generate();

    try {
        // 1. Retrieve a Swap Quote
        const quote: QuoteResponse | null = await jupiterApi.quoteGet(
            quoteRequest,
        );
        if (!quote) {
            throw new Error("No quote found");
        }

        // 2. Get Serialized Swap Transaction
        const swapResult = await jupiterApi.swapPost({
            swapRequest: {
                // @ts-ignore
                quoteResponse: quote,
                userPublicKey: wallet.publicKey.toBase58(),
            },
        });
        if (!swapResult) {
            throw new Error("No swap result found");
        }
        console.log(swapResult);
    } catch (error) {
        if (error instanceof ResponseError) {
            console.log(await error.response.json());
        } else {
            console.error(error);
        }
    }
}
