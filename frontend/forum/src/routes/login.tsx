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
import { ThemeProvider } from '@mui/material/styles';
import { login } from '../network/authApi';
import { useNavigate } from 'react-router-dom';
import theme from '../components/theme';
import { LoginContext } from '../interfaces/loginContext';
import { Snackbar, Alert } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://casperngeen.vercel.app/">
        Casper Ng
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO change the handleSubmit to verifying with database (fetch request) -> need a specific error message page also for wrong password or username
export default function Login() {
    interface ErrorType {
        status: boolean,
        message: string,
    }

    const navigate = useNavigate();
    const { setIsLoggedIn } = React.useContext(LoginContext);
    const [ openAlert, setOpenAlert ] = React.useState<boolean>(false);
    const [ error, setError ] = React.useState<ErrorType>({status: false, message: ""});

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevents page reload which is what happens by default when a form is submitted (used for links and forms usually)
    
        // event.currentTarget: refers to the element where the event handler is attached to
        // event.target: the element which triggered the event (may or may not be the same as the currentTarget)fc
        const data = new FormData(event.currentTarget); 
        const username: string = data.get("username") as string;
        const password: string = data.get("password") as string;
        try {
            const userData = await login({username: username, password: password});
            localStorage.setItem("user", JSON.stringify(userData));
            setIsLoggedIn(true);
            navigate("/");
        } catch (error) {
            setError({status: true, message: (error as Error).message || "Login failed"});
        }
    };

    const handleClose = () => {
        setOpenAlert(false);
    }

    const handleErrorClose = () => {
        setError({status: false, message: ""});
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                    <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus />
                            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                    Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register" variant="body2">
                                        Don't have an account? Sign Up
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
                <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Login successful!
                    </Alert>
                </Snackbar>
                <Snackbar open={error.status} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                        {error.message}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}