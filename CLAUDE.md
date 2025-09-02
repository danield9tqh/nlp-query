# Context Free Grammars + Eval Toy

## Project Overview
A TypeScript application for experimenting with GPT-5's Context Free Grammar (CFG) support to query TinyBird data using natural language.

## Architecture
A single server Bun app that 

## Requirements

### Core Features
1. Natural language query interface: "sum the total of all orders placed in the last 30 hours"
2. GPT-5 Context Free Grammar integration for query parsing
3. TinyBird data querying
4. Raw JSON response display (no need for graphs/tables)

### Deliverables
- [ ] Deployed app with natural language query interface
- [ ] CFG implementation using GPT-5's new parameters
- [ ] 3+ evaluation tests for CFG generation
- [ ] TinyBird integration with 1000+ row dataset

## Implementation Notes

### Context Free Grammar
Reference: https://cookbook.openai.com/examples/gpt-5/gpt-5_new_params_and_tools#3-contextfree-grammar-cfg

The CFG should constrain GPT-5's output to valid ClickHouse/TinyBird queries based on the schema.

### TinyBird Setup
1. Upload CSV data to TinyBird
2. Define datasource schema
3. Create API endpoints for queries
4. Store API token in backend `.env`

### Evaluation Framework
Create simple eval suite testing:
1. Query accuracy
2. CFG constraint adherence  
3. Edge case handling

## Environment Variables
```bash
# backend/.env
TINYBIRD_API_TOKEN=your_token_here
OPENAI_API_KEY=your_gpt5_key_here
```

## Deployment
Deployed on Railway with single Bun server
