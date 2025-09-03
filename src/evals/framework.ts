import { naturalLanguageToSql } from "../backend/openAi";
import type { Table } from "../backend/tinybird/tables";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export interface EvalResult {
    confidence: number;
    reasoning: string;
}

export const evalSQLIntent = async (
    userQuery: string, 
    sqlStatement: string, 
    table: Table
): Promise<EvalResult> => {

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `You are a SQL query evaluator. Analyze whether the provided SQL statement correctly matches the user's intent.
                
Table schema:
${table.columns.map(col => `- ${col.name} (${col.type})`).join('\n')}

Respond with a JSON object containing:
- confidence: number between 0 and 1 indicating your confidence that the SQL statement correctly matches the user's intent
- reasoning: brief explanation of your evaluation`
            },
            {
                role: "user",
                content: `User Query: "${userQuery}"
                
Generated SQL: ${sqlStatement}
                
Does this SQL correctly implement the user's intent?`
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0,
        logprobs: true,
        top_logprobs: 1
    });

    const content = response?.choices[0]?.message?.content;
    if (!content) {
        throw new Error("No response from evaluation");
    }

    const result = JSON.parse(content) as EvalResult;
    
    return result;
}

export const evalSQLCorrectness = async (
  sqlStatement: string, 
  table: Table
): Promise<EvalResult> => {

  const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          {
              role: "system",
              content: `You are a SQL query correctness evaluator. Looking at the SQL statement determine if there are any syntax errors that would make this SQL statement invalid.

              Respond with a JSON object containing:
- confidence: number between 0 and 1 indicating your confidence that fields are used correctly
- reasoning: brief explanation of your evaluation`
          },
          {
              role: "user",
              content: sqlStatement
          }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
  });

  const content = response?.choices[0]?.message?.content;
  if (!content) {
      throw new Error("No response from evaluation");
  }

  const result = JSON.parse(content) as EvalResult;
  
  return result;
}

export const evalSQLFieldCorrectness = async (
  sqlStatement: string, 
  table: Table
): Promise<EvalResult> => {

  const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          {
              role: "system",
              content: `You are a SQL query correctness evaluator. Looking at the table schema and the following SQL statement determin if 
              there are any fields in the SQL statement that are used incorrectly based on the table schema. For example are there any string type
              fields used in a SUM function, any number field used in a LIKE function etc.
              
Table schema:
${table.columns.map(col => `- ${col.name} (${col.type})`).join('\n')}

Respond with a JSON object containing:
- confidence: number between 0 and 1 indicating your confidence that fields are used correctly
- reasoning: brief explanation of your evaluation`
          },
          {
              role: "user",
              content: sqlStatement
          }
      ],
      response_format: { type: "json_object" },
      temperature: 0,
  });

  const content = response?.choices[0]?.message?.content;
  if (!content) {
      throw new Error("No response from evaluation");
  }

  const result = JSON.parse(content) as EvalResult;
  
  return result;
}
