"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from "next/link";

export default function NavMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
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
                <MenuItem onClick={handleClose}>
                    <Link href={'/calendar/add'}>ADD EVENT</Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href={'/calendar/import'}>IMPORT .ics FILE</Link>
                </MenuItem>

                {/* SHOULD SWITCH TO LOGOUT WHEN AUTHENTICATED */}
                <MenuItem onClick={handleClose}>
                    <Link href={'/login'}>LOGIN</Link>
                </MenuItem>

                {/* SHOULD BE VISIBLE IF NOT LOGGED IN */}
                <MenuItem onClick={handleClose}>
                    <Link href={'/signup'}>SIGN UP</Link>
                </MenuItem>
            </Menu>
        </div>
    );
}