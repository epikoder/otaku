export async function GetIntentFromPrompt(prompt: string) {
    const resp = await fetch("/api/intent", {
        method: "POST",
        body: JSON.stringify({ prompt }),
    });
    switch (resp.status) {
        case 200:
            return await resp.json();
        default:
            return [];
    }
}
