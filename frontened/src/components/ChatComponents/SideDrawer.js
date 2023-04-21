import { Box, Button, Tooltip,Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Toast, Spinner } from '@chakra-ui/react'
import {useDisclosure} from "@chakra-ui/hooks"
import React, { useState } from 'react'
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import {useHistory} from "react-router-dom";
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';


const SideDrawer = () => {
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const [loadingChat,setLoadingChat]=useState();
   const { user ,setSelectedChat,chats,setChats}=ChatState();
  
    const history=useHistory();
   const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler=()=>{
        localStorage.removeItem("userInfo")
        history.push("/");
    };
    const toast=useToast();
    const handleSearch=async()=>{
        if(!search)
        {
            toast({
                title:"Please enter something in search",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top-left",
            });
            return;
        }

      try
      {
        setLoading(true)
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`,

            },
        };

        const {data} =await axios.get(`/api/user?search=${search}`,config)
        setLoading(false);
        setSearchResult(data);
      }catch(error){
         
            toast({
              title: "Error occured",
              description: "Failed to load results",
              status:"error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
            
      }
    };

    const accessChat=async(userId)=>{
        try{
           setLoadingChat(true)
           const config = {
             headers: {
                "Content-type":"application/json",
               Authorization: `Bearer ${user.token}`,
             },
           };

           const {data}=await axios.post('/api/chat',{userId},config);
           if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);
           
           setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }catch(error){
           toast({
             title: "Error in fetching the chat",
             description: error.message,
             status: "error",
             duration: 5000,
             isClosable: true,
             position: "bottom-left",
           });
        }
    };
  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to CHAT" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "flex" }} x="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2x1" fontFamily="Work-sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2x1" m={1}></BellIcon>
            </MenuButton>
            {/*<MenuList></MenuList>*/}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider></MenuDivider>
              <MenuItem onClick={logoutHandler}>Log-Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading?(
                <ChatLoading/>
            ):(
               searchResult?.map((user)=>(
                <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)
                }
                />

               ))

            )}
            {loadingChat&& <Spinner ml="auto" display="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default SideDrawer

