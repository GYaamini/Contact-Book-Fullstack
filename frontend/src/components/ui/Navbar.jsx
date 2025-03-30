import { Box, Button, Container, Field, Flex, HStack, IconButton, Input, Text } from '@chakra-ui/react'
import { React, useState } from 'react'
import { useColorMode, useColorModeValue } from './color-mode'
import { LuMoon, LuSun } from "react-icons/lu"
import CreateContact from './CreateContact'
import { BiListUl, BiSearchAlt, BiSolidDashboard } from 'react-icons/bi'
import { BASE_URL } from '@/App'
import { toaster } from './toaster'

const Navbar = ({setContacts, showDash, setShowDash}) => {
  const { toggleColorMode, colorMode } = useColorMode()
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState({searchInput: "",})

  // Toggle to handle Contact Grid view and Dashboard view
  const toggleDash = async() => {
    try{
        const res = await fetch(BASE_URL + "/dash")
        if(! res.ok){
          throw new Error(data.error)
        }
    }catch(error){
      toaster.error({
        title: "Something Went Wrong 😕",
        description: error.message,
      })
    }finally{
      setShowDash(!showDash)
    }
  }

  // Handles List all contacts action by sending GET request to List All route
  const handleGetAll = async() => {
    try{
      const res = await fetch(BASE_URL + "/contacts")
      const data = await res.json()

      if(! res.ok){
        throw new Error(data.error)
      }
      
      // Update useState with all existing contacts
      setContacts(data)
    }catch(error){
      toaster.error({
        title: "Something Went Wrong 😕",
        description: error.message,
      })
    }finally{
      setIsLoading(false)
    }
  }

  // Handles search action to get specific contact by sending GET request to Read route
  const handleGetContact = async(e) => {
    try{
      const res = await fetch(BASE_URL + "/contacts/" + input.firstName)
      const data = await res.json()

      if(! res.ok){
        throw new Error(data.error)
      }

      // Update useState by setting only the specific contact/contacts
      setContacts(data)
    }catch(error){
      toaster.error({
        title: "Something Went Wrong 😕",
        description: error.message,
      })
    }finally{
      setIsLoading(false)
      setInput({searchInput:""})
    }
  }

  return <>
    <Container maxW={"800px"}>
      <Box px={4} my={4} borderRadius={5} bg={useColorModeValue("gray.200","gray.900")}>
        <Flex gap={3} h={20} alignItems={"center"} justifyContent={"space-between"}>
          <Flex gap={3} alignItems={"center"}>
            <Text display={{base:"none", md:"block"}} fontWeight={800} fontSize={"large"}>
            Con.Com 🫡
            </Text>
            <CreateContact setContacts={setContacts}/>
            <IconButton
                variant="outline"
                size={"sm"}
                aria-label="See menu"
                onClick={handleGetAll}
            >
                <BiListUl size={40}/>
            </IconButton>
          
            <HStack gap="1" maxW="sm">
              <Field.Root orientation="horizontal">
                <Input placeholder="Search" flex="1"
                  value={input.firstName}
                  onChange={(e) => setInput({...input, searchInput: e.target.value})} 
                />
              </Field.Root>
              <IconButton
                  variant="outline"
                  size={"sm"}
                  aria-label="See menu"
                  onClick={handleGetContact}
              >
                  <BiSearchAlt size={40}/>
              </IconButton>
            </HStack>
            
          </Flex>
          <Flex gap ={3} alignItems={"center"}>
            <IconButton
                  variant="outline"
                  size={"sm"}
                  aria-label="See menu"
                  onClick={toggleDash}
              >
                  <BiSolidDashboard size={40}/>
            </IconButton>
            <Button onClick={toggleColorMode} variant="outline" size="sm">
            {colorMode === "light" ? <LuSun /> : <LuMoon />}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  </>
}

export default Navbar