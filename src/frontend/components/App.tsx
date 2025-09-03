import { useState } from "react"
import { Box, Button } from "@radix-ui/themes"
import DataPage from "./DataPage"
import RunEvals from "./RunEvals"

function App() {
  const [currentPage, setCurrentPage] = useState<'data' | 'evals'>('data')

  return (
    <Box>
      <Box position="absolute" top="4" left="4" style={{ zIndex: 1000 }}>
        <Button 
          size="3"
          onClick={() => setCurrentPage(currentPage === 'data' ? 'evals' : 'data')}
        >
          {currentPage === 'data' ? 'Run Evals' : 'Explore Data'}
        </Button>
      </Box>
      {currentPage === 'data' ? <DataPage /> : <RunEvals />}
    </Box>
  )
}

export default App
