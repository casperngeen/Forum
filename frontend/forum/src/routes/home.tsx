// default page that is loaded: contains all the threads
// 1. query list of threads from DB (use fetch request)
// 2. map each thread to a React component (thread) -> to render every thread

import React from 'react'
import { getAllThreads } from '../network/threadApi'
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { ThreadType } from '../interfaces/thread';
import Thread from '../components/thread';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../interfaces/loginContext';

export default function Home() {
    const [threads, setThreads] = React.useState<ThreadType[]>([]);
    const {isLoggedIn } = React.useContext(LoginContext);
    const [error, setError] = React.useState<string>("");
    const navigate = useNavigate();
    
    React.useEffect(() => {
        const fetchThreads = async () => {
            try {
                const allThreads = await getAllThreads(); //array of all threads
                setThreads(allThreads);
            } catch (error) {
                setError("There was an issue fetching the threads.")
            }
            
        };
        fetchThreads();
    }, []);

    //redirect user to the correct page based on log in status
    const createNewThread = () => {
        if (isLoggedIn) {
            navigate("/createThread");
        } else {
            navigate("/login");
        }
    }
    
    //maps the threads fetched to a list of thread components to be displayed if they can be fetched successfully
    if (error === "") {
        return (
            <Container component="main" maxWidth="xs">
                <Grid>
                    <Grid></Grid>
                    <Button variant="outlined" onClick={createNewThread}>New Thread</Button>
                    <Stack spacing={2}>
                        {threads.map((thread) => (
                            <Thread key={thread.id} thread={thread}></Thread>
                        ))}
                    </Stack>
                </Grid>
            </Container> 
        )
    } else {
        return (
            <Container component="main" maxWidth="xs">
                <Typography variant="body1" color="error">{error}</Typography>
            </Container>
        )
    }
    
}
