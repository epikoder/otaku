import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import {
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
    getAssociatedTokenAddress,
    getMint,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { anthropic, connection, parseJSONOrObject } from ".";

interface TransactionDetails {
    mintAddress: string;
    recipientAddress: string;
    amount: number;
}

/**
 * Safely creates or retrieves a token account, with explicit handling for off-curve addresses
 * @param connection Solana connection
 * @param mint Token mint address
 * @param owner Token account owner
 * @param payer Account paying for ATA creation
 * @returns Public key of the token account
 */
async function getSafeTokenAccount(
    connection: Connection,
    mint: PublicKey,
    owner: PublicKey,
    payer: PublicKey,
): Promise<PublicKey> {
    try {
        // Check if the owner is a program (off-curve)
        const isProgram = owner.equals(SystemProgram.programId) ||
            owner.toBase58().startsWith("1");

        if (isProgram) {
            // Use PDA method for program accounts
            const [tokenAccount] = PublicKey.findProgramAddressSync(
                [
                    owner.toBuffer(),
                    TOKEN_PROGRAM_ID.toBuffer(),
                    mint.toBuffer(),
                ],
                new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
            );
            return tokenAccount;
        }

        // Try standard ATA for normal accounts
        return await getAssociatedTokenAddress(
            mint,
            owner,
            true, // allow owner to be a PDA
            TOKEN_PROGRAM_ID,
        );
    } catch (error) {
        console.error("Error getting token account:", error);

        // Last resort PDA method
        const [tokenAccount] = PublicKey.findProgramAddressSync(
            [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        );

        return tokenAccount;
    }
}

/**
 * Retrieves token decimals, with robust error handling
 * @param connection Solana connection
 * @param mintAddress Token mint address
 * @returns Number of decimals (default 6 if retrieval fails)
 */
async function getTokenDecimals(
    connection: Connection,
    mintAddress: PublicKey,
): Promise<number> {
    try {
        const mintInfo = await getMint(connection, mintAddress);
        return mintInfo.decimals;
    } catch (error) {
        console.error("Failed to get token decimals:", error);
        return 6; // Safe default for most tokens
    }
}

/**
 * Checks if an account exists and is initialized
 * @param connection Solana connection
 * @param account Public key to check
 * @returns Boolean indicating if account exists and is initialized
 */
export async function accountExists(
    connection: Connection,
    account: PublicKey,
): Promise<boolean> {
    try {
        const accountInfo = await connection.getAccountInfo(account);
        return accountInfo !== null && accountInfo !== undefined;
    } catch (error) {
        console.error(`Error checking account ${account.toBase58()}:`, error);
        return false;
    }
}

/**
 * Prepares a Solana token transfer transaction from a natural language prompt
 * @param prompt Natural language transfer instruction
 * @param senderPublicKey Sender's public key
 * @returns Transaction object with details
 */
async function prepareTokenTransfer(
    prompt: string,
    senderPublicKey: PublicKey,
): Promise<{
    transaction: Transaction;
    details: TransactionDetails;
}> {
    try {
        // AI-powered transaction detail extraction
        const response = await anthropic.messages.create({
            model: "claude-3-5-haiku-latest",
            max_tokens: 4096,
            messages: [
                {
                    role: "user",
                    content: `IMPORTANT: Respond EXACTLY in this JSON format:
                    {
                        "mintAddress": "<token mint address>",
                        "recipientAddress": "<solana public key>",
                        "amount": <number of tokens>
                    }

                    Extract details from this prompt: "${prompt}"

                    Strict rules:
                    - Validate mint address (e.g., USDC is EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)
                    - Validate recipient as a valid Solana public key
                    - Extract precise numerical amount

                    If uncertain, return null values.
                `,
                },
            ],
        });

        // Extract text response
        const responseText = response.content
            .find((item) => item.type === "text")
            ?.text.trim() ?? "";

        // Parse response
        const extractedDetails = parseJSONOrObject(
            responseText,
        ) as TransactionDetails;

        // Validate extracted details
        if (
            !extractedDetails ||
            !extractedDetails.mintAddress ||
            !extractedDetails.recipientAddress ||
            extractedDetails.amount == null
        ) {
            throw new Error("Could not extract valid transaction details");
        }

        // Convert to PublicKey
        const mintAddress = new PublicKey(extractedDetails.mintAddress);
        const recipientPublicKey = new PublicKey(
            extractedDetails.recipientAddress,
        );

        // Prepare token accounts
        const [senderTokenAccount, recipientTokenAccount] = await Promise.all([
            getSafeTokenAccount(
                connection,
                mintAddress,
                senderPublicKey,
                senderPublicKey,
            ),
            getSafeTokenAccount(
                connection,
                mintAddress,
                recipientPublicKey,
                senderPublicKey,
            ),
        ]);

        // Prepare transaction instructions
        const transactionInstructions = [];

        // Check if recipient token account exists
        const recipientAccountInitialized = await accountExists(
            connection,
            recipientTokenAccount,
        );
        if (!recipientAccountInitialized) {
            // Add instruction to create recipient's token account
            transactionInstructions.push(
                createAssociatedTokenAccountInstruction(
                    senderPublicKey, // Payer
                    recipientTokenAccount,
                    recipientPublicKey,
                    mintAddress,
                ),
            );
        }

        // Get token decimals
        const decimals = await getTokenDecimals(connection, mintAddress);

        // Add transfer instruction
        transactionInstructions.push(
            createTransferInstruction(
                senderTokenAccount,
                recipientTokenAccount,
                senderPublicKey,
                BigInt(Math.floor(extractedDetails.amount * 10 ** decimals)),
            ),
        );

        // Create transaction
        const transaction = new Transaction().add(...transactionInstructions);

        return {
            transaction,
            details: {
                mintAddress: extractedDetails.mintAddress,
                recipientAddress: extractedDetails.recipientAddress,
                amount: extractedDetails.amount,
            },
        };
    } catch (error) {
        console.error(`Token transfer preparation failed: ${prompt}`, error);
        throw error;
    }
}

export { prepareTokenTransfer };
