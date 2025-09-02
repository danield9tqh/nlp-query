import { Hono } from "hono";
import OpenAI from "openai";
import type { ChatCompletionCustomTool } from "openai/resources/chat/completions";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

const api = new Hono().basePath("/api");
api.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

api.post("/query", async (c) => {
    const body = await c.req.json();
    const query = body.query;
    
    // Basic CFG for SQL-like query structure using Lark syntax
    const sqlGrammar = `
        start: query
        query: "SELECT " columns " FROM " table filter? order? limit?
        columns: column ("," column)* | "*"
        column: /[a-zA-Z_][a-zA-Z0-9_]*/
        table: /[a-zA-Z_][a-zA-Z0-9_]*/
        filter: " WHERE " condition
        condition: column " " operator " " value
        operator: "=" | ">" | "<" | ">=" | "<=" | "!=" | "LIKE"
        value: number | string
        number: /[0-9]+/
        string: "'" /[^']*/ "'"
        order: " ORDER BY " column (" ASC" | " DESC")?
        limit: " LIMIT " number
    `;
    
    const customTool: ChatCompletionCustomTool = {
        type: "custom",
        custom: {
            name: "sql_generator",
            description: "Generate SQL query from natural language",
            format: {
                type: "grammar",
                grammar: {
                    syntax: "lark",
                    definition: sqlGrammar
                }
            }
        }
    };
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-5",
            messages: [
                {
                    role: "system",
                    content: "You are a SQL query generator. Use the sql_generator tool to convert natural language queries into SQL."
                },
                {
                    role: "user",
                    content: query
                }
            ],
            tools: [customTool],
            tool_choice: { type: "custom", custom: { name: "sql_generator" } }
        });
        
        const message = completion.choices[0]?.message;
        const toolCalls = message?.tool_calls;  
        
        if (toolCalls && toolCalls.length > 0) {
            const customCall = toolCalls[0] as any;
            const sqlQuery = customCall.custom?.input || "";
            
            return c.json({ 
                status: "ok", 
                query: query,
                sql: sqlQuery,
                cfg_used: true,
                raw_response: completion.choices[0]
            });
        }
        
        return c.json({ 
            status: "ok", 
            query: query,
            message: message?.content,
            cfg_used: false
        });
    } catch (error) {
        console.error("OpenAI API error:", error);
        return c.json({ 
            status: "error", 
            message: error instanceof Error ? error.message : "Failed to process query"
        }, 500);
    }
});

export default api;
