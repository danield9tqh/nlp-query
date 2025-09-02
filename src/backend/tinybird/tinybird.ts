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

export const legoSets: Table = {
    name: "lego_sets",
    columns: [
        { name: "_set_id", type: "string" },
        { name: "name", type: "string" },
        { name: "year", type: "int32" },
        { name: "theme", type: "string" },
        { name: "subtheme", type: "nullable(string)" },
        { name: "themegroup", type: "string" },
        { name: "category", type: "string" },
        { name: "pieces", type: "nullable(int32)" },
        { name: "minifigs", type: "nullable(string)" },
        { name: "agerange_min", type: "nullable(string)" },
        { name: "us_retailprice", type: "nullable(string)" },
        { name: "brickseturl", type: "string" },
        { name: "thumbnailurl", type: "nullable(string)" },
        { name: "imageurl", type: "nullable(string)" }
    ],
};

export type Table = {
    name: string;
    columns: Column[];
}
export type Column = {
    name: string;
    type: ColumnType;
}

export type ColumnType = "int32" | "string" | "nullable(string)" | "nullable(int32)";
