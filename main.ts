import { createRedisCache, delay, getArg } from "./server/util";
import { Elysia, t, TSchema } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import "./dist/server/entry.mjs";
import { vikeMiddleware } from "server/middleware";
import { getIntent } from "server/prompt/intent";
import { ElysiaWS } from "elysia/ws";
import { WebSocketServer } from "vite";
import { ServerWebSocket } from "bun";
import { TypeCheck } from "elysia/type-system";

Bun.env.NODE_ENV = process.env.NODE_ENV ?? "production";
const port = getArg("port", process.env.PORT ?? 9000);
const hostname = getArg("host", "127.0.0.1");

const __CLIENTS__ = new Map<
    string,
    ElysiaWS<ServerWebSocket<{ validator?: TypeCheck<TSchema> }>>
>();

const __CHAT__ = new Map<string, string[]>();

const vike = new Elysia().get("*", async (req: Request) => {
    const { body, headers, statusCode } = await vikeMiddleware(req);
    return new Response(body, {
        status: statusCode,
        headers,
    });
});

// const cache = new Elysia().decorate(
//     "cache",
//     await createRedisCache(),
// );

const app = new Elysia({
    serve: {
        hostname,
    },
}).use(staticPlugin({
    prefix: "/assets",
    assets: "dist/client/assets/",
    alwaysStatic: true,
}));

app.post("/streams", async ({ request }) => {
    if (request.headers.get("api-key") !== Bun.env.STREAM_KEY) {
        return new Response(null, { status: 401 });
    }
    console.log("Message from upstream: quicknode");

    const data = await request.json();
    try {
        delay("publish-stream", async () => {
            // cache.publish(
            //     "/stream",
            //     JSON.stringify(data),
            // );
            __CLIENTS__.forEach((ws) => ws.send(JSON.stringify(data)));
        }, 2000);
    } catch (error) {
        console.error(error);
    }
    return new Response("success", { status: 200 });
});

app.ws("/live", {
    open(ws) {
        console.log(`${ws.id} connected`);
        // new Promise(async () => {
        //     (await createRedisCache()).subscribe(
        //         "/stream",
        //         (msg) => {
        //             ws.send(msg);
        //         },
        //     );
        // });
        __CLIENTS__.set(
            ws.id,
            ws as unknown as ElysiaWS<
                ServerWebSocket<{
                    validator?: TypeCheck<TSchema>;
                }>
            >,
        );
    },
    close(ws, code, message) {
        console.log(`${ws.id} disconnected, ${code} ${message}`);
        __CLIENTS__.delete(ws.id);
    },
    message(ws) {
        ws.send("pong");
    },
});

app.get(
    "/api/chat-history/:address",
    async ({ params: { address } }) => {
        if (address) {
            const chat = __CHAT__.get(address) ?? [];
            return { chat };
        }
    },
);

app.post(
    "/api/intent",
    async ({ request }) => {
        const body = await request.json();
        if (!body.prompt) {
            return {};
        }
        if (body.address) {
            const chats = __CHAT__.get(body.address) ?? [];
            __CHAT__.set(body.address, chats.concat(body.prompt));
        }
        return await getIntent(body.prompt);
    },
);

app.use(vike);
app.listen(port);
console.log(`Server started on: http://${hostname}:${port}`);
