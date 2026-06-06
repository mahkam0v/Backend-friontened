import { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Button, SimpleGrid, Input,
  Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, IconButton,
  Alert, AlertIcon, Spinner, Center, HStack, useToast,
} from '@chakra-ui/react';
import { MdRefresh, MdAdd, MdDelete } from 'react-icons/md';
import { getTodosApi, createTodoApi, deleteTodoApi } from '../api';
import DashboardLayout from '../components/DashboardLayout';
import TokenChip from '../components/TokenChip';
import { useAuth } from '../context/AuthContext'; // 🌟 AuthContext yuklandi

function StatCard({ label, value, color }) {
  return (
    <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" p={5}>
      <Text fontSize="12px" color="gray.500" fontWeight={500} mb={1}>{label}</Text>
      <Text fontSize="28px" fontWeight={700} color={`${color}.600`}>{value}</Text>
    </Box>
  );
}

export default function UserTodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState(''); // 🌟 Description uchun yangi state
  const [adding, setAdding] = useState(false);
  const toast = useToast();
  
  // 🌟 Tizimga kirgan foydalanuvchi ma'lumotlarini context'dan olamiz
  const { user } = useAuth(); 

  // 🌟 Dynamic ravishda ID'ni aniqlab olish (Context yoki LocalStorage'dan)
  const currentUserId = user?.id || user?._id || localStorage.getItem('userId');

  const load = async () => {
    if (!currentUserId) {
      setError("Foydalanuvchi ID topilmadi. Qaytadan login qiling.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const data = await getTodosApi(currentUserId);
      setTodos(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (currentUserId) load(); 
  }, [currentUserId]);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    if (!currentUserId) {
      toast({ title: 'Foydalanuvchi ID topilmadi', status: 'error', duration: 3000, position: 'top-right' });
      return;
    }

    setAdding(true);
    try {
      // 🌟 API-ga sening barcha kerakli parametrlaring uzatildi (Title, UserID va Description)
      // Agarda api fayling obyekt qabul qilsa, buni o'zing moslab qo'yishing mumkin
      await createTodoApi(newTitle.trim(), newDesc.trim());
      
      setNewTitle('');
      setNewDesc(''); // 🌟 Muvaffaqiyatli qo'shilgach, description inputini tozalaymiz
      toast({ title: 'Vazifa qo\'shildi', status: 'success', duration: 2000, position: 'top-right' });
      load();
    } catch (e) {
      toast({ title: e.message, status: 'error', duration: 3000, position: 'top-right' });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodoApi(id);
      toast({ title: 'O\'chirildi', status: 'info', duration: 2000, position: 'top-right' });
      load();
    } catch (e) {
      toast({ title: e.message, status: 'error', duration: 3000, position: 'top-right' });
    }
  };

  const done = todos.filter(t => t.completed || t.status === 'done').length;

  return (
    <DashboardLayout>
      <Box>
        {/* Topbar */}
        <Flex
          align="center" justify="space-between"
          px={6} h="56px" bg="white"
          borderBottom="1px solid" borderColor="gray.200"
        >
          <Text fontWeight={700} fontSize="16px" color="gray.900">Mening vazifalarim</Text>
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
            <StatCard label="Jami vazifalar" value={todos.length} color="blue" />
            <StatCard label="Bajarilgan" value={done} color="green" />
            <StatCard label="Qolgan" value={todos.length - done} color="orange" />
          </SimpleGrid>

          {/* Card */}
          <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" overflow="hidden">
            <Box px={5} py={4} borderBottom="1px solid" borderColor="gray.100">
              <Text fontWeight={600} fontSize="15px" color="gray.900">Vazifalar ro'yxati</Text>
            </Box>

            {/* 🌟 1 ta Input o'rniga 2 ta Input (Title va Description) qo'shilgan joy 🌟 */}
            <Box px={5} py={3} borderBottom="1px solid" borderColor="gray.100">
              <Flex gap={3} direction={{ base: 'column', md: 'row' }} align="center">
                <Input
                  placeholder="Vazifa nomi (Title)..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  borderRadius="lg"
                  focusBorderColor="blue.500"
                  fontSize="14px"
                  size="md"
                />
                <Input
                  placeholder="Batafsil ma'lumot (Description)..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  borderRadius="lg"
                  focusBorderColor="blue.500"
                  fontSize="14px"
                  size="md"
                />
                <Button
                  size="md"
                  colorScheme="blue"
                  borderRadius="lg"
                  leftIcon={<MdAdd />}
                  onClick={handleAdd}
                  isLoading={adding}
                  fontSize="13px"
                  px={8}
                  w={{ base: '100%', md: 'auto' }}
                >
                  Qo'shish
                </Button>
              </Flex>
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
                      <Th color="gray.500" fontSize="11px">VAZIFA</Th>
                      <Th color="gray.500" fontSize="11px">HOLAT</Th>
                      <Th />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {todos.length === 0 ? (
                      <Tr><Td colSpan={4} textAlign="center" py={8} color="gray.400">
                        Hali vazifalar yo'q. Birinchisini qo'shing!
                      </Td></Tr>
                    ) : todos.map((t, i) => {
                      const isDone = t.isCompleted || t.completed;
                      const id = t._id || t.id;
                      return (
                        <Tr key={id || i} _hover={{ bg: 'gray.50' }}>
                          <Td color="gray.400" fontSize="13px">{i + 1}</Td>
                          <Td
                            fontSize="14px"
                            color={isDone ? 'gray.400' : 'gray.800'}
                            textDecoration={isDone ? 'line-through' : 'none'}
                          >
                            <Box>
                              <Text fontWeight={600}>{t.title || t.text || t.name || '—'}</Text>
                              {t.description && (
                                <Text fontSize="12px" color="gray.500" mt={0.5}>
                                  {t.description}
                                </Text>
                              )}
                            </Box>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={isDone ? 'green' : 'yellow'}
                              borderRadius="full" px={2} fontSize="11px"
                            >
                              {isDone ? 'Bajarilgan' : 'Kutilmoqda'}
                            </Badge>
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="o'chirish"
                              icon={<MdDelete />}
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDelete(id)}
                            />
                          </Td>
                        </Tr>
                      );
                    })}
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