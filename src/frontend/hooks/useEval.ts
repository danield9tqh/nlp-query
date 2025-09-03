import { useState } from "react";
import type { EvalResponse } from "../../backend/routes";

export const useEval = () => {
    const [result, setResult] = useState<EvalResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRunEval = (testNumber: number) => {
        setLoading(true);
        setError("");
        setResult(null);
        fetch("/api/eval", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ testNumber: testNumber }),
        }).then(res => res.json()).then((data: EvalResponse) => {
            if (data.status === "error") {
                setError(data.error || "Failed to run eval");
            } else {
                setResult(data);
            }
            setLoading(false);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    return { result, loading, error, handleRunEval };
};
