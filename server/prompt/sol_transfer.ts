import {
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { anthropic } from ".";

async function prepareSOLTransfer(prompt: string, publicKey: PublicKey) {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-haiku-latest",
            max_tokens: 4096,
            messages: [
                {
                    role: "user",
                    content: `Given a user prompt for a SOL transfer, extract the following details:
                    1. Recipient's public key/address
                    2. Amount of SOL to transfer

                    Example prompts:
                    - "Send 1 SOL to 7xK...(Solana address)"
                    - "Transfer 0.5 SOL to my friend's wallet"

                    For the prompt: "${prompt}"

                    Respond ONLY with a JSON object containing:
                    {
                        "recipientAddress": "<solana public key>",
                        "amount": <number of SOL>
                    }

                    If the prompt is unclear or missing critical information, return null.`,
                },
            ],
        });

        let responseText = "";
        for (const item in response.content) {
            if (response.content[item].type === "text") {
                responseText = response.content[item].text;
                break;
            }
        }

        const extractedDetails = JSON.parse(responseText);

        // Validate the extracted details
        if (
            !extractedDetails ||
            !extractedDetails.recipientAddress ||
            !extractedDetails.amount
        ) {
            throw new Error("Could not extract transaction details");
        }

        // // Create the transaction object
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey, // Sender's public key
                toPubkey: new PublicKey(extractedDetails.recipientAddress),
                lamports: extractedDetails.amount * LAMPORTS_PER_SOL,
            })
        );

        return {
            transaction,
            recipientAddress: extractedDetails.recipientAddress,
            amount: extractedDetails.amount,
        };
    } catch (error) {
        console.error(`Error processing prompt: ${prompt}`, error);
        throw error;
    }
}

// for await (const chunk of stream) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || "");
// }


export { prepareSOLTransfer };
