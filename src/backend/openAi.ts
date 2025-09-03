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
    const stringColumns = table.columns.filter(column => column.type === "string");
    const numberColumns = table.columns.filter(column => 
        ["int16", "int32", "int64", "float32", "float64", "uint8", "uint16", "uint32", "uint64"].includes(column.type)
    );
    const dateColumns = table.columns.filter(column => 
        ["date", "datetime", "timestamp"].includes(column.type)
    );
    const booleanColumns = table.columns.filter(column => column.type === "boolean");

    const stringColumnNames = stringColumns.map(column => `"${column.name}"`).join(" | ") || '""';
    const numberColumnNames = numberColumns.map(column => `"${column.name}"`).join(" | ") || '""';
    const dateColumnNames = dateColumns.map(column => `"${column.name}"`).join(" | ") || '""';
    const booleanColumnNames = booleanColumns.map(column => `"${column.name}"`).join(" | ") || '""';
    const allColumnNames = table.columns.map(column => `"${column.name}"`).join(" | ");
    
    const sqlGrammar = `
        start: query
        query: "SELECT " select_list " FROM " table filter? group_by? order? limit?
        select_list: select_item ("," select_item)* | "*"
        select_item: aggregate_function | column_name
        aggregate_function: count_func | sum_func | avg_func | min_func | max_func
        count_func: "COUNT(" ("*" | column_name) ")"
        sum_func: "SUM(" numeric_column ")"
        avg_func: "AVG(" numeric_column ")"
        min_func: "MIN(" (numeric_column | date_column | string_column) ")"
        max_func: "MAX(" (numeric_column | date_column | string_column) ")"
        column_name: ${allColumnNames}
        numeric_column: ${numberColumnNames}
        string_column: ${stringColumnNames}
        date_column: ${dateColumnNames}
        boolean_column: ${booleanColumnNames}
        table: "${table.name}"
        filter: " WHERE " condition
        condition: numeric_condition | string_condition | date_condition | boolean_condition
        numeric_condition: numeric_column " " numeric_operator " " number
        string_condition: string_column " " string_operator " " string
        date_condition: date_column " " date_operator " " date_value
        boolean_condition: boolean_column " " boolean_operator " " boolean_value
        numeric_operator: "=" | ">" | "<" | ">=" | "<=" | "!="
        string_operator: "=" | "!=" | "LIKE"
        date_operator: "=" | ">" | "<" | ">=" | "<=" | "!="
        boolean_operator: "=" | "!="
        number: /[0-9]+(\.[0-9]+)?/
        string: "'" /[^']*/ "'"
        date_value: "'" /[0-9]{4}-[0-9]{2}-[0-9]{2}/ "'"
        boolean_value: "true" | "false"
        group_by: " GROUP BY " column_name ("," column_name)*
        order: " ORDER BY " orderby_item (" ASC" | " DESC")?
        orderby_item: column_name | aggregate_function
        limit: " LIMIT " number
    `;

    return sqlGrammar;
};
