import { Snackbar, Alert } from '@mui/material';
import AlertSnackBarProps from '../types/errorAlertSnackBarProps';

export default function AlertSuccessSnackBar(props: AlertSnackBarProps) {
    const { state: success, onClose: handleClose } = props;
    return (
        <Snackbar open={success.status} anchorOrigin={{vertical: "top", horizontal: "center"}} autoHideDuration={3000} onClose={handleClose}>
            <Alert severity="success" sx={{ width: '100%' }}>
                {success.message}
            </Alert>
        </Snackbar>
    )
}
