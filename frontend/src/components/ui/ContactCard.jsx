import { Avatar, Box, Card, Flex, HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { BiTrash } from 'react-icons/bi'
import { useColorModeValue } from './color-mode'
import EditContact from './EditContact'

const ContactCard = ({contact}) => {
  return <>
    <Card.Root width="400px">
        <Card.Body gap="2">
            <Flex gap="5" justifyContent={"space-between"}>
                <HStack>
                <Avatar.Root size="lg" shape="rounded">
                    <Avatar.Image src="https://avatar.iran.liara.run/public" />
                    <Avatar.Fallback name="Nue Camp" />
                </Avatar.Root>
                <Stack>
                    <Card.Title mt="2">{contact.fname + " " + contact.lname}</Card.Title>
                    <Text fontWeight="semibold" textStyle="sm">{contact.source}</Text>
                </Stack>                
            </HStack>
            <HStack gap="1">
                <EditContact/>
                <IconButton
                    variant="ghost"
                    size={"sm"}
                    aria-label="See menu"
                >
                    <BiTrash size={40}/>
                </IconButton>
            </HStack>
            </Flex>
            
            <Card.Description>
                <Text>{contact.notes}</Text>
            </Card.Description>
            <Flex gap="5" justifyContent={"space-between"}>
                <Text>{contact.gender}</Text>
                <Text>{contact.birthday}</Text>
            </Flex>
            <Box borderRadius="md" paddingTop="3" paddingBottom="3" bg={useColorModeValue("gray.200","gray.900")}>                    
                <Text fontWeight="bold" textStyle="sm">{"Mobile : " + contact.phone_number_1}</Text>
                <Text>{"Work : " + contact.phone_number_2}</Text>
                <Text>{"Email : " + contact.email}</Text>
            </Box>
            
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
            

        </Card.Footer>
    </Card.Root>
  </>
}

export default ContactCard