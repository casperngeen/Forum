import React from "react";

export interface contextProps {
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  }

export const LoginContext = React.createContext<contextProps>({isLoggedIn: false, setIsLoggedIn: () => false});