// default page that is loaded: contains all the threads
// 1. query list of threads from DB (use fetch request)
// 2. map each thread to a React component (thread) -> to render every thread

import React from 'react'
import { getAllThreads } from '../network/threadApi'
import { Alert, Box, Button, Container, Snackbar, Stack, Typography } from '@mui/material';
import { ThreadType } from '../interfaces/thread';
import Thread from '../components/thread';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../interfaces/loginContext';
import { ErrorType } from '../interfaces/replyContext';

export default function Home() {
    const [threads, setThreads] = React.useState<ThreadType[]>([]);
    const [threadCount, setThreadCount] = React.useState<number>(0);
    const { isLoggedIn } = React.useContext(LoginContext);
    const [error, setError] = React.useState<string>("");
    const [alertError, setAlertError] = React.useState<ErrorType>({status: false, message: ""});
    const navigate = useNavigate();
    
    React.useEffect(() => {
        const fetchThreads = async () => {
            try {
                const allThreads = await getAllThreads(); //array of all threads
                setThreads(allThreads);
                setThreadCount(allThreads.length);
            } catch (error) {
                setError((error as Error).message ||"There was an issue fetching the threads.")
            }
            
        };
        fetchThreads();
    }, []);

    //redirect user to the correct page based on log in status
    const createNewThread = () => {
        if (isLoggedIn) {
            navigate("/createThread");
        } else {
            setAlertError({status: true, message: "You are not logged in!"});
        }
    }

    const handleCloseAlert = () => {
        setAlertError({status: false, message: ""});
    }
    
    //maps the threads fetched to a list of thread components to be displayed if they can be fetched successfully
    if (error === "") {
        return (
            <Container sx={{justifyContent: "center"}}>
                <Button variant="outlined" onClick={createNewThread}>New Thread</Button>
                <Typography variant='h6' paddingTop={2}>Number of threads: {threadCount}</Typography>
                <Stack spacing={2} marginTop={2}>
                    {threads.map((thread) => (
                        <Thread key={thread.id} thread={thread}></Thread>
                    ))}
                </Stack>
                <Snackbar open={alertError.status} anchorOrigin={{vertical: "top", horizontal: "center"}} onClose={handleCloseAlert}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {alertError.message}
                    </Alert>
                </Snackbar>
            </Container>
        )
    } else {
        return (
            <Box>
                <Typography variant="body1" color="error">{error}</Typography>
            </Box>
        )
    }
    
}
