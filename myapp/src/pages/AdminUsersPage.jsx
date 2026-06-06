import { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, SimpleGrid, Stat, StatLabel, StatNumber,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Avatar,
  Alert, AlertIcon, Spinner, Center, Icon, HStack,
} from '@chakra-ui/react';
import { MdRefresh, MdPeople, MdShield, MdPerson } from 'react-icons/md';
import { getUsersApi } from '../api';
import DashboardLayout from '../components/DashboardLayout';
import TokenChip from '../components/TokenChip';

function StatCard({ label, value, icon, color }) {
  return (
    <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" p={5}>
      <Flex align="center" justify="space-between">
        <Box>
          <StatLabel fontSize="12px" color="gray.500" fontWeight={500}>{label}</StatLabel>
          <StatNumber fontSize="28px" fontWeight={700} color="gray.900">{value}</StatNumber>
        </Box>
        <Box w={10} h={10} bg={`${color}.50`} borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
          <Icon as={icon} color={`${color}.500`} boxSize={5} />
        </Box>
      </Flex>
    </Box>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsersApi();
      setUsers(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const admins = users.filter(u => u.role === 'admin').length;

  return (
    <DashboardLayout>
      <Box>
        {/* Topbar */}
        <Flex
          align="center" justify="space-between"
          px={6} h="56px" bg="white"
          borderBottom="1px solid" borderColor="gray.200"
        >
          <Text fontWeight={700} fontSize="16px" color="gray.900">Foydalanuvchilar</Text>
          <HStack>
            <TokenChip />
            <Button size="sm" leftIcon={<MdRefresh />} variant="outline" onClick={load} isLoading={loading}>
              Yangilash
            </Button>
          </HStack>
        </Flex>

        <Box p={6}>
          {/* Stats */}
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} mb={6}>
            <StatCard label="Jami foydalanuvchilar" value={users.length} icon={MdPeople} color="blue" />
            <StatCard label="Adminlar" value={admins} icon={MdShield} color="red" />
            <StatCard label="Oddiy userlar" value={users.length - admins} icon={MdPerson} color="green" />
          </SimpleGrid>

          {/* Table */}
          <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden">
            <Box px={5} py={4} borderBottom="1px solid" borderColor="gray.100">
              <Text fontWeight={600} fontSize="15px" color="gray.900">Barcha foydalanuvchilar</Text>
            </Box>

            {error && (
              <Alert status="error" m={4} borderRadius="lg">
                <AlertIcon /> {error}
              </Alert>
            )}

            {loading ? (
              <Center py={12}><Spinner color="blue.500" /></Center>
            ) : (
              <TableContainer>
                <Table size="sm" variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th color="gray.500" fontSize="11px">#</Th>
                      <Th color="gray.500" fontSize="11px">ISM</Th>
                      <Th color="gray.500" fontSize="11px">EMAIL</Th>
                      <Th color="gray.500" fontSize="11px">ROL</Th>
                      <Th color="gray.500" fontSize="11px">HOLAT</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.length === 0 ? (
                      <Tr><Td colSpan={5} textAlign="center" py={8} color="gray.400">Foydalanuvchilar topilmadi</Td></Tr>
                    ) : users.map((u, i) => (
                      <Tr key={u._id || u.id || i} _hover={{ bg: 'gray.50' }}>
                        <Td color="gray.400" fontSize="13px">{i + 1}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Avatar size="xs" name={u.name || u.username} bg={u.role === 'admin' ? 'red.400' : 'blue.400'} color="white" />
                            <Text fontSize="14px" fontWeight={500}>{u.name || u.username || '—'}</Text>
                          </HStack>
                        </Td>
                        <Td fontSize="13px" color="gray.600">{u.email || '—'}</Td>
                        <Td>
                          <Badge colorScheme={u.role === 'admin' ? 'red' : 'blue'} borderRadius="full" px={2} fontSize="11px">
                            {u.role || 'user'}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={u.isActive !== false ? 'green' : 'gray'} borderRadius="full" px={2} fontSize="11px">
                            {u.isActive !== false ? 'Faol' : 'Nofaol'}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
