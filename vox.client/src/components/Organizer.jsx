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
    TableContainer
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios'
function Organizer() {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
            <VStack spacing={4} width="400px">
                <Heading>Organizers</Heading>
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
    );
}

export default Organizer;