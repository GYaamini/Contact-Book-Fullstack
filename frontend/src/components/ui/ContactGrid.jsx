import { CONTACTS } from '@/dummy/dummy'
import { Grid} from '@chakra-ui/react'
import React from 'react'
import ContactCard from './ContactCard'

const ContactGrid = () => {
  return (
    <Grid
        templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
        }}
        gap={4}
    >
      {CONTACTS.map((contact)=>(
        <ContactCard key={contact.id} contact={contact}/>
      ))}
    </Grid>
  )
}

export default ContactGrid