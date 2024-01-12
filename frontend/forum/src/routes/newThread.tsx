// interface for creating a new thread

import { Box, Button, Container, TextField, Typography } from '@mui/material'
import React from 'react'
import { newThread } from '../network/threadApi'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material';

export default function NewThread() {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string>("");
    
    //upload the data to the database of threads
    const createNewThread = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget); 
        const title: string = data.get("title") as string;
        const content: string = data.get("content") as string;
        try {
            await newThread({title: title, content: content});
            navigate("/");
        } catch (error) {
            setError("There was an issue creating the thread.");
        }
    }

    const backToMain = () => {
        navigate("/");
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box component="form" onSubmit={createNewThread} noValidate sx={{ mt: 1 }}>
                <Button variant="outlined" onClick={backToMain}><ArrowBack /></Button>
                <TextField margin="normal" required fullWidth id="title" label="Title" name="title" autoFocus/>
                <TextField margin="normal" required fullWidth id="content" name="content" label="Content" rows={5} multiline/>
                <Button variant="contained" type="submit" fullWidth>Create Thread</Button>
                {error && <Typography variant="body1" color="error">{error}</Typography>}
            </Box>
        </Container>
    )
}
