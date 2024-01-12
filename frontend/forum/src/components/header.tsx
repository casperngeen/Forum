import { Avatar, Box, Button, Grid, Menu, MenuItem, Modal, Typography } from "@mui/material";
import React from "react"
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../interfaces/loginContext";
import { logout } from "../network/authApi";
import { Person } from "@mui/icons-material";

export default function Header() {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, setOpenAlert } = React.useContext(LoginContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const [logoutOpen, setLogoutOpen] = React.useState<boolean>(false);

    const handleLogin = () => {
        navigate("/login");
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleProfile = () => {
        setAnchorEl(null);
        //add navigate to profile page
    }
    const handleCloseLogout = () => {
        setLogoutOpen(false);
        setAnchorEl(null);
    }
    const handleLogoutMenu = () => {
        setLogoutOpen(true);
    }
    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setLogoutOpen(false);
        setAnchorEl(null);
        setOpenAlert({status: true, message: "Logout successful"});
        navigate("/");
    }

    const style = {
        position: 'absolute' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    return (
        <Grid justifyContent="center" container spacing={3} marginY={3}>
            <Grid item>
                <Typography variant="h2" fontWeight="bold" marginLeft={2}>NUS FORUM</Typography>
            </Grid>
            <Grid item marginTop={2}>
                {
                    isLoggedIn
                    ? (
                        <div>
                            <Button
                                onClick={handleClick} 
                                id="menu-button"
                                aria-controls={menuOpen ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={menuOpen ? 'true' : undefined}
                                sx={{'&:focus': {
                                    outline: "none"
                                }}}
                            >
                                <Avatar>
                                    <Person />
                                </Avatar>
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'menu-button',
                                }}
                            >
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleLogoutMenu}>Logout</MenuItem>
                                <Modal
                                    open={logoutOpen}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="bold">
                                        Confirm Logout
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ my: 2 }}>
                                        Are you sure you want to logout? You will not be able to post threads and replies once you have logged out.
                                    </Typography>
                                    <Grid container spacing={2} justifyContent="flex-end">
                                        <Grid item>
                                            <Button variant="outlined" color="primary" onClick={handleCloseLogout}>
                                            Cancel
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button variant="outlined" color="error" onClick={handleLogout}>
                                            Logout
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    </Box>
                                </Modal>
                            </Menu>
                        </div>
                    )
                    : (
                        <Button onClick={handleLogin} sx={{border: 1}}>LOGIN</Button>
                    )
                }
            </Grid>
        </Grid>
    )
}