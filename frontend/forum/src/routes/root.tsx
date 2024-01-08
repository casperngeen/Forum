
import { Outlet } from 'react-router-dom';
import Header from '../components/header';
import { ThemeProvider } from '@mui/material';
import theme from '../components/theme';
import { LoginContext } from '../interfaces/loginContext';
import React from 'react';

//the children component is rendered in outlet
// aria-label: description for the html tag/element, content does not affect rendering of the html

// main framework for the website: contains a nav bar, and a componenet to render the main content (threads or list of threads)
export default function Root() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  return (
    <div>
        <ThemeProvider theme={theme} >
            <LoginContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
              <Header />
              <Outlet />
            </LoginContext.Provider>
        </ThemeProvider>
    </div>
  )
}
