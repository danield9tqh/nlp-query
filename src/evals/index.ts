
import { runTestCase, testCases, testCaseToOutput } from "./tests";

for (const testCase of testCases) {
    const result = await runTestCase(testCase);
    const output = testCaseToOutput(result);
    console.log(output.join("\n"));
}
