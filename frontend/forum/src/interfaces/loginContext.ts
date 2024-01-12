import React from "react";

export interface AlertType {
  status: boolean,
  message: string
}

export interface contextProps {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    openAlert: AlertType,
    setOpenAlert: React.Dispatch<React.SetStateAction<AlertType>>,
  }

export const LoginContext = React.createContext<contextProps>({isLoggedIn: false, 
                                                                setIsLoggedIn: () => false, 
                                                                openAlert: {status: false, message: ""}, 
                                                                setOpenAlert: () => false});