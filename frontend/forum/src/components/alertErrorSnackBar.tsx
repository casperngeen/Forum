import { Snackbar, Alert } from '@mui/material';
import AlertSnackBarProps from '../types/errorAlertSnackBarProps';

export default function AlertErrorSnackBar(props: AlertSnackBarProps) {
    const { state: error, onClose: handleClose } = props;
    return (
        <Snackbar open={error.status} anchorOrigin={{vertical: "top", horizontal: "center"}} autoHideDuration={3000} onClose={handleClose}>
            <Alert severity="error" sx={{ width: '100%' }}>
                {error.message}
            </Alert>
        </Snackbar>
    )
}
