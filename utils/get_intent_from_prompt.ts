export async function GetIntentFromPrompt(
    prompt: string,
    address?: string,
): Promise<SystemMessage | undefined> {
    const resp = await fetch("/api/intent", {
        method: "POST",
        body: JSON.stringify({ prompt, address }),
    });
    switch (resp.status) {
        case 200:
            return await resp.json();
        default:
            return {
                reply: "You don't appear to be connected to internet",
                intent: null,
                sender: "system",
            };
    }
}
