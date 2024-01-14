import { Avatar, Box, Button, Container, Grid, Menu, MenuItem, Modal, Typography } from "@mui/material";
import React from "react"
import { useNavigate } from "react-router-dom";
import { RootContext } from "../contexts/rootContext";
import { logout } from "../network/authApi";
import { Person } from "@mui/icons-material";
import { modalStyle } from "../utils/modalStyle";
import { checkLoggedIn } from "../utils/checkLoggedIn";

export default function Header() {
    const navigate = useNavigate();
    const { setSuccessAlert } = React.useContext(RootContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const [logoutOpen, setLogoutOpen] = React.useState<boolean>(false);

    // sets all cookies to an expiration date that has already passed
    const clearAllCookies = () => {
        const cookies: string[] = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name] = cookie.split("=");
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        }
    };

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
        clearAllCookies();
        setLogoutOpen(false);
        setAnchorEl(null);
        setSuccessAlert({status: true, message: "Logout successful"});
        navigate("/");
    }

    return (
        <Container sx={{display: "flex", alignItems: "center", marginBottom: 3, padding: 2}}>
            <Grid justifyContent="center" alignItems="center" container spacing={3}>
                <Grid item>
                    <Typography variant="h2" fontWeight="semi-bold">MY FORUM</Typography>
                </Grid>
                <Grid item>
                    {
                        checkLoggedIn()
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
                                        <Box sx={modalStyle}>
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
        </Container>
    )
}