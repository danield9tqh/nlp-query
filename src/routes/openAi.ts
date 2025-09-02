import { describeTable, type Table } from "./tinybird/tables";
import OpenAI from "openai";
import type { ChatCompletionCustomTool } from "openai/resources/index.mjs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export const naturalLanguageToSql = async (table: Table, query: string): Promise<{sql?: string, error?: string}> => {
    const sqlGrammar = generateCfg(table);

    const customTool: ChatCompletionCustomTool = {
        type: "custom",
        custom: {
            name: "sql_generator",
            description: "Generate SQL query from natural language restricted by the table schema context free grammar",
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
                    content: `You are a SQL query generator. Use the sql_generator tool to convert natural language queries into SQL.
                    The table description is:

                    ${describeTable(table)}`
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
            const sql = customCall.custom?.input || "";
            return { sql };
        }

        return { error: "Did not use the CFG tool to generate a query" };
    } catch (error) {
        console.error("OpenAI API error:", error);
        return { 
            error: error instanceof Error ? error.message : "Failed to process query"
        };
    }
};

export const generateCfg = (table: Table) => {
    const columnNames = table.columns.map(column => `"${column.name}"`).join(" | ");
    
    const sqlGrammar = `
        start: query
        query: "SELECT " select_list " FROM " table filter? group_by? order? limit?
        select_list: select_item ("," select_item)* | "*"
        select_item: aggregate_function | column_name
        aggregate_function: count_func | sum_func | avg_func | min_func | max_func
        count_func: "COUNT(" ("*" | column_name) ")"
        sum_func: "SUM(" column_name ")"
        avg_func: "AVG(" column_name ")"
        min_func: "MIN(" column_name ")"
        max_func: "MAX(" column_name ")"
        column_name: ${columnNames}
        table: "${table.name}"
        filter: " WHERE " condition
        condition: column_name " " operator " " value
        operator: "=" | ">" | "<" | ">=" | "<=" | "!=" | "LIKE"
        value: number | string
        number: /[0-9]+/
        string: "'" /[^']*/ "'"
        group_by: " GROUP BY " column_name ("," column_name)*
        order: " ORDER BY " column_name (" ASC" | " DESC")?
        limit: " LIMIT " number
    `;

    return sqlGrammar;
};
