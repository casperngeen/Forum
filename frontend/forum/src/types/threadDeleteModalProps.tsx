import AlertType from "./alertType";

export default interface ThreadDeleteModalProps {
    openDeleteThreadModal: boolean, 
    setOpenDeleteThreadModal: React.Dispatch<React.SetStateAction<boolean>>, 
    setSuccessAlert: React.Dispatch<React.SetStateAction<AlertType>>, 
    setErrorAlert: React.Dispatch<React.SetStateAction<AlertType>>, 
    threadID: number
}