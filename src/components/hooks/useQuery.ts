import { useState } from "react";

export const useQuery = () => {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleQuery = (query: string) => {
        setLoading(true);
        setError("");
        setResult("");
        fetch("/api/query", {
            method: "POST",
            body: JSON.stringify({ query }),
        }).then(res => res.json()).then(data => {
            console.log(data);
            setResult(data.sql);
            setLoading(false);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    return { result, loading, error, handleQuery };
};
