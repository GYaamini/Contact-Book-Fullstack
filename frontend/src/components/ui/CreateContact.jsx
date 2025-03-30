import { Button, CloseButton, Dialog, Portal, Flex, Field, Textarea, Stack, Input, NativeSelect} from '@chakra-ui/react'
import { React, useRef, useState} from 'react'
import { BiAddToQueue } from "react-icons/bi"
import { Toaster,toaster } from './toaster'
import { BASE_URL } from '@/App'


const CreateContact = ({setContacts}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        source: "",
        notes: "",
        phoneNumber1: "",
        phoneNumber2: "",
        email: "",
        gender: "",
        birthday: "",
    })
    const ref = useRef<HTMLInputElement>(null)

    // Handles Create action by sending POST request
    const handleCreateContact = async(e) => {
        e.preventDefault()
        setIsLoading(true)

        // If notes, work number, and email is empty in the form input
        // replace "" with placeholders
        if(!inputs.notes){
            inputs.notes = "..."
        }
        if(!inputs.phoneNumber2){
            inputs.phoneNumber2 = "🤷‍♀️"
        }
        if(!inputs.email){
            inputs.email = "🤷‍♀️"
        }
        
        try{
            const res = await fetch(BASE_URL + "/contacts",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs),
            })

            const data = await res.json()

            if(!res.ok){
                throw new Error(data.error)
            }
            
            // Update useState by appending new contact info
            setContacts((prevContacts) => [...prevContacts, data])
            toaster.success({
                title: "Contact Saved 🎉",
                description: "New contact is saved successfully to the server",
            })

        }catch (error){
            toaster.error({
            title: "Something Went Wrong 😕",
            description: error.message,
            })
        }finally{
            setIsLoading(false)
            setIsDialogOpen(false)
            setInputs({
                firstName: "",
                lastName: "",
                source: "",
                notes: "",
                phoneNumber1: "",
                phoneNumber2: "",
                email: "",
                gender: "",
                birthday: "",
            })
        }
    }

    return <>
        <Dialog.Root initialFocusEl={() => ref.current} 
            open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)}>
            <Dialog.Trigger asChild>
                <Button variant="outline" size="sm">
                    <BiAddToQueue/>
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <form onSubmit={handleCreateContact}>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>New Contact 🐽</Dialog.Title>
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
                                    
                                    <Field.Root required orientation="horizontal" >
                                        <Field.Label>Source</Field.Label>
                                        <Input placeholder="From where?" flex="1" 
                                            value={inputs.source}
                                            onChange={(e) => setInputs({...inputs, source: e.target.value})}
                                        />
                                    </Field.Root>
                                    

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
                                        <Field.Label>Gender</Field.Label>
                                        <NativeSelect.Root onChange={(e) => setInputs({...inputs, gender: e.target.value})}>
                                            <NativeSelect.Field>
                                                <option value="">Select Gender</option>
                                                <option value="Female">Female</option>
                                                <option value="Male">Male</option>
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
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
                                <Button type='submit' 
                                    colorPalette={"green"}
                                    isLoading={isLoading}
                                    disabled={!inputs.firstName || !inputs.source || !inputs.phoneNumber1}
                                >
                                    Add
                                </Button>
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

export default CreateContact