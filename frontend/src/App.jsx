import React from 'react'
import { 
  Container, Stack, Text
} from '@chakra-ui/react'
import Navbar from './components/ui/Navbar'
import ContactGrid from './components/ui/ContactGrid'

function App() {
  return (
    <Stack minH={"100vh"}>
      <Navbar/>
      <Container maxW={"1350px"} my={4}>
        <Text fontSize={{base: "4xl", md:"50"}}
              fontWeight={"800"}
              letterSpacing={"2px"}
              textTransform={"uppercase"}
              textAlign={"center"}
              mb={8}
        >
          <Text as={"span"} 
                bgGradient="to-b" gradientFrom="orange.500" gradientTo="purple.700"
                bgClip={"text"}
          >
            Contact Comb
          </Text>
          ✌️
        </Text>
        <ContactGrid/>
      </Container>
    </Stack>
  )
}

export default App
