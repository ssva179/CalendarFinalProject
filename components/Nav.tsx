import Link from "next/link";
import styled from 'styled-components';
import NavMenu from "@/components/NavMenu";

const StyledNav = styled.nav`
    width: 100vw;
    padding: 1%;
    background: #AACDDC;
`;

const StyledUl = styled.ul`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export default function Nav() {
    return (
      <StyledNav>
          <StyledUl>
              <li>
                  <NavMenu />
              </li>
              <li>
                  <Link href={'/login'}>LOGIN</Link>
              </li>
          </StyledUl>
      </StyledNav>
    );
}