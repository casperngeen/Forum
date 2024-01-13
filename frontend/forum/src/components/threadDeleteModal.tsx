import { Modal, Box, Typography, Grid, Button } from '@mui/material'
import { modalStyle } from '../utils/modalStyle'
import { deleteThread } from '../network/threadApi'
import { useNavigate } from 'react-router-dom'
import ThreadDeleteModalProps from '../types/threadDeleteModalProps';

export default function ThreadDeleteModal(props: ThreadDeleteModalProps) {
    const { openDeleteThreadModal, setOpenDeleteThreadModal, setSuccessAlert, setErrorAlert, threadID } = props;
    const navigate = useNavigate();

    const handleCloseDeleteModal = () => {
        setOpenDeleteThreadModal(false);
    }

    const handleDeleteThread = async () => {
        try {
            await deleteThread({threadID: threadID});
            setOpenDeleteThreadModal(false);
            setSuccessAlert({status: true, message: "Thread successfully deleted"});
            navigate("/");
        } catch (error) {
            console.log(error);
            setErrorAlert({status: true, message: "Unable to delete thread"});
        }
    }

    return (
        <Modal
            open={openDeleteThreadModal}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
        >
            <Box sx={modalStyle}>
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
    )
}
