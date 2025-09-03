import { Box, Flex, Button, Text, Card } from "@radix-ui/themes"
import { useEval } from "../hooks/useEval"

function RunEvals() {
  const eval1 = useEval()
  const eval2 = useEval()
  const eval3 = useEval()

  return (
    <Box p="6" pt="9">
      <Flex gap="4" style={{ width: "100%" }}>
        {/* Eval 1 Column */}
        <Box style={{ flex: 1 }}>
          <Button 
            size="3" 
            onClick={() => eval1.handleRunEval(0)}
            disabled={eval1.loading}
            style={{ width: "100%" }}
          >
            {eval1.loading ? "Running..." : "Run Eval 1"}
          </Button>
          
          {eval1.error && (
            <Card mt="3">
              <Text color="red">Error: {eval1.error}</Text>
            </Card>
          )}
          
          {eval1.result && eval1.result.evalOutput && (
            <Card mt="3">
              <Text size="2" weight="bold">Result:</Text>
              <Box mt="2">
                {eval1.result.evalOutput.map((line, index) => (
                  <Text key={index} size="2" as="div" style={{ fontFamily: "monospace" }}>
                    {line}
                  </Text>
                ))}
              </Box>
            </Card>
          )}
        </Box>

        {/* Eval 2 Column */}
        <Box style={{ flex: 1 }}>
          <Button 
            size="3" 
            onClick={() => eval2.handleRunEval(1)}
            disabled={eval2.loading}
            style={{ width: "100%" }}
          >
            {eval2.loading ? "Running..." : "Run Eval 2"}
          </Button>
          
          {eval2.error && (
            <Card mt="3">
              <Text color="red">Error: {eval2.error}</Text>
            </Card>
          )}
          
          {eval2.result && eval2.result.evalOutput && (
            <Card mt="3">
              <Text size="2" weight="bold">Result:</Text>
              <Box mt="2">
                {eval2.result.evalOutput.map((line, index) => (
                  <Text key={index} size="2" as="div" style={{ fontFamily: "monospace" }}>
                    {line}
                  </Text>
                ))}
              </Box>
            </Card>
          )}
        </Box>

        {/* Eval 3 Column */}
        <Box style={{ flex: 1 }}>
          <Button 
            size="3" 
            onClick={() => eval3.handleRunEval(2)}
            disabled={eval3.loading}
            style={{ width: "100%" }}
          >
            {eval3.loading ? "Running..." : "Run Eval 3"}
          </Button>
          
          {eval3.error && (
            <Card mt="3">
              <Text color="red">Error: {eval3.error}</Text>
            </Card>
          )}
          
          {eval3.result && eval3.result.evalOutput && (
            <Card mt="3">
              <Text size="2" weight="bold">Result:</Text>
              <Box mt="2">
                {eval3.result.evalOutput.map((line, index) => (
                  <Text key={index} size="2" as="div" style={{ fontFamily: "monospace" }}>
                    {line}
                  </Text>
                ))}
              </Box>
            </Card>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default RunEvals
