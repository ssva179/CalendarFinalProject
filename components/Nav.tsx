import Link from "next/link";
import styled from 'styled-components';
import NavMenu from "@/components/NavMenu";

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
    return (
      <StyledNav>
          <StyledUl>
              <li><NavMenu /></li>
          </StyledUl>
      </StyledNav>
    );
}