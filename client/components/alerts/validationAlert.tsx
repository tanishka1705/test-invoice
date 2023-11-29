import { Alert, AlertIcon } from '@chakra-ui/react'
import React from 'react'

const ValidationAlert = ({ title }: { title: string}) => {
    return (
        <Alert status='error'>
            <AlertIcon />
            {title}
        </Alert>
    )
}

export default ValidationAlert