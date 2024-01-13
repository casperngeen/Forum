import React from "react";
import AlertType from "../types/alertType";

export interface contextProps {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    successAlert: AlertType,
    setSuccessAlert: React.Dispatch<React.SetStateAction<AlertType>>,
  }

export const RootContext = React.createContext<contextProps>({isLoggedIn: false, 
                                                                setIsLoggedIn: () => false, 
                                                                successAlert: {status: false, message: ""}, 
                                                                setSuccessAlert: () => false});