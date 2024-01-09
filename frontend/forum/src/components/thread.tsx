import { Box, Typography } from '@mui/material'
import { ThreadType } from '../interfaces/thread';
import { useNavigate } from 'react-router-dom';

interface threadProp {
    thread: ThreadType
}

export default function Thread({ thread }: threadProp) {
    const { id, title, content, created_at, username } = thread;
    const navigate = useNavigate();
    const enterThread = () => {
        navigate(`/${id}`, {state: {title: title, content: content}});
    }

    return (
        <Box onClick={enterThread} display="flex" flexDirection="column" paddingY={3} columnGap={2}> 
            <Typography variant="h4">{title}</Typography>   
            <Typography variant="subtitle1">By {username}, created at {created_at.toString()}</Typography>
            <Typography variant="body2">{content}</Typography>
        </Box>
    )
}
