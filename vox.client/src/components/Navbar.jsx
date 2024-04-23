import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../api/AuthContext';

    function Navbar() {

        const navigate = useNavigate();
        const { setIsLoggedIn, setToken } = useContext(AuthContext);

        const handleLogout = () => {
            localStorage.removeItem('token');
            setToken('');
            setIsLoggedIn(false);
            navigate('/');
        };

          return (
              <Box bg="teal.400" px={4}>
                  <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                      <Flex alignItems={'center'}>
                          <RouterLink to="/user">
                            <Link color="white" mr={4}>
                              User Menu
                            </Link>
                          </RouterLink>
                          <RouterLink to="/organizers">
                            <Link color="white" mr={4}>
                              Organizers
                            </Link>
                          </RouterLink>
                          <Button colorScheme="teal" size="sm" onClick={handleLogout}>
                              Logout
                          </Button>
                      </Flex>
                  </Flex>
              </Box>
      );
    }

    export default Navbar;