import Link from "next/link";
import styled from 'styled-components';

const StyledTitle = styled.h1`
    font-size: calc(10px + 2vw);
    color: #0a0a0a;
`;

const StyledHeader = styled.header`
    width: 100vw;
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #81A6C6;
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