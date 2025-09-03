import { Query } from "./Query"
import { TableSelect } from "./TableSelect"
import { useTables } from "../hooks/useTables"
import { useState } from "react"
import { Box, Flex, Heading, Text, Table } from "@radix-ui/themes"

function DataPage() {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const { tables, loading: tablesLoading } = useTables();
  
  const currentTable = tables.find(t => t.name === selectedTable);

  const handleTableChange = (tableName: string) => {
    setSelectedTable(tableName);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 relative">
      {/* Table selector in top right corner */}
      <Box style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <TableSelect 
          tables={tables}
          loading={tablesLoading}
          disabled={false}
          onTableChange={handleTableChange}
        />
      </Box>

      {/* Table name and description at the top */}
      <Flex direction="column" align="center" gap="3" style={{ paddingTop: "80px", paddingBottom: "40px" }}>
        {currentTable && (
          <>
            <Heading size="8" style={{ textAlign: "center", color: "var(--accent-11)" }}>
              {currentTable.readableName}
            </Heading>
            <Text size="4" style={{ textAlign: "center", color: "var(--gray-11)", marginBottom: "20px" }}>
              {currentTable.description}
            </Text>
            
            {/* Column schema table */}
            <Box style={{ width: "60%", padding: "0 20px", overflowX: "auto" }}>
              <Table.Root variant="surface" size="1">
                <Table.Header>
                  <Table.Row>
                    {currentTable.columns.map((column) => (
                      <Table.ColumnHeaderCell key={column.name} style={{ fontFamily: "monospace", fontSize: "0.85em" }}>
                        {column.name}
                      </Table.ColumnHeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    {currentTable.columns.map((column) => (
                      <Table.Cell key={column.name} style={{ color: "var(--gray-11)", fontSize: "0.85em" }}>
                        {column.type}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Box>
          </>
        )}
      </Flex>

      {/* Query component in the center */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-1/2 px-6">
          <Query selectedTable={selectedTable} />
        </div>
      </div>
    </div>
  )
}

export default DataPage
