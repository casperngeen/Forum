import { Box, Paper, Typography } from '@mui/material'
import ThreadType from '../types/thread';
import { useNavigate } from 'react-router-dom';

interface threadProp {
    thread: ThreadType
}

export default function Thread({ thread }: threadProp) {
    const { id, title, content, created_at, username, edited } = thread;
    const navigate = useNavigate();
    const enterThread = () => {
        navigate(`/${id}`);
    }

    return (
        <Paper sx={{ '&:hover': {backgroundColor: "#e0e0e0",
                        cursor: "pointer"}}}>
            <Box onClick={enterThread} display="flex" flexDirection="column" columnGap={2} padding={2}> 
                <Typography variant="h4">{title}</Typography>   
                <Typography variant="subtitle1">By {username}, created at {created_at.toString()} {edited && "[EDITED]"}</Typography>
                <Typography variant="body2">{content}</Typography>
            </Box>
        </Paper>
    )
}
