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
import Lottie from "react-lottie"
import animationData from "../animation/typing.json"
const ENDPOINT = "http://localhost:5000"; 
var socket, selectedChatCompare;
const SingleChat = ({fetchAgain,setfetchAgain}) => {
   const{user,selectedChat,setSelectedChat,notification,setNotification}= ChatState();
   const [messages,setMessages]=useState([])
   const [loading,setLoading]=useState(false)
   const[newMessage,setNewMessage]=useState()
   const [socketConnected, setSocketConnected] = useState(false);
   const [typing, setTyping] = useState(false);
   const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
   const sendMessage=async(e)=>{
    if(e.key==="Enter" && newMessage){
      socket.emit("stop typing", selectedChat._id);
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
        
        socket.emit("new message", data);
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
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

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
      
       setMessages(data);
       setLoading(false);
       socket.emit("join chat", selectedChat._id);
    }catch(error)
    {
        toast({
          title: "Error occured!",
          description: "Failed to load the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
    }
   };
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      // eslint-disable-next-line
    }, []);
   useEffect(()=>{
     fetchMessages();
     selectedChatCompare = selectedChat;
     // eslint-disable-next-line
   },[selectedChat]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setfetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  
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
             {messages && !selectedChat.isGroupChat ? (
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
             {loading ? (
               <Spinner
                 size="xl"
                 w={20}
                 alignSelf="center"
                 margin="auto"
                 h={20}
               />
             ) : (
               <div className="messages">
                 <ScrollableChat messages={messages}></ScrollableChat>
               </div>
             )}

             <FormControl
               onKeyDown={sendMessage}
               id="first-name"
               isRequired
               mt={3}
             >
               {istyping ? (
                 <div>
                  
                   <Lottie
                     options={defaultOptions}
                     // height={50}
                     width={70}
                     style={{ marginBottom: 15, marginLeft: 0 }}
                   />
                 </div>
               ) : (
                 <></>
               )}
               <Input
                 variant="filled"
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
           <Text fontSize="3x1" pb={3} fontFamily="Work sans">
             Click on user to start the chat
           </Text>
         </Box>
       )}
     </>
   );
};

export default SingleChat
