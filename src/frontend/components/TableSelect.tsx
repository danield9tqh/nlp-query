import { Select, Spinner } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import type { Table } from "../../backend/tinybird/tables";

interface TableSelectProps {
    tables: Table[];
    loading: boolean;
    disabled?: boolean;
    onTableChange: (tableName: string) => void;
}

export const TableSelect = ({ tables, loading, disabled, onTableChange }: TableSelectProps) => {
    const [selectedTable, setSelectedTable] = useState<string>("");

    // Set default table when tables are loaded
    useEffect(() => {
        if (tables.length > 0 && !selectedTable) {
            const firstTable = tables[0];
            if (firstTable) {
                setSelectedTable(firstTable.name);
                onTableChange(firstTable.name);
            }
        }
    }, [tables, selectedTable, onTableChange]);

    const handleValueChange = (value: string) => {
        setSelectedTable(value);
        onTableChange(value);
    };

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "200px" }}>
                <Spinner size="2" />
            </div>
        );
    }

    return (
        <div style={{ width: "200px" }}>
            <Select.Root 
                value={selectedTable} 
                onValueChange={handleValueChange}
                disabled={disabled || loading}
            >
                <Select.Trigger placeholder="Select a table" style={{ width: "100%" }} />
                <Select.Content>
                    {tables.map((table) => (
                        <Select.Item key={table.name} value={table.name}>
                            {table.name}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </div>
    );
};
