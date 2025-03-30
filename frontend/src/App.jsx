import React, { useState } from 'react'
import { Container, Stack, Text } from '@chakra-ui/react'
import Navbar from './components/ui/Navbar'
import ContactGrid from './components/ui/ContactGrid'
import { Toaster } from './components/ui/toaster'


// Dynamically set BASE_URL for development and production
export const BASE_URL = import.meta.env.VITE_BASE_URL

function App() {
  const [contacts, setContacts] = useState([])
  const [showDash, setShowDash] = useState(false)

  return <>
    <Toaster/>
    <Stack minH={"100vh"}>
      <Navbar setContacts={setContacts} showDash={showDash} setShowDash={setShowDash}/>
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
        {showDash ? (
          <iframe
            src= {BASE_URL+"/dash"} // URL where Dash app is routed
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="Dash Plot"
          ></iframe>
        ) : (
          <ContactGrid contacts={contacts} setContacts={setContacts}/>
        )}
      </Container>
    </Stack>
  </>
}

export default App
