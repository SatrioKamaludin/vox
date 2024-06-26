import {
    Box,
    VStack,
    HStack,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    IconButton,
    Spinner,
    Button,
    Menu, MenuButton, MenuList, MenuItem
} from '@chakra-ui/react';
import { ViewIcon, EditIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from 'axios'
import Layout from './Layout';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../api/AuthContext';
import OrganizerDetails from './Organizer/OrganizerDetails';
import UpdateOrganizerModal from './Organizer/UpdateOrganizerModal';
import DeleteOrganizerModal from './Organizer/DeleteOrganizerModal';
import AddOrganizerModal from './Organizer/AddOrganizerModal';

function Organizer() {
    const [organizers, setOrganizers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrganizer, setSelectedOrganizer] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUpdateOrganizer, setSelectedUpdateOrganizer] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDeleteOrganizer, setSelectedDeleteOrganizer] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrganizers = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5022/api/Organizer/organizers?page=${page}&perPage=${perPage}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'accept': '*/*'
                    }
                });
                setOrganizers(response.data.data);
                setTotalPages(response.data.meta.pagination.total_pages);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrganizers();
    }, [token, page, perPage]);

    const handleViewDetails = async (id) => {
        setIsDetailLoading(id);
        try {
            const response = await axios.get(`http://localhost:5022/api/Organizer/organizers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            setSelectedOrganizer(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDetailLoading(null);
        }
    };

    const handleUpdate = (organizer) => {
        setSelectedUpdateOrganizer(organizer);
        setIsUpdateModalOpen(true);
    };

    const handleDelete = (organizer) => {
        setSelectedDeleteOrganizer(organizer);
        setIsDeleteModalOpen(true);
    };

    const handleAdd = () => {
        setIsAddModalOpen(true);
    };

    return (
        <>
            <Layout>
                <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
                    <VStack spacing={4} width="800px">
                        <Heading>Organizers</Heading>
                        <HStack spacing={4}>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    Page {page}
                                </MenuButton>
                                <MenuList maxHeight="200px" overflowY="auto">
                                    {[...Array(totalPages).keys()].map((i) => (
                                        <MenuItem key={i + 1} onClick={() => setPage(i + 1)}>
                                            {i + 1}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            <Menu>
                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    Items per page {perPage}
                                </MenuButton>
                                <MenuList>
                                    {[5, 10, 20].map((value) => (
                                        <MenuItem key={value} onClick={() => setPerPage(value)}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                            <Button onClick={handleAdd}>Add Organizer</Button>
                        </HStack>
                        {isLoading ? (<Spinner />
                        ) : (
                            <TableContainer>
                                <Table size='sm'>
                                    <Thead>
                                        <Tr>
                                            <Th>ID</Th>
                                            <Th>Organizer</Th>
                                            <Th>Location</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {organizers.map((organizer) => (
                                            <Tr key={organizer.id}>
                                                <Td>{organizer.id}</Td>
                                                <Td>{organizer.organizerName.length > 10 ? organizer.organizerName.substring(0, 10) + '...' : organizer.organizerName}</Td>
                                                <Td>{organizer.imageLocation.length > 25 ? organizer.imageLocation.substring(0, 25) + '...' : organizer.imageLocation}</Td>
                                                <Td>
                                                    <Box display="flex" gap="5px" justifyContent="space-around">
                                                        <IconButton aria-label="View details" icon={isDetailLoading === organizer.id ? < Spinner /> : <ViewIcon />} colorScheme="blue" onClick={() => handleViewDetails(organizer.id)} />
                                                        <IconButton aria-label="Update" icon={<EditIcon />} colorScheme="yellow" onClick={() => handleUpdate(organizer)} />
                                                        <IconButton aria-label="Delete" icon={<DeleteIcon />} colorScheme="red" onClick={() => handleDelete(organizer)} />
                                                    </Box>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        )} 
                    </VStack>
                </Box>
            </Layout>
            {selectedOrganizer && (
                <OrganizerDetails
                    isOpen={!!selectedOrganizer}
                    onClose={() => setSelectedOrganizer(null)}
                    organizer={selectedOrganizer}
                />
            )}
            {selectedUpdateOrganizer && (
                <UpdateOrganizerModal
                    organizer={selectedUpdateOrganizer}
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    updateOrganizer={(updatedOrganizer) => {
                        setOrganizers(organizers.map((organizer) => organizer.id === updatedOrganizer.id ? updatedOrganizer : organizer));
                    }}
                />
            )}
            {selectedDeleteOrganizer && (
                <DeleteOrganizerModal
                    organizer={selectedDeleteOrganizer}
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedDeleteOrganizer(null);
                    }}
                    deleteOrganizer={(id) => {
                        setOrganizers(organizers.filter((organizer) => organizer.id !== id));
                    }}
                />
            )}
            <AddOrganizerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} addOrganizer={(newOrganizer) => {
                setOrganizers([...organizers, newOrganizer]);
            }} />
        </>
    );
}

export default Organizer;