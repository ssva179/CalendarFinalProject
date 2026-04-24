// Edison (UI) + Stephanie (Auth)

// https://mui.com/material-ui/react-menu/
"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
// import {SignOut} from "@/components/authentication/SignOut"; // edited below
import { signOut, useSession } from "next-auth/react";
import {Box} from "@mui/material";

export default function NavMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //Using session hook in NextAuth to see if were signed in
    // https://next-auth.js.org/getting-started/client
    const {data:session} = useSession();
    const auth = session?(
        // <MenuItem onClick={handleClose}>
        //     <SignOut />
        // </MenuItem>

        // CHECK ORIGINAL IN /component/authentication/SignOut.tsx
        // MOVED FUNCTION DIRECTLY TO MenuItem SO IT TAKES 100% OF THE SPACE
        // ELSE THE BUTTON WOULD NOT WORK IF NOT CLICKED IN A SPECIFIC PLACE
        <MenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign Out
        </MenuItem>
    ) :(
        <MenuItem component={Link} href="/login" onClick={handleClose}>
            Log In
        </MenuItem>
    );

    return (
        <Box>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                Dashboard
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuItem component={Link} href={'/calendar'} onClick={handleClose}>
                    My Calendar
                </MenuItem>
                <MenuItem component={Link} href={'/profile'} onClick={handleClose}>
                    My Profile
                </MenuItem>
                <MenuItem component={Link} href={'/calendar/add'} onClick={handleClose}>
                    ADD EVENT
                </MenuItem>
                <MenuItem component={Link} href={'/calendar/import'} onClick={handleClose}>
                    IMPORT .ics FILE
                </MenuItem>
                {/* SWITCH LOGIN LOGOUT */}
                {auth}
            </Menu>
        </Box>
    );
}