import React from "react";

export interface ErrorType {
    status: boolean,
    message: string,
}
export interface contextProps {
    alertError: ErrorType,
    setAlertError: React.Dispatch<React.SetStateAction<ErrorType>>,
    triggerRender: boolean,
    setTriggerRender: React.Dispatch<React.SetStateAction<boolean>>,
}

export const ReplyContext = React.createContext<contextProps>({ alertError: {status: false, message: ""}, setAlertError: () => false, triggerRender: false, setTriggerRender: () => false});