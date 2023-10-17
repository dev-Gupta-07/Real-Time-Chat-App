import {React,useEffect,useState} from 'react'
import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import {ChatState} from "../../Context/ChatProvider"
import { useHistory } from "react-router-dom";
import { set } from 'mongoose';


const Login = () => {
 
    const history=useHistory();
     const { setUser } = ChatState();
     const [email, setEmail] = useState();
     const [password, setPassword] = useState();
       const [show, setShow] = useState(false);
        const [loading, setLoading] = useState(false);
       const toast =useToast();
        const handleClick = () => setShow(!show);
        
      
       const submitHandler =async() => {
         setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
       localStorage.setItem("userInfo", JSON.stringify(data));
       setLoading(false);
       history.push("/chats");
    
    
    } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
       








       };
  return (
    <VStack spacing="5px" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
         value={email}
         type="email"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
           value={password}
         />
          <InputRightElement width="4.5rem">
            <Button h="1.75 rem " size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
      variant={"solid"}
        colorScheme="red"
        width="100%"
        
        onClick={()=>{
            setEmail("guest@example.com");
            setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
}

export default Login
