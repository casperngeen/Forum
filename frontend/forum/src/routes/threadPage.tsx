import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAllReplies, newReply } from '../network/replyApi';
import { ReplyType } from '../interfaces/reply';
import { Alert, Box, Button, Container, Grid, Snackbar, Stack, TextField, Typography } from '@mui/material';
import Reply from '../components/reply';

export default function ThreadPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const threadID = Number(useParams().threadID); //params.threadID!: the ! asserts that the value is non-null
    const { title, content } = location.state;

    interface ErrorType {
        status: boolean,
        message: string,
    }

    const [replies, setReplies] = React.useState<ReplyType[]>([]);
    const [replyCount, setReplyCount] = React.useState<number>(0);
    const [repliesError, setRepliesError] = React.useState<ErrorType>({status: false, message: ""});
    const [replyError, setReplyError] = React.useState<ErrorType>({status: false, message: ""});
    const [replySubmit, setReplySubmit] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchReplies = async () => {
            try {
                const allReplies = await getAllReplies(threadID); //array of all replies
                setReplies(allReplies);
                setRepliesError({status: false, message: ""});
                setReplyCount(allReplies.length);
            } catch (error) {
                setRepliesError({status: true, message: "There was an issue fetching the replies."})
            }
            
        };
        fetchReplies();
    }, [threadID, replySubmit]);

    const backToMain = () => {
        navigate("/");
    }

    const handleClose = () => {
        setReplyError({status: false, message: ""});
    }

    // log the reply to the backend, then re render the page to display the new 
    const submitReply = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (localStorage.getItem("user") === null) {
            navigate("/login");
        } else {
            const data = new FormData(event.currentTarget); 
            const reply: string = data.get("reply") as string
            try {
                await newReply({threadID: threadID, reply: reply});
                setReplySubmit(!replySubmit);
            } catch (error) {
                setReplyError({status: true, message: (error as Error).message ||"There was an issue submitting the reply"});
            }
        }
    }
    
    return (
        <Container component="main" maxWidth="xs">
            <Box border={1} marginBottom={3}>
                <Button onClick={backToMain}>Back icon</Button>
                <Typography variant='h4' fontWeight="bold">{title}</Typography>
                <Typography variant='body1'>{content}</Typography>
            </Box>
            <Typography variant='h6' marginBottom={2}>Number of replies: {replyCount}</Typography>
            {repliesError.status
            ? <Typography variant="body1" color="error">{repliesError.message}</Typography>
            : (<Stack spacing={2}>
                {replies.map((reply) => (
                    <Reply key={reply.id} reply={reply}></Reply>
                    ))}
            </Stack>)
            }
            <Box component="form" onSubmit={submitReply} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField required multiline id="reply" name="reply" label="Reply" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button type="submit">Submit reply icon</Button>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar open={replyError.status} autoHideDuration={5000} onClose={handleClose}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {replyError.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}
