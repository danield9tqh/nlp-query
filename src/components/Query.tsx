import { Flex, TextField, Button, Text } from "@radix-ui/themes";
import { RocketIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useQuery } from "./hooks/useQuery";

export const Query = () => {
    const [query, setQuery] = useState("");
    const { result, loading, error, handleQuery } = useQuery();

    return (
        <Flex direction="column" align="center" justify="center" gap="3" style={{ width: "100%" }}>
            <Flex align="center" justify="center" gap="3" style={{ width: "100%" }}>
            <TextField.Root style={{ flex: 1 }} size="3" placeholder="Type something..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button size="3" onClick={() => handleQuery(query)}>
                <RocketIcon />
            </Button>
            </Flex>
            {error && <Text>Error: {error}</Text>}
            {loading && <Text>Loading...</Text>}
            {result && <Text>Result: {result}</Text>}
        </Flex>
    );
};
