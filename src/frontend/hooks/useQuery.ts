import { useState } from "react";
import type { QueryResponse } from "../../backend";

export const useQuery = () => {
    const [result, setResult] = useState<QueryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleQuery = (query: string) => {
        setLoading(true);
        setError("");
        setResult(null);
        fetch("/api/query", {
            method: "POST",
            body: JSON.stringify({ query }),
        }).then(res => res.json()).then((data: QueryResponse) => {
            if (data.status === "error") {
                setError(data.error || "Failed to query");
            } else {
                setResult(data);
            }
            setLoading(false);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    return { result, loading, error, handleQuery };
};
