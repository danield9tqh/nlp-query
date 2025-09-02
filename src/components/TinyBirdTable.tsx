import { Table } from "@radix-ui/themes";

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

export const TinyBirdTable = ({ response }: TinyBirdTableProps) => {
    if (!response || !response.data || response.data.length === 0) {
        return <div>No data to display</div>;
    }

    return (
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
                {response.data.map((row, rowIndex) => (
                    <Table.Row key={rowIndex}>
                        {response.meta.map((column) => (
                            <Table.Cell key={column.name}>
                                {row[column.name] !== null ? String(row[column.name]) : "-"}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
};
