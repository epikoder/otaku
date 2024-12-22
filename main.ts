import { createRedisCache, delay, getArg } from "./server/util";
import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import "./dist/server/entry.mjs";
import { vikeMiddleware } from "server/middleware";

Bun.env.NODE_ENV = process.env.NODE_ENV ?? "production";
const port = getArg("port", process.env.PORT ?? 9000);
const hostname = getArg("host", "127.0.0.1");

const vike = new Elysia().get("*", async (req: Request) => {
    const { body, headers, statusCode } = await vikeMiddleware(req);
    return new Response(body, {
        status: statusCode,
        headers,
    });
});

const cache = new Elysia().decorate(
    "cache",
    await createRedisCache(),
);

const app = new Elysia({
    serve: {
        hostname,
    },
}).use(staticPlugin({
    prefix: "/assets",
    assets: "dist/client/assets/",
    alwaysStatic: true,
}));

app.use(cache).post("/streams", async ({ cache, request }) => {
    if (request.headers.get("api-key") !== Bun.env.STREAM_KEY) {
        return new Response(null, { status: 401 });
    }
    console.log("Message from upstream: quicknode");

    const data = await request.json();
    try {
        delay("publish-stream", async () =>
            cache.publish(
                "/stream",
                JSON.stringify(data),
            ), 2000);
    } catch (error) {
        console.error(error);
    }
    return new Response("success", { status: 200 });
});

app.ws("/live", {
    open(ws) {
        console.log(`${ws.id} connected`);
        new Promise(async () => {
            (await createRedisCache()).subscribe(
                "/stream",
                (msg) => {
                    ws.send(msg);
                },
            );
        });
    },
    close(ws, code, message) {
        console.log(`${ws.id} disconnected, ${code} ${message}`);
    },
    message(ws) {
        ws.send("pong");
    },
});

app.use(cache).get(
    "/api/chat-history/:address",
    async ({ cache, params: { address } }) => {
        if (address) {
            const chatString = await cache.get(address);
            if (!chatString) return {};
            const chat = JSON.parse(chatString);
            return { chat };
        }
    },
);

app.use(vike);
app.listen(port);
console.log(`Server started on: http://${hostname}:${port}`);
