import { Box } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import SingleChat from '../SingleChat';
import "../styles.css"

const ChatBox = ({fetchAgain,setFetchAgain}) => {
    const{selectedChat}=ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p="3"
      borderRadius="1g"
      borderWidth="1px"
      bg="white"
      w={{ base: "100%", md: "68%" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox
