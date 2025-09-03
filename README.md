## Natural Language Querying of Tinybird Data
This project is a frontend and backend for querying specific datasets from TinyBird. Right now the only 2 supported datasets are LEGO and US Government Spending data but the code could be extended to other datasets.

### Hosted
Hosted version can be found [here](https://nlp-query-production.up.railway.app)

### Data
There are [2 data sources available](./src/backend/tinybird/tables.ts). One is a list of LEGO sets released throughout the years with some details. This is a simpler dataset and most NLP queries the model can get with a one-shot. The second data source is a list of US Govt budgets by Agency. This dataset is a lot more complex with multiple ways to slice the number, heirarchical parent child relationships between the agencies etc. I tried this one to see how far the model could get with one-shotting but it's probably a little complex. Most likely the model would need to make multiple SQL queries to get a sense of the data structure before finally being able to answer a user's question. Multi-step response is not implemented yet so NLP queries on this data set are less accurate.

### GPT-5 Context Free Grammar
This repo contains a function to generate a Context Free Grammar for SQL queries based on a database schema: [generateCfg](./src/backend/openAi.ts). The CFG contains many common SQL functions and limits generated SQL statements to only use available table name, column names and to only use column types with correct operations (e.g. numeric columns with SUM(), string columns with LIKE etc)

### Evals
This repo [defines 3 evals](./src/evals/framework.ts)
1. SQL Intent: Tries to just how accurately the NLP query matches the resulting SQL statement
2. SQL Correctness: Checks for syntax errors in the generated SQL (maybe could have been done without LLM help)
3. SQL Field Correctness: Checks for fields that are used incorrectly e.g. numeric field used in a LIKE statement

### Learnings on GPT-5 CFG
Compiled some [learnings](./GPT-5-CFGs.md) on the CFG api
