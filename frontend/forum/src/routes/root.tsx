
import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import { Alert, Container, Fade, Snackbar, ThemeProvider } from '@mui/material';
import theme from '../components/theme';
import { AlertType, LoginContext } from '../interfaces/loginContext';
import React from 'react';

//the children component is rendered in outlet
// aria-label: description for the html tag/element, content does not affect rendering of the html

// main framework for the website: contains a nav bar, and a componenet to render the main content (threads or list of threads)
export default function Root() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [ openAlert, setOpenAlert ] = React.useState<AlertType>({status: false, message: ""});

  const handleClose = () => {
    setOpenAlert(prevState => ({
      ...prevState,
      status: false
    }));
  }

  return (
    <Container component="main">
        <ThemeProvider theme={theme} >
          <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn, openAlert, setOpenAlert}}>
            <Header />
              <Outlet />
            <Snackbar open={openAlert.status} anchorOrigin={{vertical: "top", horizontal: "center"}} onClose={handleClose} TransitionComponent={Fade} TransitionProps={{ onExited: handleClose }}>
              <Alert severity='success' sx={{ width: '100%' }}>
                {openAlert.message}
              </Alert>
            </Snackbar>
          </LoginContext.Provider>
        </ThemeProvider>
    </Container>
  )
}
