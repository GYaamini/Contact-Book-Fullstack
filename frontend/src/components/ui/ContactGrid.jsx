import { Flex, Grid, Spinner, Text, VStack} from '@chakra-ui/react'
import { React, useEffect, useState } from 'react'
import ContactCard from './ContactCard'
import { BASE_URL } from '@/App'

const ContactGrid = ({contacts,setContacts}) => {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(()=>{
    const getContacts = async() => {
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
    getContacts()
  },[setContacts])
  return (
    <>
      <Grid
        templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
        }}
        gap={4}
      >
        {contacts.map((contact)=>(
          <ContactCard key={contact.id} contact={contact} setContacts={setContacts}/>
        ))}
      </Grid>

      {isLoading && (
        <VStack colorPalette="teal" justifyContent={"center"}>
          <Spinner color="colorPalette.600" />
          <Text>Loading...</Text>
        </VStack>
      )}
      {!isLoading && contacts.length === 0 && (
        <Flex justifyContent={"center"}>
          <VStack fontSize={"xl"}>
            <Text as={"span"} fontSize={"2xl"} fontWeight={"bold"} mr={2}>
              OOOPS 🙀
            </Text>
            No Contact to Comb
          </VStack>
        </Flex>
      )}
    </>
  )
}

export default ContactGrid