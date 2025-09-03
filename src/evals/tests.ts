import { naturalLanguageToSql } from "../backend/openAi";
import { legoSets, type Table } from "../backend/tinybird/tables";
import { evalSQLCorrectness, evalSQLFieldCorrectness, evalSQLIntent, type EvalResult } from './framework';
import { queryTinyBird, type TinyBirdResponse } from '../backend/tinybird/tinybird';

export interface TestCase {
    userQuery: string;
    table: Table;
}

export interface TestCaseResult {
    table: Table;
    userQuery: string;
    sql: string;
    sqlGenerationError?: string;
    intentResult: EvalResult;
    correctnessResult: EvalResult;
    fieldCorrectnessResult: EvalResult;
    queryResult: {
        result?: TinyBirdResponse;
        error?: string;
    };
}

export const testCases = [
    {
        userQuery: "How many sets are there in each themegroup?",
        table: legoSets,
    },
    {
        userQuery: "How many total pieces are there in sets released 70s",
        table: legoSets,
    },
    {
        userQuery: "Show me the top 10 most expensive LEGO sets that have more than 1000 pieces and related to Christmas",
        table: legoSets,
    },
];

export const runTestCase = async (testCase: TestCase): Promise<TestCaseResult> => {
    const {table, userQuery} = testCase;
    const {sql, error: sqlGenerationError} = await naturalLanguageToSql(table, userQuery);
    if (sqlGenerationError || !sql) {
        throw new Error("Failed to generate SQL");
    }

    const intentResult = await evalSQLIntent(userQuery, sql, table);
    const correctnessResult = await evalSQLCorrectness(sql, table);
    const fieldCorrectnessResult = await evalSQLFieldCorrectness(sql, table);
    const queryResult = await queryTinyBird(sql);

    return { table, userQuery, sql, sqlGenerationError, intentResult, correctnessResult, fieldCorrectnessResult, queryResult };
}

export function testCaseToOutput(testCase: {
    table: Table;
    userQuery: string;
    sql: string;
    sqlGenerationError?: string;
    intentResult: EvalResult;
    correctnessResult: EvalResult;
    fieldCorrectnessResult: EvalResult;
    queryResult: {
        result?: TinyBirdResponse;
        error?: string;
    };
}): string[] {
    const output = [];
    output.push(`========================================`);
    output.push(`Test case: ${testCase.userQuery}`);
    output.push(`SQL: ${testCase.sql}`);

    if (testCase.sqlGenerationError) {
        output.push(`❌ SQL generation error : ${testCase.sqlGenerationError}`);
        return output;
    }

    const intentResult = testCase.intentResult.confidence >= 0.8 ? "✅" : "❌";
    output.push(`${intentResult} SQL Intent: ${testCase.intentResult.confidence}`);
    output.push(`      Reasoning: ${testCase.intentResult.reasoning}`);

    const correctnessResult = testCase.correctnessResult.confidence >= 0.8 ? "✅" : "❌";
    output.push(`${correctnessResult} SQL Correctness: ${testCase.correctnessResult.confidence}`);
    output.push(`      Reasoning: ${testCase.correctnessResult.reasoning}`);

    const fieldCorrectnessResult = testCase.fieldCorrectnessResult.confidence >= 0.8 ? "✅" : "❌";
    output.push(`${fieldCorrectnessResult} SQL Field Correctness: ${testCase.fieldCorrectnessResult.confidence}`);
    output.push(`      Reasoning: ${testCase.fieldCorrectnessResult.reasoning}`);

    if (testCase.queryResult.error) {
        output.push(`❌ Query error: ${testCase.queryResult.error}`);
    }

    return output
}
