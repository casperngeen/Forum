// interface for creating a new thread

import { Box, Button, Container, TextField } from '@mui/material'
import React from 'react'
import { newThread } from '../network/threadApi'
import { useNavigate } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material';
import AlertErrorSnackBar from '../components/alertErrorSnackBar';
import AlertType from '../types/alertType';

export default function NewThread() {
    const navigate = useNavigate();
    const [error, setError] = React.useState<AlertType>({status: false, message: ""});
    
    //upload the data to the database of threads
    const createNewThread = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget); 
        const title: string = data.get("title") as string;
        const content: string = data.get("content") as string;
        if (title.length === 0 || content.length === 0) {
            setError({status: true, message: "You cannot leave either field empty"});
        } else {
            try {
                await newThread({title: title, content: content});
                navigate("/");
            } catch (error) {
                setError({status: true, message: "There was an issue creating the thread"});
            }
        }
    }

    const handleClose = () => {
        setError(prevState => ({
          ...prevState,
          status: false
        }));
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
            </Box>
            <AlertErrorSnackBar state={error} onClose={handleClose} />
        </Container>
    )
}
