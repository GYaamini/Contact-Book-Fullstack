import { Box, Button, Container, Field, Flex, HStack, IconButton, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useColorMode, useColorModeValue } from './color-mode'
import { LuMoon, LuSun } from "react-icons/lu"
import CreateContact from './CreateContact'
import { BiListUl, BiSearchAlt } from 'react-icons/bi'
import { BASE_URL } from '@/App'

const Navbar = ({contacts,setContacts}) => {
  const { toggleColorMode, colorMode } = useColorMode()
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState({firstName: "",})
  const handleGetAll = async() => {
    try{
      const res = await fetch(BASE_URL + "/contacts")
      const data = await res.json()

      if(! res.ok){
        throw new Error(data.error)
      }

      setContacts(data)
    }catch(error){
      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }

  const handleGetContact = async(e) => {
    try{
      const res = await fetch(BASE_URL + "/contacts/" + input.firstName)
      const data = await res.json()

      if(! res.ok){
        throw new Error(data.error)
      }

      setContacts(data)
    }catch(error){
      console.error(error)
    }finally{
      setIsLoading(false)
      setInput({firstName:""})
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
                  onChange={(e) => setInput({...input, firstName: e.target.value})} 
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
          <Flex alignItems={"center"}>
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