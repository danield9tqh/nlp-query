const TINYBIRD_API_URL = "https://api.us-east.tinybird.co/v0/sql";
const TINYBIRD_TOKEN = process.env.TINYBIRD_API_TOKEN

export interface TinyBirdResponse {
    meta: Array<{
        name: string;
        type: string;
    }>;
    data: Array<Record<string, any>>;
    rows: number;
    rows_before_limit_at_least?: number;
    statistics?: {
        elapsed: number;
        rows_read: number;
        bytes_read: number;
    };
}

export async function queryTinyBird(sql: string): Promise<{result?: TinyBirdResponse, error?: string}> {
    console.log("Executing SQL:", sql);
    
    // Ensure the query ends with FORMAT JSON
    const sqlWithFormat = sql.trim().toUpperCase().endsWith('FORMAT JSON') 
        ? sql 
        : `${sql} FORMAT JSON`;
    
    try {
        const response = await fetch(TINYBIRD_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TINYBIRD_TOKEN}`,
            },
            body: new URLSearchParams({
                q: sqlWithFormat
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`TinyBird API error: ${response.status} - ${error}`);
        }

        const data = await response.json() as TinyBirdResponse;
        
        return { result: data };
    } catch (error) { 
        console.error("TinyBird query error:", error);
        return { error: error instanceof Error ? error.message : "Failed to query TinyBird" };
    }
}
