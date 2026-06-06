import { useState } from 'react';
import {
  Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, Code, Text, useDisclosure, Icon,
} from '@chakra-ui/react';
import { MdKey } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

export default function TokenChip() {
  const { token } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Badge
        display="flex"
        alignItems="center"
        gap={1}
        px={3}
        py={1}
        borderRadius="full"
        bg="gray.100"
        color="gray.600"
        fontWeight={500}
        fontSize="12px"
        cursor="pointer"
        _hover={{ bg: 'blue.50', color: 'blue.600' }}
        onClick={onOpen}
        transition="all 0.15s"
      >
        <Icon as={MdKey} boxSize={3.5} />
        Token
      </Badge>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader fontSize="16px" fontWeight={700}>
            <Badge colorScheme="blue" mr={2} borderRadius="full" px={2}>JWT</Badge>
            Bearer Token
          </ModalHeader>
          <ModalBody>
            <Text fontSize="13px" color="gray.500" mb={3}>
              Har bir API so'rovga qo'shiladi: <Code fontSize="11px">Authorization: Bearer &lt;token&gt;</Code>
            </Text>
            <Code
              display="block"
              whiteSpace="pre-wrap"
              wordBreak="break-all"
              p={4}
              borderRadius="xl"
              bg="gray.50"
              fontSize="11px"
              color="gray.700"
              lineHeight={1.7}
            >
              {token || '—'}
            </Code>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={onClose}>Yopish</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
