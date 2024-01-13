import { Box, Button, Container, Grid, Modal, Paper, TextField, Typography } from '@mui/material'
import ReplyType from '../types/reply';
import React from 'react';
import { RootContext } from '../contexts/rootContext';
import { Edit, Delete } from '@mui/icons-material';
import { deleteReply, editReply } from '../network/replyApi';
import { ReplyContext } from '../contexts/replyContext';


// renders a single reply (be it nested or not)
export default function Reply({ reply, threadID }: {reply: ReplyType, threadID: number}) {
  const {id, username, content, created_at, edited} = reply;
  const [isUser, setIsUser] = React.useState<boolean>(false);
  const { isLoggedIn, setSuccessAlert } = React.useContext(RootContext);
  const { setErrorAlert, setTriggerRender } = React.useContext(ReplyContext);
  const [openEditReplyModal, setOpenEditReplyModal] = React.useState<boolean>(false);
  const [openDeleteReplyModal, setOpenDeleteReplyModal] = React.useState<boolean>(false);
  const [replyValue, setReplyValue] = React.useState<string>(content);

  React.useEffect(() => {
    if (isLoggedIn) {
      const user: string = JSON.parse(localStorage.getItem("user")!).username;
      if (user === username) {
          setIsUser(true);
      }
    }
  }, [isLoggedIn, username, setIsUser, isUser])

  const handleOpenDeleteModal = () => {
    setOpenDeleteReplyModal(true);
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteReplyModal(false);
  }

  const handleDeleteReply = async () => {
    try {
      await deleteReply({threadID: threadID, replyID: id});
      setOpenDeleteReplyModal(false);
      setSuccessAlert({status: true, message: "Reply deleted successfully"});
      setTriggerRender((prev) => !prev);
    } catch (error) {
        console.log(error);
        setErrorAlert({status: true, message: "Unable to delete reply"});
    }
  }

  const handleOpenEditModal = () => {
    setOpenEditReplyModal(true);
  }

  const handleCloseEditModal = () => {
    setOpenEditReplyModal(false);
  }

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setReplyValue(event.target.value);
  }

  const handleEditReply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await editReply({threadID: threadID, replyID: id, newReply: replyValue});
      setOpenEditReplyModal(false);
      setSuccessAlert({status: true, message: "Reply edited successfully"});
      setTriggerRender((prev) => !prev);
    } catch (error) {
      console.log(error);
      setErrorAlert({status: true, message: "Unable to edit reply"});
    }
  }

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

const inputStyle = {
  color: replyValue === content ? "grey" : "black"
}

  return (
    <Container>
      <Paper sx= {{display: "flex", flexDirection: "column", mt: 3, padding: 2}}>
        <Box display="flex" flexDirection="column">  
            <Typography variant="subtitle1">By {username}, created at {created_at.toString()} {edited && "[EDITED]"}</Typography>
            <Typography variant="body1" fontSize="1.25rem" mt={1}>{content}</Typography>
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
      </Paper>
      <Modal
        open={openDeleteReplyModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
            Confirm Delete
        </Typography>
        <Typography id="modal-modal-description" sx={{ my: 2 }}>
            Are you sure you want to delete this reply?
        </Typography>
        <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
                <Button variant="outlined" color="primary" onClick={handleCloseDeleteModal}>
                    Cancel
                </Button>
            </Grid>
            <Grid item>
                <Button variant="outlined" color="primary" onClick={handleDeleteReply}>
                    Confirm
                </Button>
            </Grid>
        </Grid>
        </Box>
      </Modal>
      <Modal
        open={openEditReplyModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box component="form" sx={style} onSubmit={handleEditReply}>
          <Typography id="edit-modal-title" variant="h5" component="h2" fontWeight="bold">
            Edit Reply
          </Typography>
          <Typography variant="h6">
            Reply:
          </Typography>
          <TextField multiline rows={3} defaultValue={replyValue} onChange={handleInputChange} inputProps={{style: inputStyle}} fullWidth id="newContent" name="newContent"/>
          <Grid container spacing={2} justifyContent="flex-end" paddingTop={2}>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={handleCloseEditModal}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" disabled={replyValue === content} type='submit'>
                Edit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Container>
  )}
