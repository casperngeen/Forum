// default page that is loaded: contains all the threads
// 1. query list of threads from DB (use fetch request)
// 2. map each thread to a React component (thread) -> to render every thread

import React from 'react'
import { getAllThreads } from '../network/threadApi'
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ThreadType from '../types/thread';
import Thread from '../components/thread';
import { useNavigate } from 'react-router-dom';
import AlertType from '../types/alertType';
import AlertErrorSnackBar from '../components/alertErrorSnackBar';
import { checkLoggedIn } from '../utils/checkLoggedIn';


export default function Home() {
    const [threads, setThreads] = React.useState<ThreadType[]>([]);
    const [threadCount, setThreadCount] = React.useState<number>(0);
    const [error, setError] = React.useState<string>("");
    const [errorAlert, setErrorAlert] = React.useState<AlertType>({status: false, message: ""});
    const navigate = useNavigate();
    
    // fetches all threads to be rendered
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
        if (checkLoggedIn()) {
            navigate("/createThread");
        } else {
            setErrorAlert({status: true, message: "You are not logged in!"});
        }
    }

    const handleClose = () => {
        setErrorAlert((prevState) => ({
            ...prevState,
            status: false,
        }));
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
                <AlertErrorSnackBar state={errorAlert} onClose={handleClose} />
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
