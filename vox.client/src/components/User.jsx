import {
    Box,
    VStack,
    Heading,
    InputGroup, Input, InputRightElement,
    Button
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Layout from './Layout';

function User() {
    return (
        <>
            <Layout>
                <Box display="flex" flexDirection="column" minHeight="100vh" justifyContent="center" alignItems="center">
                    <VStack spacing={4} width="400px">
                        <Heading>User Menu</Heading>
                        <InputGroup>
                            <Input placeholder='Find User By ID' />
                            <Button h="2.5rem" size="sm">
                                <SearchIcon />
                            </Button>
                        </InputGroup>
                    </VStack>
                </Box>
            </Layout>
       </>
  );
}

export default User;