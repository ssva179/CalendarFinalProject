import styled from 'styled-components';

const StyledTitle = styled.h1`
    font-size: calc(10px + 2vw);
    color: #0a0a0a;
`;

const StyledHeader = styled.header`
    width: 100%;
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: wheat;
`;

export default function Header() {
    return (
        <StyledHeader>
            <StyledTitle>Calendar Project</StyledTitle>
        </StyledHeader>
    )
}