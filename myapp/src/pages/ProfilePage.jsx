import {
  Box, Flex, Text, Avatar, Badge, Divider, Code, HStack,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import TokenChip from '../components/TokenChip';

function Row({ label, children }) {
  return (
    <Flex py={3} borderBottom="1px solid" borderColor="gray.100" align="flex-start" gap={4}>
      <Text w="130px" fontSize="13px" color="gray.500" fontWeight={500} flexShrink={0}>{label}</Text>
      <Box flex={1}>{children}</Box>
    </Flex>
  );
}

export default function ProfilePage() {
  const { user, token, isAdmin } = useAuth();

  return (
    <DashboardLayout>
      <Box>
        <Flex
          align="center" justify="space-between"
          px={6} h="56px" bg="white"
          borderBottom="1px solid" borderColor="gray.200"
        >
          <Text fontWeight={700} fontSize="16px" color="gray.900">Profil</Text>
          <TokenChip />
        </Flex>

        <Box p={6}>
          <Box bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" p={6} maxW="520px">
            {/* Avatar section */}
            <HStack spacing={4} mb={6}>
              <Avatar
                size="lg"
                name={user?.name}
                bg={isAdmin ? 'red.500' : 'blue.500'}
                color="white"
              />
              <Box>
                <Text fontSize="18px" fontWeight={700} color="gray.900">{user?.name}</Text>
                <Text fontSize="13px" color="gray.500">{user?.email}</Text>
              </Box>
            </HStack>

            <Divider mb={4} />

            <Row label="Rol">
              <Badge colorScheme={isAdmin ? 'red' : 'blue'} borderRadius="full" px={2}>
                {isAdmin ? 'Administrator' : 'Foydalanuvchi'}
              </Badge>
            </Row>
            <Row label="Email">
              <Text fontSize="14px" color="gray.700">{user?.email || '—'}</Text>
            </Row>
            <Row label="ID">
              <Code fontSize="12px" borderRadius="md" px={2} py={0.5}>{user?.id || '—'}</Code>
            </Row>
            <Row label="JWT Token">
              <Code
                fontSize="11px"
                borderRadius="md"
                px={2} py={1}
                display="block"
                whiteSpace="pre-wrap"
                wordBreak="break-all"
                color="gray.600"
                bg="gray.50"
              >
                {token ? token.slice(0, 80) + '...' : '—'}
              </Code>
            </Row>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
