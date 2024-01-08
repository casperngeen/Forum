import { Avatar, Button, Grid, Typography } from "@mui/material";
import React from "react"
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../interfaces/loginContext";

export default function Header() {
    const navigate = useNavigate();
    const { isLoggedIn } = React.useContext(LoginContext);
    
    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <Grid container justifyContent="space-between">
            <Grid item xs={10}>
                <Typography variant="h1" fontWeight="bold">NUS FORUM</Typography>
            </Grid>
            <Grid item xs={2}>
                {
                    isLoggedIn
                    ? (
                        <Avatar src="to be edited"></Avatar>
                    )
                    : (
                        <Button onClick={handleLogin} sx={{border: 1}}>LOGIN</Button>
                    )
                }
            </Grid>
        </Grid>
    )
}