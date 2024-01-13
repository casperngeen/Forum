import { Modal, Box, Typography, TextField, Grid, Button } from '@mui/material'
import { modalStyle } from '../utils/modalStyle'
import ThreadEditModalProps from '../types/threadEditModalProps';
import { editThread } from '../network/threadApi';

export default function ThreadEditModal(props: ThreadEditModalProps) {

    const { openEditThreadModal, setOpenEditThreadModal, inputValue, setInputValue, setSuccessAlert, setTriggerRender, setErrorAlert, threadID, threadData } = props;

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputValue(event.target.value);
    };

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
            setSuccessAlert({status: true, message: "Thread successfully edited"});
            setTriggerRender((prev) => !prev);
        } catch (error) {
            console.log(error);
            setErrorAlert({status: true, message: "Unable to edit thread"});
        }
    }

    const inputStyle = {
        color: inputValue === threadData.content ? 'gray' : 'black', // Adjust the colors as needed
    };

    return (
        <Modal
            open={openEditThreadModal}
            aria-labelledby="edit-modal-title"
            aria-describedby="edit-modal-description"
        >
            <Box component="form" sx={modalStyle} onSubmit={handleEditThread}>
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
    )
}
