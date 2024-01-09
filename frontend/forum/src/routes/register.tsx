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
import theme from '../components/theme';
import { Alert, Snackbar } from '@mui/material';
import { register } from '../network/authApi';
import { useNavigate } from 'react-router-dom';

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

// TODO: change the handleSubmit to log the data to the database (make fetch request)
export default function Register() {
  interface ErrorType {
    status: boolean,
    message: string,
  }

  const navigate = useNavigate();
  const [ error, setError ] = React.useState<ErrorType>({status: false, message: ""});
  const [ success, setSuccess ] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [navigate, success])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username') as string;
    const password = data.get('password') as string;
    const checkPassword = data.get('checkPassword') as string;
    if (password !== checkPassword) {
      setError({status: true, message: "Passwords do not match!"});
    } else {
      try {
        await register({username: username, password: password});
        setSuccess(true);
      } catch (error) {
        setError({status: true, message: (error as Error).message || "There has been an error registering"});
      }
    }
  };

  const handleClose = () => {
    setError({status: false, message: ""});
    setSuccess(false);
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
            Register
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth id="username" label="Username" name="username" autoComplete="username"/>
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="off" />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth name="checkPassword" label="Re-enter Password" type="password" id="checkPassword" autoComplete="off" />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        <Snackbar open={error.status} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error.message}
          </Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Registration successful!
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}