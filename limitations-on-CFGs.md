### 'AS' Statements
Statements like `SELECT COUNT(*) as count` are tricky. They are possible but only if we choose to allow arbitrary identifiers in other parts of the query. Describing the table and columns would probably be sufficient for an LLM to not make any mistakes on writing identifiers but if you really cared 'correct' SQL you could limit identifiers to just column names and not support renaming with 'AS'

### Performance
Calls using the CFG are consistently slow. Not sure if it is the cause or not but should do some more testing
