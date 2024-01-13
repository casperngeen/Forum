import React from "react";
import AlertType from "../types/alertType";

export interface contextProps {
    errorAlert: AlertType,
    setErrorAlert: React.Dispatch<React.SetStateAction<AlertType>>,
    triggerRender: boolean,
    setTriggerRender: React.Dispatch<React.SetStateAction<boolean>>,
}

export const ReplyContext = React.createContext<contextProps>({ errorAlert: {status: false, message: ""}, setErrorAlert: () => false, triggerRender: false, setTriggerRender: () => false});