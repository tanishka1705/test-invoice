import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'

const NotFound = ({ title, description }: { title: string, description: string | null }) => {
    return (
        <div className='w-[50%] block mx-auto'>
            <Alert
                status='error'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                height='200px'
                className='rounded-sm mt-[3rem]'
            >
                <AlertIcon boxSize='40px' mr={0} />
                <AlertTitle mt={4} mb={1} mr={0} fontSize='xl'>
                    {title}
                </AlertTitle>
                <AlertDescription maxWidth='sm' className='font-medium'>
                    {description}
                </AlertDescription>
            </Alert>
        </div>
    )
}

export default NotFound