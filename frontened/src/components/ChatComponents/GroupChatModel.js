import { useDisclosure } from '@chakra-ui/hooks';
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const toast=useToast();
    const {user,chats,setChats}=ChatState();
    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return;
        }

        try{
            setLoading(true);
             const config={
            headers:{
                Authorization:`Bearer ${user.token}`,

            },
        };
        const {data} =await axios.get(`/api/user?search=${search} `,config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);



        }catch(error)
        {
            toast({
              title: "Error occured!",
              description: "Failed to load the search results!!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
        }

    };
    const handleGroup=(userAdd)=>{
        if(selectedUsers.includes(userAdd))
        {
             toast({
               title: "User already added",
               
               status: "warning",
               duration: 5000,
               isClosable: true,
               position: "top",
             });
             return;
        }

        setSelectedUsers([...selectedUsers,userAdd]);

    };
     const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((select)=>select._id!==delUser._id));


     };
    const handleSubmit=async()=>{
        if(!groupChatName||!selectedUsers)
        {
            toast({
              title: "Please fill all the fields",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
        }
        try{
             const config={
            headers:{
                Authorization:`Bearer ${user.token}`,

            },
        };

        const {data}=await axios.post(`/api/chat/group`,{name:groupChatName,users:JSON.stringify(
            selectedUsers.map((u)=>u._id)
        ),
    },config);
         setChats([data,...chats]);
         onClose();

          toast({
            title: "New group chat created!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });

        }catch(error){
            toast({
              title: "Failed to create the chat!",
           description:error.response.data,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });

        }

    };
   
      return (
        <>
          <span onClick={onOpen}>{children}</span>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
                fontSize="30px"
                display="flex"
                fontFamily="Work sans"
                justifyContent="center"
              >
                Create Group Chat
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" flexDir="column" alignItems="center">
                <FormControl>
                  <Input
                    placeholder="Chat Name"
                    mb={3}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  ></Input>
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Add Users"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}
                  ></Input>
                </FormControl>
                <Box display="flex" width="100%" flexWrap="wrap">
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    ></UserBadgeItem>
                  ))}
                </Box>
                {loading ? (
                  <div>loading</div>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        user={user}
                        key={user._id}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  Create Chat
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
}

export default GroupChatModel
