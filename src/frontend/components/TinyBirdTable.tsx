import { Table, Flex, Button, Text } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

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

interface TinyBirdTableProps {
    response: TinyBirdResponse;
}

const ITEMS_PER_PAGE = 10;

export const TinyBirdTable = ({ response }: TinyBirdTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    if (!response || !response.data || response.data.length === 0) {
        return <div>No data to display</div>;
    }

    const totalPages = Math.ceil(response.data.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = response.data.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    return (
        <Flex direction="column" gap="3" style={{ width: "100%" }}>
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        {response.meta.map((column) => (
                            <Table.ColumnHeaderCell key={column.name}>
                                {column.name}
                            </Table.ColumnHeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {currentData.map((row, rowIndex) => (
                        <Table.Row key={startIndex + rowIndex}>
                            {response.meta.map((column) => (
                                <Table.Cell key={column.name}>
                                    {row[column.name] !== null ? String(row[column.name]) : "-"}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            {totalPages > 1 && (
                <Flex align="center" justify="between" style={{ width: "100%" }}>
                    <Text size="2" color="gray">
                        Showing {startIndex + 1}-{Math.min(endIndex, response.data.length)} of {response.data.length} rows
                    </Text>
                    <Flex gap="2" align="center">
                        <Button 
                            size="2" 
                            variant="soft" 
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeftIcon />
                            Previous
                        </Button>
                        <Text size="2">
                            Page {currentPage} of {totalPages}
                        </Text>
                        <Button 
                            size="2" 
                            variant="soft" 
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRightIcon />
                        </Button>
                    </Flex>
                </Flex>
            )}

            {response.statistics && (
                <Text size="1" color="gray">
                    Query executed in {response.statistics.elapsed.toFixed(3)}s • 
                    {response.statistics.rows_read} rows read • 
                    {response.statistics.bytes_read} bytes read
                </Text>
            )}
        </Flex>
    );
};
