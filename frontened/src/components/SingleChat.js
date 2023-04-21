import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React,{useEffect, useState} from 'react'
import "./styles.css";
import { ChatState } from '../Context/ChatProvider'
import GroupChatModel from './ChatComponents/GroupChatModel';
import ProfileModel from './ChatComponents/ProfileModel';
import UpdateGroupChatModel from './ChatComponents/UpdateGroupChatModel';
import { getSender ,getSenderFull} from './config/ChatLogics';
import ScrollableChat from './ChatComponents/ScrollableChat';
import io from "socket.io-client";

const SingleChat = ({fetchAgain,setfetchAgain}) => {
   const{user,selectedChat,setSelectedChat}= ChatState();
   const [messages,setMessages]=useState([])
   const [loading,setLoading]=useState(false)
   const[newMessage,setNewMessage]=useState()
  const toast = useToast();

   const sendMessage=async(e)=>{
    if(e.key==="Enter"&&newMessage){
      try{
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const {data}=await axios.post('/api/message',{
          content:newMessage,
          chatId:selectedChat._id,
        },config);
        console.log(data);
        
        setMessages([...messages,data]);


      }catch(error)
      {
       toast({
        title:"Error occured!",
        description:"Failed to send the message",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
       })
      }
    }

   };
   const typingHandler=(e)=>{
    setNewMessage(e.target.value);

   };
   const fetchMessages=async()=>{
    if(!selectedChat) return;
    try{
       const config = {
         headers: {
           
           Authorization: `Bearer ${user.token}`,
         },
       };
       setLoading(true);
       const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);
       console.log(data);
       setMessages(data);
       setLoading(false);

    }catch(error)
    {
        toast({
          title: "Error occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
   };
   useEffect(()=>{
    fetchMessages();
   },[selectedChat]);

  
   return (
    <>
      {selectedChat ? (
        <>
          <Text
            pb={3}
            display="flex"
            fontFamily="Work sans"
            alignItems="center"
            px={2}
            justifyContent={{ base: "space-between" }}
            w="100%"
            fontSize={{ base: "28px", md: "30px" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel
                  user={getSenderFull(user, selectedChat.users)}
                ></ProfileModel>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                 <UpdateGroupChatModel
                    fetchAgain={fetchAgain}
                    setFetchAgain={setfetchAgain}
                    fetchMessages={fetchMessages}
                    />
                  
                  
                
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            bg="#E8E8E8"
            h="100%"
            w="100%"
            p="3"
            borderRadius="1g"
            overflowY="hidden"
          >

            {loading?(<Spinner
            size="xl"
            w={20}
            alignSelf="center"
            margin="auto"
            h={20}/>):(<div className='messages'><ScrollableChat messages={messages}></ScrollableChat></div>)}

            <FormControl onKeyDown={sendMessage} isRequiredmt={3}>
              <Input 
              varian="filled"
              placeholder="Enter a message"
              bg="#E0E0E0"
              onChange={typingHandler}
              value={newMessage}
              ></Input>

            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          height="100%"
          justifyContent="center"
        >
          <Text fontSize="3x1" pb="3" fontFamily="Work sans">
            Click on user to start the chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat
