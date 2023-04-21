import {React,useEffect} from 'react'
import  {Box,Text, Container,Tabs,Tab,TabList,TabPanel,TabPanels} from "@chakra-ui/react";
import Login from '../components/authentication/Login'
import SignUp from "../components/authentication/SignUp";
import { useHistory } from 'react-router-dom';
const HomePage = () => {
  const history=useHistory();
   useEffect(() => {
     const user = JSON.parse(localStorage.getItem("userInfo"));


     if (user) {
       history.push("/chats");
     }
   }, [history]);



  return (
    <Container maxW="x1" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w="30%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Text
          fontSize="20px"
          fontFamily="Work sans"
          color="black"
          textAlign="center"
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="30%"
        p={4}
        borderRadius="1g"
        borderWidth="1px"
        color="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
             <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage
