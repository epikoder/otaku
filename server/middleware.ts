import { RedirectStatusCode } from "node_modules/vike/dist/esm/shared/route/abort";
import { renderPage } from "vike/server";

export const vikeMiddleware = async (request: Request): Promise<{
    body: string;
    statusCode: 200 | 404 | 500 | RedirectStatusCode;
    headers: [string, string][];
}> => {
    const pageContextInit = { urlOriginal: request.url };
    const pageContext = await renderPage(pageContextInit);
    const { body, statusCode, headers } = pageContext.httpResponse;
    const response = { body, statusCode, headers };
    return response;
};


