import { useEffect, useState } from 'react';
import type { TablesResponse } from '../../backend/routes';
import type { Table } from '../../backend/tinybird/tables';

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        
        const data: TablesResponse = await response.json();
        setTables(data.tables);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tables');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []); // Only run once on mount

  return {
    tables,
    loading,
    error,
  };
};
