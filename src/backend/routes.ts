import { Hono } from "hono";
import { queryTinyBird, type TinyBirdResponse } from "./tinybird/tinybird";
import { getTableByName, getTables, type Table } from "./tinybird/tables";
import * as OpenAI from "./openAi";
import { testCases, runTestCase, testCaseToOutput } from "../evals/tests";

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
    const tableName = body.table;

    const table = getTableByName(tableName);

    if (!table) {
        return c.json({
            status: "error",
            error: "Invalid table"
        }, 400);
    }

    const { sql, error } = await OpenAI.naturalLanguageToSql(table, query);

    if (error || !sql) {
        console.error(`Failed to generate SQL: ${error}, Query: ${query}, Table: ${tableName}`);
        return c.json({
            status: "error",
            sql,
            error: error || "Failed to generate SQL"
        }, 500);
    }

    const {result, error: queryError} = await queryTinyBird(sql);

    if (queryError || !result) {
        console.error(`Failed to query TinyBird: ${queryError}, SQL: ${sql}, Query: ${query}, Table: ${tableName}`);
        return c.json({
            status: "error",
            sql,
            error: queryError || "Failed to query TinyBird"
        }, 500);
    }

    console.log(`Successfully returned: Query: ${query}, Table: ${tableName}, SQL: ${sql}`);
    return c.json({
        status: "ok",
        sql,
        result,
    });
});

export type TablesResponse = {
    status: 'ok' | 'error';
    tables: Table[];
};

api.get("/tables", async (c) => {
    return c.json({
        status: "ok",
        tables: getTables(),
    });
});

export type EvalResponse = {
    status: "ok" | "error";
    evalOutput: string[];
}

api.post("/eval", async (c) => {
    const body = await c.req.json();
    const number = body.testNumber;

    const testCase = testCases[number];
    if (!testCase) {
        return c.json({
            status: "error",
            error: "Invalid test number"
        }, 400);
    }

    const evalOutput = await runTestCase(testCase);
    const output = testCaseToOutput(evalOutput);
    return c.json({
        status: "ok",
        evalOutput: output,
    });
});

export default api;
