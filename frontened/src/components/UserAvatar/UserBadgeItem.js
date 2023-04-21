import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius="1g"
    mb={2}
    variant="solid"
    cursor="pointer"
    fontSize={12}
    backgroundColor="purple"
    color="white"
    m={1}
    onClick={handleFunction}
    >
        {user.name}
        <CloseIcon pl={1}/> 

    </Box>
  )
}

export default UserBadgeItem
