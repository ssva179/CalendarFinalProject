// Edison (UI + Calendar)
import Link from "next/link";
import styled from 'styled-components';

const StyledTitle = styled.h1`
    font-size: calc(10px + 2vw);
    color: #0a0a0a;
    transition: color 0.2s ease, letter-spacing 0.2s ease;

    &:hover {
        color: #ffffff;
    }
`;

const StyledHeader = styled.header`
    width: 100vw;
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #81A6C6;
    font-weight: 700;
`;

export default function Header() {
    return (
        <StyledHeader>
            <Link href="/">
                <StyledTitle>Calendar Project</StyledTitle>
            </Link>
        </StyledHeader>
    )
}