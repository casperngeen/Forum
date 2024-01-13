import AlertType from "./alertType";

export default interface AlertSnackBarProps {
    state: AlertType,
    onClose: () => void;
}