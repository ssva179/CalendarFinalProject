// Edison (UI)

"use client"

import Link from "next/link";
import styled from 'styled-components';
import NavMenu from "@/components/NavMenu";
import { signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";

const StyledNav = styled.nav`
    width: 100vw;
    padding: 1%;
    background: #AACDDC;
`;

const StyledUl = styled.ul`
    width: 80%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: auto;
`;

export default function Nav() {
    const { data: session } = useSession();

    const auth: ReactNode = session ? (
        <span onClick={() => signOut({ callbackUrl: "/login" })} style={{ cursor: "pointer" }}>
            Sign Out
        </span>
    ) : (
        <Link href="/login">Log In</Link>
    );

    return (
        <StyledNav>
            <StyledUl>
                <li><NavMenu auth={auth} /></li>
                <li>{auth}</li>
            </StyledUl>
        </StyledNav>
    );
}