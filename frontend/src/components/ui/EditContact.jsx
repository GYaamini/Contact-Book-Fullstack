import { Button, CloseButton, Dialog, Portal, Flex, Field, Textarea, Stack, Input } from '@chakra-ui/react'
import {React, useRef, useState} from 'react'
import { BiEditAlt } from 'react-icons/bi'
import { toaster } from './toaster'
import { BASE_URL } from '@/App'

const EditContact = ({contact,setContacts}) => {
    const ref = useRef<HTMLInputElement>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [inputs, setInputs] = useState({
        firstName: contact.firstName,
        lastName: contact.lastName,
        notes: contact.notes,
        phoneNumber1: contact.phoneNumber1,
        phoneNumber2: contact.phoneNumber2,
        email: contact.email,
        birthday: contact.birthday,
    })

    const handleSubmit = async(e) => {
        e.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch(BASE_URL + "/contacts/"+contact.id,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs),
            })

            const data = await res.json()
            if(!res.ok){
                throw new Error(data.error)
            }

            setContacts((prevContacts) => prevContacts.map((con) => con.id === contact.id ? data : con))
            toaster.success({
                title: "Contact Edited 👍",
                description: "Contact is edited successfully",
            })

        }catch (error){
            toaster.error({
                title: "Something Went Wrong 😕",
                description: error.message,
            })
        }finally{
            setIsLoading(false)
            setIsDialogOpen(false)
        }
    }

    return <>
        <Dialog.Root initialFocusEl={() => ref.current}
            open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" size="sm">
                    <BiEditAlt/>
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <form onSubmit={handleSubmit}>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Edit Contact 📝</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body pb={10}>
                                <Stack gap="10">
                                    <Flex alignItems={"center"} gap={5}>
                                        <Field.Root required orientation="horizontal">
                                            <Field.Label>First Name</Field.Label>
                                            <Input placeholder="Name" flex="1"
                                                    value={inputs.firstName}
                                                    onChange={(e) => setInputs({...inputs, firstName: e.target.value})}
                                            />
                                        </Field.Root>

                                        <Field.Root orientation="horizontal">
                                            <Field.Label>Last Name</Field.Label>
                                            <Input placeholder="if any" flex="1" 
                                                    value={inputs.lastName}
                                                    onChange={(e) => setInputs({...inputs, lastName:e.target.value})}
                                            />
                                        </Field.Root>
                                    </Flex>                                                            

                                    <Field.Root orientation="horizontal">
                                        <Field.Label>Notes</Field.Label>
                                        <Textarea flex="1" 
                                                value={inputs.notes}
                                                onChange={(e) => setInputs({...inputs, notes: e.target.value})}
                                        />
                                    </Field.Root>
                                    
                                    <Flex alignItems={"center"} gap={4}>
                                        <Field.Root required orientation="horizontal">
                                            <Field.Label>Mobile (Ph.No.)</Field.Label>
                                            <Input placeholder="Phone Number 1" flex="1" 
                                                    value={inputs.phoneNumber1}
                                                    onChange={(e) => setInputs({...inputs, phoneNumber1: e.target.value})}
                                            />
                                        </Field.Root>
                                        

                                        <Field.Root orientation="horizontal">
                                            <Field.Label>Work (Ph.No.)</Field.Label>
                                            <Input placeholder="Phone Number 2" flex="1" 
                                                    value={inputs.phoneNumber2}
                                                    onChange={(e) => setInputs({...inputs, phoneNumber2: e.target.value})}
                                            />
                                        </Field.Root>
                                    </Flex>                               

                                    <Field.Root orientation="horizontal">
                                        <Field.Label>Email</Field.Label>
                                        <Input placeholder="me@example.com" flex="1" 
                                                value={inputs.email}
                                                onChange={(e) => setInputs({...inputs, email: e.target.value})}
                                        />
                                    </Field.Root>

                                    <Field.Root orientation="horizontal">
                                        <Field.Label>Birthday</Field.Label>
                                        <Input type='date'
                                                placeholder="dd-mm-yyyy" flex="1" 
                                                value={inputs.birthday}
                                                onChange={(e) => setInputs({...inputs, birthday: e.target.value})}
                                        />
                                    </Field.Root>
                                </Stack>
                            </Dialog.Body>
                            <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button type='submit' isLoading={isLoading}>Save</Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </form>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    </>
}

export default EditContact