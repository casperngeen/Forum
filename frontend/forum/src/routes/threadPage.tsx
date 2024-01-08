import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getAllReplies, newReply } from '../network/replyApi';
import { ReplyType } from '../interfaces/reply';
import { Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import Reply from '../components/reply';

export default function ThreadPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const threadID = parseInt(params.threadID!, 10) //params.threadID!: the ! asserts that the value is non-null
    const { title, content } = location.state;
    const [replies, setReplies] = React.useState<ReplyType[]>([]);
    const [replyCount, setReplyCount] = React.useState<number>(0);
    const [repliesError, setRepliesError] = React.useState<string>("");
    const [replyError, setReplyError] = React.useState<string>("");

    React.useEffect(() => {
        const fetchReplies = async () => {
            try {
                const allReplies = await getAllReplies(threadID); //array of all replies
                setReplies(allReplies);
            } catch (error) {
                setRepliesError("There was an issue fetching the replies.")
            }
            
        };
        fetchReplies();
    }, [threadID]);

    const backToMain = () => {
        navigate("/");
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
                setReplyCount((currentCount) => currentCount + 1);
            } catch (error) {
                setReplyError("There was an issue submitting the reply");
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
            {repliesError === ""
            ? (<Stack spacing={2}>
                {replies.map((reply) => (
                    <Reply key={reply.id} reply={reply}></Reply>
                    ))}
            </Stack>)
            : <Typography variant="body1" color="error">{repliesError}</Typography>
            }
            <Box component="form" onSubmit={submitReply} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField required multiline id="reply" name="reply" label="Reply" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button type="submit">Submit reply icon</Button>
                    </Grid>
                    {replyError !== "" && 
                    <Grid item xs={12}>
                        <Typography color="error" variant='body1'>{replyError}</Typography>
                    </Grid>}
                </Grid>
            </Box>
        </Container>
    )
}
