import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getAllReplies, newReply } from '../network/replyApi';
import { Box, Button, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import Reply from '../components/reply';
import { RootContext } from '../contexts/rootContext';
import { ArrowBack, Delete, Edit, Send } from '@mui/icons-material';
import { getSingleThread } from '../network/threadApi';
import { ReplyContext } from '../contexts/replyContext';
import AlertSuccessSnackBar from '../components/alertSuccessSnackBar';
import AlertErrorSnackBar from '../components/alertErrorSnackBar';
import AlertType from '../types/alertType';
import ThreadEditModal from '../components/threadEditModal';
import ReplyType from '../types/reply';
import ThreadType from '../types/thread';
import ThreadDeleteModal from '../components/threadDeleteModal';
import { checkLoggedIn } from '../utils/checkLoggedIn';

export default function ThreadPage() {
    const navigate = useNavigate();
    const threadID = Number(useParams().threadID); //params.threadID!: the ! asserts that the value is non-null

    const { successAlert, setSuccessAlert } = React.useContext(RootContext);
    const [triggerRender, setTriggerRender] = React.useState<boolean>(false);
    const [threadData, setThreadData] = React.useState<ThreadType>({id: 0, username: "Error", title: "Error", content: "Error", created_at: new Date(), edited: false });
    const [replyValue, setReplyValue] = React.useState<string>("");
    const [inputValue, setInputValue] = React.useState<string>(threadData.content);
    const [isUser, setIsUser] = React.useState<boolean>(false);
    const [replies, setReplies] = React.useState<ReplyType[]>([]);
    const [replyCount, setReplyCount] = React.useState<number>(0);
    const [repliesError, setRepliesError] = React.useState<AlertType>({status: false, message: ""});
    const [errorAlert, setErrorAlert] = React.useState<AlertType>({status: false, message: ""});
    const [replySubmit, setReplySubmit] = React.useState<boolean>(false);
    const [openEditThreadModal, setOpenEditThreadModal] = React.useState<boolean>(false);
    const [openDeleteThreadModal, setOpenDeleteThreadModal] = React.useState<boolean>(false);

    // feteches the thread data to be rendered, runs again when thread is edited (using triggerRender)
    React.useEffect(() => {
        const fetchThreadData = async () => {
            try {
                const thread = await getSingleThread(threadID);
                setThreadData(thread);
            } catch (error) {
                setRepliesError({status: true, message: "There was an issue fetching the replies."}) // change this
            }
        }
        fetchThreadData();
        setInputValue(threadData.content);
    }, [threadID, triggerRender, threadData.content])

    // fetches the list of replies to be rendered, runs again when new reply is submited or if any reply is edited (also using triggerRender)
    React.useEffect(() => {
        const fetchReplies = async () => {
            try {
                const allReplies = await getAllReplies(threadID); //array of all replies
                setReplies(allReplies);
                setRepliesError({status: false, message: ""});
                setReplyCount(allReplies.length);
                if (checkLoggedIn()) {
                    const user: string = JSON.parse(localStorage.getItem("user")!).username;
                    if (user === threadData.username) {
                        setIsUser(true);
                    }
                }
            } catch (error) {
                setRepliesError({status: true, message: "There was an issue fetching the replies."})
            }
        };
        fetchReplies();
    }, [threadID, replySubmit, threadData.username, triggerRender]);

    const backToMain = () => {
        navigate("/");
    }

    // handles the closing of the snackbars
    const handleCloseSuccess = () => {
        setSuccessAlert(prevState => ({
            ...prevState,
            status: false
        }));
    }
    const handleCloseError = () => {
        setErrorAlert(prevState => ({
            ...prevState,
            status: false
        }));
    }

    // handles opening of edit/delete modals
    const handleOpenDeleteModal = () => {
        if (checkLoggedIn()) {
            setOpenDeleteThreadModal(true);
        } else {
            setErrorAlert({status: true, message: "You are not logged in"});
        }
    }
    const handleOpenEditModal = () => {
        if (checkLoggedIn()) {
            setOpenEditThreadModal(true);
        } else {
            setErrorAlert({status: true, message: "You are not logged in"});
        }
        
    }

    // updates the state of reply value everytime there is a change in input
    const handleReplyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setReplyValue(event.target.value);
    }

    // log the reply to the backend, then re render the page to display the new 
    const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!checkLoggedIn()) {
            setErrorAlert({status: true, message: "You are not logged in!"});
        } else {
            if (replyValue.length === 0) {
                setErrorAlert({status: true, message: "You cannot send an empty reply"})
            } else {
                try {
                    await newReply({threadID: threadID, reply: replyValue});
                    setReplySubmit(!replySubmit);
                    setReplyValue("");
                } catch (error) {
                    setErrorAlert({status: true, message: (error as Error).message ||"There was an issue submitting the reply"});
                }
            }
        }
    }

    
    
    return (
        <ReplyContext.Provider value={{errorAlert, setErrorAlert, triggerRender, setTriggerRender}}>
            <Container component="main">
                <Button variant="outlined" onClick={backToMain}><ArrowBack /></Button>
                <Paper sx={{marginY: 3, padding: 3}}>
                    <Typography variant='h4' fontWeight="bold">{threadData.title}</Typography>
                    <Typography variant="subtitle1" mt={2}>By {threadData.username}, created at {threadData.created_at.toString()} {threadData.edited && "[EDITED]"}</Typography>
                    <Typography variant='body1' fontSize="1.25rem" mt={1}>{threadData.content}</Typography>
                    {
                        isUser && 
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Button onClick={handleOpenEditModal}><Edit /></Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={handleOpenDeleteModal}><Delete /></Button>
                            </Grid>
                        </Grid>
                    }
                </Paper>
                <Typography variant='h6' marginBottom={2}>Number of replies: {replyCount}</Typography>
                <Box component="form" onSubmit={submitReply} noValidate sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="flex-start">
                        <Grid item xs={10}>
                            <TextField required multiline fullWidth value={replyValue} onChange={handleReplyChange} id="reply" name="reply" label="Reply" />
                        </Grid>
                        <Grid item>
                            <Button type="submit"><Send /></Button>
                        </Grid>
                    </Grid>
                </Box>
                {repliesError.status
                ? <Typography variant="body1" color="error">{repliesError.message}</Typography>
                : (<Stack mb={3}>
                    {replies.map((reply) => (
                        <Reply key={reply.id} reply={reply} threadID={threadID}></Reply>
                        ))}
                </Stack>)
                }
                
                <ThreadDeleteModal 
                    openDeleteThreadModal={openDeleteThreadModal} 
                    setOpenDeleteThreadModal={setOpenDeleteThreadModal} 
                    setSuccessAlert={setSuccessAlert} 
                    setErrorAlert={setErrorAlert} 
                    threadID={threadID}
                />

                <ThreadEditModal 
                    openEditThreadModal={openEditThreadModal} 
                    setOpenEditThreadModal={setOpenEditThreadModal} 
                    inputValue={inputValue} 
                    setInputValue={setInputValue} 
                    setSuccessAlert={setSuccessAlert} 
                    setTriggerRender={setTriggerRender} 
                    setErrorAlert={setErrorAlert} 
                    threadID={threadID} 
                    threadData={threadData}  
                />

                <AlertSuccessSnackBar state={successAlert} onClose={handleCloseSuccess}/>
                <AlertErrorSnackBar state={errorAlert} onClose={handleCloseError} />
            </Container>
        </ReplyContext.Provider>
    )
}
