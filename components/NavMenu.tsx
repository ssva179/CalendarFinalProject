// Edison (UI) + Stephanie (Auth)
"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";
// import {SignOut} from "@/components/authentication/SignOut"; // edited below
import { signOut, useSession } from "next-auth/react";
import {Box} from "@mui/material";

// https://mui.com/material-ui/react-menu/
// NavMenu
// returns a clickable dashboard to display the app's Nav links as decided in the UI design
export default function NavMenu() {

    // null -> menu is closed, HTMLElement -> the menu is open
    const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorElement);

    // store the clicked Dashboard Menu
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(event.currentTarget);
    };

    // set anchor to null -> closes menu
    const handleClose = () => {
        setAnchorElement(null);
    };

    //Using session hook in NextAuth to see if were signed in
    // https://next-auth.js.org/getting-started/client
    const {data:session} = useSession();
    const auth = session?(
        // <MenuItem onClick={handleClose}>
        //     <SignOut />
        // </MenuItem>

        // See the original here: /component/authentication/SignOut.tsx
        // Moved function directly into MenuItem so it takes 100% of its space,
        // or else the button wouldn't work if it wasn't clicked in a specific place
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
            {/* Dashboard Button */}
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                Dashboard
            </Button>

            {/* Menu that opens up */}
            <Menu
                id="basic-menu"
                anchorEl={anchorElement}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                {/* Links to app pages */}
                <MenuItem component={Link} href={'/calendar'} onClick={handleClose}>My Calendar</MenuItem>
                <MenuItem component={Link} href={'/profile'} onClick={handleClose}>My Profile</MenuItem>
                <MenuItem component={Link} href={'/calendar/add'} onClick={handleClose}>ADD EVENT</MenuItem>
                <MenuItem component={Link} href={'/calendar/import'} onClick={handleClose}>IMPORT .ics FILE</MenuItem>

                {/* switches between Login or Sign Out MenuItem buttons with auth logic */}
                {auth}
            </Menu>
        </Box>
    );
}