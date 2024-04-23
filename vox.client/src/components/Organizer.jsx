import {
    Box,
    VStack,
    Heading,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Select
} from '@chakra-ui/react';
import axios from 'axios'
import Layout from './Layout';
function Organizer() {
    return (
        <>
            <Layout>
                <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
                    <VStack spacing={4} width="400px">
                        <Heading>Organizers</Heading>
                        <Select placeholder='Select page' width="150px">
                            <option value='option1'>Option 1</option>
                            <option value='option2'>Option 2</option>
                            <option value='option3'>Option 3</option>
                        </Select>
                        <TableContainer>
                            <Table size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Organizer</Th>
                                        <Th>Location</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td>inches</Td>
                                        <Td>millimetres (mm)</Td>
                                        <Td>25.4</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>feet</Td>
                                        <Td>centimetres (cm)</Td>
                                        <Td>30.48</Td>
                                    </Tr>
                                    <Tr>
                                        <Td>yards</Td>
                                        <Td>metres (m)</Td>
                                        <Td>0.91444</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </VStack>
                </Box>
            </Layout>
        </>
    );
}

export default Organizer;