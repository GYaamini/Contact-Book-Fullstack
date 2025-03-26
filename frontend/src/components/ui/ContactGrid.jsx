import { Flex, Grid, Spinner, Text, VStack} from '@chakra-ui/react'
import { React, useEffect, useState } from 'react'
import ContactCard from './ContactCard'
import { BASE_URL } from '@/App'
import { toaster } from './toaster'

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
        toaster.error({
          title: "Something Went Wrong 😕",
          description: error.message,
      })
      }finally{
        setIsLoading(false)
      }
    }
    getContacts()
  },[setContacts])
  return (
    <>
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

      <Grid
        templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
        }}
        gap={4}
      >
        {[...contacts].sort((a, b) => {
          const firstNameA = a.firstName ? a.firstName.toLowerCase() : "";  // Avoid undefined
          const firstNameB = b.firstName ? b.firstName.toLowerCase() : "";
          return firstNameA.localeCompare(firstNameB);  // Sort alphabetically
        }).map((contact)=>(
          <ContactCard key={contact.id} contact={contact} setContacts={setContacts}/>
        ))}
      </Grid>
    </>
  )
}

export default ContactGrid