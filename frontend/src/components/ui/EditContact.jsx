import { Button, CloseButton, Dialog, Portal, Flex, Field, Textarea, Stack, Input, NativeSelect } from '@chakra-ui/react'
import {React, useRef} from 'react'
import { BiEditAlt } from 'react-icons/bi'

const EditContact = () => {
const ref = useRef<HTMLInputElement>(null)
    return <>
        <Dialog.Root initialFocusEl={() => ref.current}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" size="sm">
                    <BiEditAlt/>
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>New Contact 🐽</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body pb={10}>
                            <Stack gap="10">
                                <Flex alignItems={"center"} gap={5}>
                                    <Field.Root required orientation="horizontal">
                                        <Field.Label>First Name</Field.Label>
                                        <Input placeholder="Name" flex="1" />
                                    </Field.Root>

                                    <Field.Root orientation="horizontal">
                                        <Field.Label>Last Name</Field.Label>
                                        <Input placeholder="if any" flex="1" />
                                    </Field.Root>
                                </Flex>                                                            

                                <Field.Root orientation="horizontal">
                                    <Field.Label>Notes</Field.Label>
                                    <Textarea flex="1" />
                                </Field.Root>
                                
                                <Flex alignItems={"center"} gap={4}>
                                    <Field.Root required orientation="horizontal">
                                        <Field.Label>Mobile (Ph.No.)</Field.Label>
                                        <Input placeholder="Phone Number 1" flex="1" />
                                    </Field.Root>
                                    

                                    <Field.Root orientation="horizontal">
                                        <Field.Label>Work (Ph.No.)</Field.Label>
                                        <Input placeholder="Phone Number 2" flex="1" />
                                    </Field.Root>
                                </Flex>                               

                                <Field.Root orientation="horizontal">
                                    <Field.Label>Email</Field.Label>
                                    <Input placeholder="me@example.com" flex="1" />
                                </Field.Root>

                                <Field.Root orientation="horizontal">
                                    <Field.Label>Birthday</Field.Label>
                                    <Input placeholder="dd-mm-yyyy" flex="1" />
                                </Field.Root>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    </>
}

export default EditContact