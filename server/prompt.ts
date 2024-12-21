import OpenAI from "openai";

const openai = new OpenAI({
    organization: Bun.env.OPENAI_ORG,
    apiKey: Bun.env.OPENAI_KEY,
});

const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ "role": "user", "content": "Say this is a test!" }],
    temperature: 0.7,
    stream: true,
});

for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
