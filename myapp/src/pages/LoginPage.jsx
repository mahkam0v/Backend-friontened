import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, VStack, Text, Input, Button, FormControl, FormLabel,
  Alert, AlertIcon, Icon, InputGroup, InputRightElement, IconButton,
} from '@chakra-ui/react';
import { MdShield, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('Email va parolni to\'ldiring'); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin/users' : '/dashboard/todos', { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box
        bg="white"
        borderRadius="2xl"
        border="1px solid"
        borderColor="gray.200"
        p={10}
        w="full"
        maxW="420px"
        boxShadow="0 4px 24px rgba(0,0,0,0.07)"
      >
        {/* Logo */}
        <Box
          w={11} h={11} bg="blue.600" borderRadius="xl"
          display="flex" alignItems="center" justifyContent="center" mb={5}
        >
          <Icon as={MdShield} color="white" boxSize={6} />
        </Box>

        <Text fontSize="22px" fontWeight={700} color="gray.900" mb={1}>Kirish</Text>
        <Text fontSize="14px" color="gray.500" mb={6}>Davom etish uchun hisobingizga kiring</Text>

        {error && (
          <Alert status="error" borderRadius="lg" mb={4} fontSize="sm">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={4}>
          <FormControl>
            <FormLabel fontSize="13px" fontWeight={500} color="gray.600">Email</FormLabel>
            <Input
              type="email"
              placeholder="sizning@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              borderRadius="lg"
              focusBorderColor="blue.500"
              size="md"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="13px" fontWeight={500} color="gray.600">Parol</FormLabel>
            <InputGroup>
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                borderRadius="lg"
                focusBorderColor="blue.500"
                size="md"
              />
              <InputRightElement>
                <IconButton
                  aria-label="parolni ko'rsat"
                  icon={showPass ? <MdVisibilityOff /> : <MdVisibility />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPass(p => !p)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            colorScheme="blue"
            w="full"
            size="md"
            borderRadius="lg"
            isLoading={loading}
            loadingText="Kirish..."
            onClick={handleSubmit}
            mt={1}
            fontSize="15px"
            fontWeight={600}
          >
            Kirish
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
