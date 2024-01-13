import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { register } from '../network/authApi';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import AlertErrorSnackBar from '../components/alertErrorSnackBar';
import { RootContext } from '../contexts/rootContext';
import Copyright from '../components/copyright';


// TODO: change the handleSubmit to log the data to the database (make fetch request)
export default function Register() {
  interface ErrorType {
    status: boolean,
    message: string,
  }

  const navigate = useNavigate();
  const [ error, setError ] = React.useState<ErrorType>({status: false, message: ""});
  const { setSuccessAlert } = React.useContext(RootContext);

  // checks if form is filled up properly, then sends the data to the backend for storage
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    const checkPassword = data.get('checkPassword') as string;
    if (username.length === 0) {
      setError({status: true, message: "Username cannot be empty"});
    } else if (password.length < 5) {
      setError({status: true, message: "Password needs to be at least 5 characters long!"});
    } else if (password !== checkPassword) {
      setError({status: true, message: "Passwords do not match!"});
    } else {
      try {
        await register({username: username, password: password});
        setSuccessAlert({status: true, message: "Registration successful"});
        navigate("/login");
      } catch (error) {
        setError({status: true, message: (error as Error).message || "There has been an error registering"});
      }
    }
  };
  
  const handleBack = () => {
    navigate('/');
  }

  // handles closing of snackbar
  const handleClose = () => {
    setError((prevState) => ({
      ...prevState,
      status: false,
    }));
  }

  return (
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Grid container>
            <Grid item xs={4} marginTop={1} sx={{display: "flex", justifyContent:"center"}}>
                <Button onClick={handleBack} variant="outlined"><ArrowBack /></Button>
            </Grid>
            <Grid item xs={4} sx={{display:"flex", justifyContent: "center"}}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
            </Grid>
          </Grid>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "33.7rem" }}>
            <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus/>
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="off" />
            <TextField margin="normal" required fullWidth name="checkPassword" label="Re-enter Password" type="password" id="checkPassword" autoComplete="off" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        <AlertErrorSnackBar state={error} onClose={handleClose} />
      </Container>
  );
}