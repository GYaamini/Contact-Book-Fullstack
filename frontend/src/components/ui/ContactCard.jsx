import { Avatar, Box, Card, Flex, HStack, IconButton, Image, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import { BiTrash } from 'react-icons/bi'
import { useColorModeValue } from './color-mode'
import EditContact from './EditContact'
import { BASE_URL } from '@/App'
import { toaster } from './toaster'

const ContactCard = ({contact,setContacts}) => {
    const handleDate = (birthday) =>{
        const date = String(birthday)
        return date.split('-').reverse().join('-')
    }

    const handleChange = async() => {
        const name = contact.firstName+ " "+contact.lastName
        const confirmDelete = window.confirm("Are you sure you want to delete "+name+"?")
        if(confirmDelete){
            try{
                const res = await fetch(BASE_URL+"/contacts/"+contact.id,{
                    method: "DELETE",
                })

                if(!res.ok){
                    throw new Error(res.error)
                }

                setContacts((prevContacts) => prevContacts.filter((con) => con.id !== contact.id))
                toaster.success({
                    title: "Contact Deleted 😤",
                    description: `${name} contact is deleted successfully`,
                })
            }catch (error){
                toaster.error({
                    title: "Something Went Wrong 😕",
                    description: error.message,
                })
            }
        }
        
    }
    return <>
    <Card.Root width="400px">
        <Card.Body gap="2">
            <Flex gap="5" justifyContent={"space-between"}>
                <HStack>
                <Avatar.Root size="lg" shape="full">
                    <Avatar.Image src={contact.imgURL}/>
                    <Avatar.Fallback name={contact.firstName + " " + contact.lastName} />
                </Avatar.Root>
                <Stack>
                    <Card.Title mt="2">{contact.firstName + " " + contact.lastName}</Card.Title>
                    <Text fontWeight="semibold" textStyle="sm">{contact.source}</Text>
                </Stack>                
            </HStack>
            <HStack gap="1">
                <EditContact contact={contact} setContacts={setContacts}/>
                <IconButton
                    variant="ghost"
                    size={"sm"}
                    aria-label="See menu"
                    onClick={handleChange}
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
                <Text>{handleDate(contact.birthday)}</Text>
            </Flex>
            <Box borderRadius="md" paddingTop="3" paddingBottom="3" bg={useColorModeValue("gray.200","gray.900")}>                    
                <Text fontWeight="bold" textStyle="sm">{"Mobile : " + contact.phoneNumber1}</Text>
                <Text>{"Work : " + contact.phoneNumber2}</Text>
                <Text>{"Email : " + contact.email}</Text>
            </Box>
        </Card.Body>
        <Card.Footer justifyContent="center">
            <Image
                src={contact.imgQR}
                alt="QR Image"
                width="100px"
            />
        </Card.Footer>
    </Card.Root>
    </>
}

export default ContactCard