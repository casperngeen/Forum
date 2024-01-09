import React from "react";

export interface contextProps {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    openAlert: boolean,
    setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>,
  }

export const LoginContext = React.createContext<contextProps>({isLoggedIn: false, setIsLoggedIn: () => false, 
                                                                openAlert: false, setOpenAlert: () => false});