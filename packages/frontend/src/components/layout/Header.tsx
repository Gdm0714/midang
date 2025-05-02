import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
`;

interface NavProps {
  isOpen: boolean;
}

const Nav = styled.nav<NavProps>`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

interface NavLinkProps {
  isActive: boolean;
}

const NavLink = styled(Link)<NavLinkProps>`
  text-decoration: none;
  color: ${({ isActive }) => (isActive ? "#000" : "#666")};
  font-weight: ${({ isActive }) => (isActive ? "600" : "400")};
  transition: color 0.3s ease;

  &:hover {
    color: #000;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  return (
      <HeaderContainer>
        <Logo to="/">미당건축사사무소</Logo>

        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</MenuButton>

        <Nav isOpen={isMenuOpen}>
          <NavLink to="/" isActive={isActive("/")}>
            홈
          </NavLink>
          <NavLink to="/projects" isActive={isActive("/projects")}>
            프로젝트
          </NavLink>
          <NavLink to="/about" isActive={isActive("/about")}>
            소개
          </NavLink>
          <NavLink to="/contact" isActive={isActive("/contact")}>
            연락처
          </NavLink>
        </Nav>
      </HeaderContainer>
  );
};

export default Header;