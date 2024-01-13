
import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import { Container, ThemeProvider } from '@mui/material';
import theme from '../utils/theme';
import { RootContext } from '../contexts/rootContext';
import React from 'react';
import AlertSuccessSnackBar from '../components/alertSuccessSnackBar';
import AlertType from '../types/alertType';

//the children component is rendered in outlet
// aria-label: description for the html tag/element, content does not affect rendering of the html

// main framework for the website: contains a nav bar, and a componenet to render the main content (threads or list of threads)
export default function Root() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [ successAlert, setSuccessAlert ] = React.useState<AlertType>({status: false, message: ""});

  const handleClose = () => {
    setSuccessAlert(prevState => ({
      ...prevState,
      status: false
    }));
  }

  return (
    <ThemeProvider theme={theme} >
      <Container sx={{margin:"auto", width: "50rem"}}>
          <RootContext.Provider value={{isLoggedIn, setIsLoggedIn, successAlert, setSuccessAlert}}>
              <Header />
              <Outlet />
            <AlertSuccessSnackBar state={successAlert} onClose={handleClose} />
          </RootContext.Provider>   
      </Container>
    </ThemeProvider>
  )
}
