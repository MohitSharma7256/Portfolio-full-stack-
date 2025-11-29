import React, { useState } from "react";
import { Link as LinkR, useNavigate } from "react-router-dom";
import { Link as LinkS } from "react-scroll";
import styled, { useTheme } from "styled-components";
import { MenuRounded } from "@mui/icons-material";
import { useProfileQuery, useSocialLinksQuery } from "../hooks/usePortfolioQueries";
import { useAuth } from "../context/AuthContext";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled(LinkR)`
  width: 80%;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(LinkS)`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    border-bottom: 2px solid ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 0 6px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const GithubButton = styled.a`
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.6s ease-in-out;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const MobileIcon = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 100%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card_light + 99};
  position: absolute;
  top: 80px;
  right: 0;

  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: profile } = useProfileQuery();
  const { data: socialLinks } = useSocialLinksQuery();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const githubProfile = socialLinks?.find(
    (link) => link.platform.toLowerCase() === "github"
  );
  return (
    <Nav>
      <NavbarContainer>
        <NavLogo to="/">{profile?.name || "Portfolio"}</NavLogo>

        <MobileIcon onClick={() => setIsOpen(!isOpen)}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>

        <NavItems>
          <NavLink to="About" smooth={true} duration={500} spy={true} exact="true" offset={-80}>About</NavLink>
          <NavLink to="Skills" smooth={true} duration={500} spy={true} exact="true" offset={-80}>Skills</NavLink>
          <NavLink to="Experience" smooth={true} duration={500} spy={true} exact="true" offset={-80}>Experience</NavLink>
          <NavLink to="Projects" smooth={true} duration={500} spy={true} exact="true" offset={-80}>Projects</NavLink>
          <NavLink to="Education" smooth={true} duration={500} spy={true} exact="true" offset={-80}>Education</NavLink>
        </NavItems>

        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <NavLink onClick={() => setIsOpen(!isOpen)} to="About" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
              About
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} to="Skills" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
              Skills
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} to="Experience" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
              Experience
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} to="Projects" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
              Projects
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} to="Education" smooth={true} duration={500} spy={true} exact="true" offset={-80}>
              Education
            </NavLink>
            <GithubButton
              href={githubProfile?.url || "#"}
              target="_Blank"
              style={{
                background: theme.primary,
                color: theme.text_primary,
              }}
            >
              Github Profile
            </GithubButton>
            {isAuthenticated && isAdmin ? (
              <GithubButton
                as="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  navigate("/admin");
                }}
                style={{
                  background: theme.primary,
                  color: theme.text_primary,
                }}
              >
                Admin Dashboard
              </GithubButton>
            ) : (
              <GithubButton
                as="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  navigate("/login");
                }}
                style={{
                  background: theme.primary,
                  color: theme.text_primary,
                }}
              >
                Admin Login
              </GithubButton>
            )}
          </MobileMenu>
        )}

        <ButtonContainer>
          <GithubButton href={githubProfile?.url || "#"} target="_Blank">
            Github Profile
          </GithubButton>
          {isAuthenticated && isAdmin ? (
            <GithubButton
              as="button"
              onClick={() => navigate("/admin")}
              style={{ marginLeft: "12px" }}
            >
              Admin Dashboard
            </GithubButton>
          ) : (
            <GithubButton
              as="button"
              onClick={() => navigate("/login")}
              style={{ marginLeft: "12px" }}
            >
              Admin Login
            </GithubButton>
          )}
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
