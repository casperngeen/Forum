import AlertType from "./alertType";
import ThreadType from "./thread";

export default interface ThreadEditModalProps {
    openEditThreadModal: boolean,
    setOpenEditThreadModal: React.Dispatch<React.SetStateAction<boolean>>,
    inputValue: string, 
    setInputValue: React.Dispatch<React.SetStateAction<string>> 
    setSuccessAlert: React.Dispatch<React.SetStateAction<AlertType>>,
    setTriggerRender: React.Dispatch<React.SetStateAction<boolean>>,
    setErrorAlert: React.Dispatch<React.SetStateAction<AlertType>>,
    threadID: number,
    threadData: ThreadType
}