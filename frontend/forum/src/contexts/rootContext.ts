import React from "react";
import AlertType from "../types/alertType";

export interface contextProps {
    successAlert: AlertType,
    setSuccessAlert: React.Dispatch<React.SetStateAction<AlertType>>,
  }

export const RootContext = React.createContext<contextProps>({successAlert: {status: false, message: ""}, 
                                                              setSuccessAlert: () => false,
                                                            });