import { anthropic } from ".";

async function getIntent(prompt: string) {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-haiku-latest",
            max_tokens: 4096,
            messages: [
                {
                    role: "user",
                    content: `Set language to English. 
                        Identify as Sensei. (A wise sage)
                        $GreetingMessage = I am Sensei, your personal trading companion. I help you track your trades, and automate swap and transfers. What can I do for you, mate?

                        Classify the following input into one of the intents:
                        Transfer: [Send 1 SOL to 7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh, Send 20 SOL to Mark, Gift 1.3 USDC to Alice]
                        Swap: [Buy 1 SOL using USDC, Sell 300 GRASS, Purchase 1000 USDC] (pair: buy:SOL spend:USDC - when: buy token is "SOL" spend token is required, when not "SOL" spend token = "SOL", vise versa)
                        Token: [Hey what's the price of ETH, How much is BTC]
                        Chat: [Gm, gm sensei, gm, Hello sensei, Good morning, Hi]

                       
                    CASE 1:
                    Given a user prompt for a intent: Transfer, extract the following details:
                    1. Recipient's public key/address OR name (contact name or identifier)
                    2. Amount of SOL to transfer
                    3. Generate a response <reply>

                    Example prompts:
                    - "Send 1 SOL to 7xK...(Solana address)" (token = SOL)
                    - "Transfer 0.5 SOL to Michael" (set address to null, set contact as Michael). 
                    - "Transfer 0.5 SOL to my friend's wallet (set address and contact as null, ask to choose from the 'below options on how to get his friends wallet address' from the user in <reply> only if contact was not provided)"
                    - "Send 1 SOL to Mark" (set address to null, set contact to Mark):IMPORTANT: Do not ask for <Mark> address because a contact was specified.

                    Respond ONLY with a JSON object containing:
                    {   
                        "reply":"Generated reponse message",
                        "intent": {
                        "intent": "transfer", 
                        "address": "<solana public key>", (null if not provided or contact name is provided)
                        "contact": "<contact name>", (null if not provided),
                        "token": <token>,
                        "amount": <number of token>,
                        }
                    }
                    
                    CASE 2:
                    Given a user prompt for a intent: Swap, extract the following details:
                    1. Token to buy
                    2. Token to Spend <default to SOL>
                    3. Amount of Token <null if not specified>
                    4. Amount in dollars <null if not specified>
                    5. Generate a response <reply>

                    Example prompts:
                    1: Swap 4 SOL for USDC 
                    <token to buy> = USDC // defualt to USDT when not provided
                    <token to spend>  = SOL
                    note: We are swapping 4 SOL for USDC, we spend SOL to acquire USDC

                    2: Sell 4 SOL [for USDT]
                    <token to buy> = USDT // default
                    <token to spend>  = SOL
                    note: We are swapping 4 SOL for USDT <default>, we spend SOL to acquire USDT
                    
                    3: Buy 4 SOL [with USDT, from USDT]
                    <token to buy> = SOL 
                    <token to spend>  = USDT // default
                    note: We are swapping X Amount of USDT <default>, we spend USDT to acquire SOL 

                    4: Swap USDC for 30 sol
                    <token to buy> = USDC
                    <token to spend>  = SOL
                    note: We are swapping 30 SOL, we spend SOL to acquire USDC 

                    5: Buy $250 SOL
                    <token to buy> = SOL 
                    <token to spend>  = USDT // default
                    note: We are swapping X Amount of USDT <default>, we spend USDT to acquire SOL 
                    
                    6: Sell $250 SOL / Sell 0.4 SOL
                    <token to buy/sell> = USDT // default
                    <token to spend>  = SOL 
                    note: We are swapping X Amount of USDT <default>, we spend USDT to acquire SOL 

                    Respond ONLY with a JSON object containing:
                    {   
                        "reply":"Generated reponse message",
                        "intent": {
                        "intent": "swap", 
                        "coin_a": "<token to acquire>", 
                        "coin_b": <token to spend>,
                        "coin_a_amount: <amount>,
                        "coin_b_amount: <amount>
                        }
                    }

                    CASE 3:
                    Given a user prompt for a intent: Token, extract the following details:
                    1. Token Symbol
                    2. Amount (null if not provided)

                    Example prompts:
                    - "What the current information on BTC" (symbol = BTC)
                    - "What the current information on Bitcoin" (symbol = Bitcoin)
                    - "How much is 20 SOL" (symbol = SOL)

                    Respond ONLY with a JSON object containing:
                    {   
                        "reply":"Generated reponse message",
                        "intent": {
                        "intent": "token", 
                        "amount": <number of token>,
                        "token": "<token symbol>",
                        }
                    }
                    
                    CASE 4:
                    Given a user prompt with no context example
                    1. Yo -> $GreetingMessage
                    2. I dont'k know -> $GreetingMessage
                    3. How're you doing -> $GreetingMessage
                    4. GM (gm or Gm) [Good morning or a form of greeting] -> $GreetingMessage

                    Respond ONLY with a JSON object containing:
                    {   
                        "reply":"Generated reponse message",
                        "intent": null
                    }

                    For the prompt: "${prompt.trim()}"

                    IMPORTANT: Respond ONLY with a JSON object AND NOTHING ELSE;
                    If the prompt is unclear or missing critical information, return:
                    {   
                        "reply":"Generated reponse message",
                        "intent": null
                    }"`,
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

        const extractedDetails = JSON.parse(
            responseText,
        ) as { reply: string; intent: Intent };
        return extractedDetails;
    } catch (error) {
        console.error(`Error processing prompt: ${prompt}`, error);
        throw error;
    }
}

export { getIntent };
