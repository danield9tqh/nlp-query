import { Hono } from "hono";
import { queryTinyBird, type TinyBirdResponse } from "./tinybird/tinybird";
import { legoSets } from "./tinybird/tables";
import * as OpenAI from "./openAi";

const api = new Hono().basePath("/api");

api.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

export type QueryResponse = {
    status: "ok" | "error";
    sql?: string;
    result?: TinyBirdResponse;
    error?: string;
}

api.post("/query", async (c) => {
    const body = await c.req.json();
    const query = body.query;

    const { sql, error } = await OpenAI.naturalLanguageToSql(legoSets, query);

    if (error || !sql) {
        return c.json({
            status: "error",
            sql,
            error: error || "Failed to generate SQL"
        }, 500);
    }

    const {result, error: queryError} = await queryTinyBird(sql);

    if (queryError || !result) {
        return c.json({
            status: "error",
            sql,
            error: queryError || "Failed to query TinyBird"
        }, 500);
    }

    return c.json({
        status: "ok",
        sql,
        result,
    });
});

export default api;
