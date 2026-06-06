import {
  Box, Flex, Text, VStack, Icon, Avatar, Divider, Button, Badge, Tooltip,
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard, MdPeople, MdChecklist, MdPerson, MdLogout, MdShield,
} from 'react-icons/md';

function NavItem({ icon, label, to }) {
  return (
    <NavLink to={to} style={{ width: '100%' }}>
      {({ isActive }) => (
        <Flex
          align="center"
          gap={3}
          px={3}
          py={2.5}
          borderRadius="lg"
          bg={isActive ? 'blue.50' : 'transparent'}
          color={isActive ? 'blue.600' : 'gray.600'}
          fontWeight={isActive ? 600 : 400}
          fontSize="sm"
          _hover={{ bg: isActive ? 'blue.50' : 'gray.100', color: isActive ? 'blue.600' : 'gray.800' }}
          transition="all 0.15s"
          cursor="pointer"
        >
          <Icon as={icon} boxSize={5} />
          {label}
        </Flex>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, isAdmin, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (name = '') =>
    name.split(' ').map(w => w[0] || '').join('').toUpperCase().slice(0, 2) || '?';

  return (
    <Flex
      direction="column"
      w="230px"
      minH="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      flexShrink={0}
    >
      {/* Logo */}
      <Flex align="center" gap={2.5} px={4} py={4} borderBottom="1px solid" borderColor="gray.100">
        <Box
          w={8} h={8} bg="blue.600" borderRadius="lg"
          display="flex" alignItems="center" justifyContent="center"
        >
          <Icon as={MdShield} color="white" boxSize={4} />
        </Box>
        <Text fontWeight={700} fontSize="md" color="gray.900">MyApp</Text>
      </Flex>

      {/* Nav */}
      <VStack flex={1} spacing={1} px={3} py={4} align="stretch">
        <Text fontSize="10px" fontWeight={700} color="gray.400" letterSpacing="wider" px={3} mb={1}>
          {isAdmin ? 'ADMIN PANEL' : 'MENING SAHIFAM'}
        </Text>

        {isAdmin ? (
          <NavItem icon={MdPeople} label="Foydalanuvchilar" to="/admin/users" />
        ) : (
          <NavItem icon={MdChecklist} label="Vazifalar" to="/dashboard/todos" />
        )}

        <Divider my={2} />
        <Text fontSize="10px" fontWeight={700} color="gray.400" letterSpacing="wider" px={3} mb={1}>
          UMUMIY
        </Text>
        <NavItem icon={MdPerson} label="Profil" to="/profile" />
      </VStack>

      {/* User footer */}
      <Box px={3} py={4} borderTop="1px solid" borderColor="gray.100">
        <Flex align="center" gap={2.5} mb={3}>
          <Avatar
            size="sm"
            name={user?.name}
            bg={isAdmin ? 'red.500' : 'blue.500'}
            color="white"
            getInitials={() => initials(user?.name)}
          />
          <Box overflow="hidden">
            <Text fontSize="13px" fontWeight={600} color="gray.900" isTruncated>{user?.name}</Text>
            <Badge
              fontSize="10px"
              colorScheme={isAdmin ? 'red' : 'blue'}
              borderRadius="full"
              px={2}
            >
              {isAdmin ? 'Admin' : 'User'}
            </Badge>
          </Box>
        </Flex>
        <Button
          size="sm"
          variant="outline"
          colorScheme="red"
          w="full"
          leftIcon={<MdLogout />}
          onClick={handleLogout}
          fontSize="13px"
        >
          Chiqish
        </Button>
      </Box>
    </Flex>
  );
}
