import { Box, Button, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useColorMode, useColorModeValue } from './color-mode'
import { LuMoon, LuSun } from "react-icons/lu"
import CreateContact from './CreateContact'

const Navbar = () => {
  const { toggleColorMode, colorMode } = useColorMode()
  return (
    <Container maxW={"600px"}>
      <Box px={4} my={4} borderRadius={5} bg={useColorModeValue("gray.200","gray.900")}>
        <Flex gap={3} h={20} alignItems={"center"} justifyContent={"space-between"}>
          <Flex gap={3} alignItems={"center"}>
            <Text display={{base:"none", md:"block"}} fontWeight={800} fontSize={"large"}>
            Con.Com 🫡
            </Text>
            <CreateContact/>
          </Flex>
          <Flex alignItems={"center"}>
            <Button onClick={toggleColorMode} variant="outline" size="sm">
            {colorMode === "light" ? <LuSun /> : <LuMoon />}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  )
}

export default Navbar