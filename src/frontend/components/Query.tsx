import { Flex, TextField, Button, Text, Box, Spinner } from "@radix-ui/themes";
import { RocketIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useQuery } from "../hooks/useQuery";
import { TinyBirdTable } from "./TinyBirdTable";

interface QueryProps {
    selectedTable: string;
}

export const Query = ({ selectedTable }: QueryProps) => {
    const [query, setQuery] = useState("");
    const { result, loading, error, handleQuery } = useQuery();

    const handleSubmit = () => {
        if (!loading && query.trim() && selectedTable) {
            handleQuery(query, selectedTable);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Flex direction="column" align="center" justify="center" gap="3" style={{ width: "100%" }}>
            {/* Query input */}
            <Flex align="center" gap="3" style={{ width: "100%" }}>
                <TextField.Root 
                    style={{ flex: 1 }} 
                    size="3" 
                    placeholder="Type something..." 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                />
                <Button 
                    size="3" 
                    onClick={handleSubmit}
                    disabled={loading || !selectedTable}
                >
                    {loading ? (
                        <Spinner size="2" />
                    ) : (
                        <RocketIcon />
                    )}
                </Button>
            </Flex>
            {error && <Text color="red">Error: {error}</Text>}
            {result && result.sql && (
                <Box style={{ width: "100%", padding: "8px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                    <Text size="2" style={{ fontFamily: "monospace" }}>
                        {result.sql}
                    </Text>
                </Box>
            )}
            {result && result.result && (
                <Box style={{ width: "100%", overflowX: "auto" }}>
                    <TinyBirdTable response={result.result} />
                </Box>
            )}
        </Flex>
    );
};
