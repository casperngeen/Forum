import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getAllReplies, newReply } from '../network/replyApi';
import { ReplyType } from '../interfaces/reply';
import { Alert, Box, Button, Container, Grid, Modal, Snackbar, Stack, TextField, Typography } from '@mui/material';
import Reply from '../components/reply';
import { LoginContext } from '../interfaces/loginContext';
import { ArrowBack, Delete, Edit, Send } from '@mui/icons-material';
import { deleteThread, editThread, getSingleThread } from '../network/threadApi';
import { ErrorType, ReplyContext } from '../interfaces/replyContext';
import { ThreadType } from '../interfaces/thread';

export default function ThreadPage() {
    const navigate = useNavigate();
    const threadID = Number(useParams().threadID); //params.threadID!: the ! asserts that the value is non-null

    const { isLoggedIn, openAlert, setOpenAlert } = React.useContext(LoginContext);
    const [triggerRender, setTriggerRender] = React.useState<boolean>(false);
    const [threadData, setThreadData] = React.useState<ThreadType>({id: 0, username: "Error", title: "Error", content: "Error", created_at: new Date(), edited: false });
    const [replyValue, setReplyValue] = React.useState<string>("");
    const [inputValue, setInputValue] = React.useState<string>(threadData.content);
    const [isUser, setIsUser] = React.useState<boolean>(false);
    const [replies, setReplies] = React.useState<ReplyType[]>([]);
    const [replyCount, setReplyCount] = React.useState<number>(0);
    const [repliesError, setRepliesError] = React.useState<ErrorType>({status: false, message: ""});
    const [alertError, setAlertError] = React.useState<ErrorType>({status: false, message: ""});
    const [replySubmit, setReplySubmit] = React.useState<boolean>(false);
    const [openEditThreadModal, setOpenEditThreadModal] = React.useState<boolean>(false);
    const [openDeleteThreadModal, setOpenDeleteThreadModal] = React.useState<boolean>(false);

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

    React.useEffect(() => {
        const fetchReplies = async () => {
            try {
                const allReplies = await getAllReplies(threadID); //array of all replies
                setReplies(allReplies);
                setRepliesError({status: false, message: ""});
                setReplyCount(allReplies.length);
                if (isLoggedIn) {
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
    }, [threadID, replySubmit, isLoggedIn, threadData.username, triggerRender]);

    const backToMain = () => {
        navigate("/");
    }

    const handleClose = () => {
        setOpenAlert(prevState => ({
            ...prevState,
            status: false
        }));
    }

    const handleCloseAlert = () => {
        setAlertError(prevState => ({
            ...prevState,
            status: false
        }));
    }

    const handleOpenDeleteModal = () => {
        setOpenDeleteThreadModal(true);
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteThreadModal(false);
    }

    const handleDeleteThread = async () => {
        try {
            await deleteThread({threadID: threadID});
            setOpenDeleteThreadModal(false);
            setOpenAlert({status: true, message: "Thread successfully deleted"});
            navigate("/");
        } catch (error) {
            console.log(error);
            setAlertError({status: true, message: "Unable to delete thread"});
        }
    }

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };
        
    const handleOpenEditModal = () => {
        setOpenEditThreadModal(true);
    }

    const handleCloseEditModal = () => {
        setOpenEditThreadModal(false);
    }

    const handleEditThread = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget); 
        const newContent: string = data.get("newContent") as string
        try {
            
            await editThread({threadID: threadID, newContent: newContent}); //
            setOpenEditThreadModal(false);
            setOpenAlert({status: true, message: "Thread successfully edited"});
            setTriggerRender((prev) => !prev);
        } catch (error) {
            console.log(error);
            setAlertError({status: true, message: "Unable to edit thread"});
        }
    }

    const handleReplyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setReplyValue(event.target.value);
    }

    // log the reply to the backend, then re render the page to display the new 
    const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isLoggedIn) {
            setAlertError({status: true, message: "You are not logged in!"});
        } else {
            if (replyValue.length === 0) {
                setAlertError({status: true, message: "You cannot send an empty reply"})
            } else {
                try {
                    await newReply({threadID: threadID, reply: replyValue});
                    setReplySubmit(!replySubmit);
                    setReplyValue("");
                } catch (error) {
                    setAlertError({status: true, message: (error as Error).message ||"There was an issue submitting the reply"});
                }
            }
        }
    }

    const inputStyle = {
        color: inputValue === threadData.content ? 'gray' : 'black', // Adjust the colors as needed
    };

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    
    return (
        <ReplyContext.Provider value={{alertError, setAlertError, triggerRender, setTriggerRender}}>
            <Container component="main">
                <Button variant="outlined" onClick={backToMain}><ArrowBack /></Button>
                <Box border={1} padding={2} marginBottom={3}>
                    <Typography variant='h4' fontWeight="bold">{threadData.title}</Typography>
                    <Typography variant="subtitle1">By {threadData.username}, created at {threadData.created_at.toString()} {threadData.edited && "[EDITED]"}</Typography>
                    <Typography variant='body1'>{threadData.content}</Typography>
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
                </Box>
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
                : (<Stack>
                    {replies.map((reply) => (
                        <Reply key={reply.id} reply={reply} threadID={threadID}></Reply>
                        ))}
                </Stack>)
                }
                <Modal
                    open={openDeleteThreadModal}
                    aria-labelledby="delete-modal-title"
                    aria-describedby="delete-modal-description"
                >
                    <Box sx={style}>
                    <Typography id="delete-modal-title" variant="h6" component="h2" fontWeight="bold">
                        Confirm Delete
                    </Typography>
                    <Typography id="delete-modal-description" sx={{ my: 2 }}>
                        Are you sure you want to delete this thread?
                    </Typography>
                    <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={handleCloseDeleteModal}>
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary" onClick={handleDeleteThread}>
                                Confirm
                            </Button>
                        </Grid>
                    </Grid>
                    </Box>
                </Modal>

                <Modal
                    open={openEditThreadModal}
                    aria-labelledby="edit-modal-title"
                    aria-describedby="edit-modal-description"
                >
                    <Box component="form" sx={style} onSubmit={handleEditThread}>
                        <Typography id="edit-modal-title" variant="h5" component="h2" fontWeight="bold">
                            Edit Thread
                        </Typography>
                        <Typography variant="h6" paddingY={1}>
                            Title: <strong>{threadData.title}</strong>
                        </Typography>
                        <Typography variant="h6">
                            Content:
                        </Typography>
                        <TextField multiline rows={5} defaultValue={inputValue} onChange={handleInputChange} inputProps={{style: inputStyle}} fullWidth id="newContent" name="newContent"/>
                        <Grid container spacing={2} justifyContent="flex-end" paddingTop={2}>
                            <Grid item>
                                <Button variant="outlined" color="primary" onClick={handleCloseEditModal}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="outlined" color="primary" disabled={inputValue === threadData.content} type='submit'>
                                    Edit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>

                <Snackbar open={openAlert.status} anchorOrigin={{vertical: "top", horizontal: "center"}} onClose={handleClose}>
                    <Alert severity='success' sx={{ width: '100%' }}>
                        {openAlert.message}
                    </Alert>
                </Snackbar>
                <Snackbar open={alertError.status} anchorOrigin={{vertical: "top", horizontal: "center"}} onClose={handleCloseAlert}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {alertError.message}
                    </Alert>
                </Snackbar>
            </Container>
        </ReplyContext.Provider>
    )
}
