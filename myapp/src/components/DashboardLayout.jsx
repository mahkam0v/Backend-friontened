import { Flex, Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar />
      <Box flex={1} overflow="auto">
        {children}
      </Box>
    </Flex>
  );
}
