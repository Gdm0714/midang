import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #333;
  color: white;
  padding: 2rem 0;
`;

const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  padding: 0 2rem;
  margin-bottom: 2rem;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 0.75rem 2rem;
  color: #ddd;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #444;
    color: white;
  }
  
  &.active {
    background-color: #555;
    color: white;
    border-left: 4px solid #4CAF50;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const AdminLayout = () => {
    return (
        <AdminContainer>
            <Sidebar>
                <SidebarTitle>관리자 페이지</SidebarTitle>
                <NavMenu>
                    <NavItem>
                        <StyledNavLink to="/admin/dashboard">대시보드</StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to="/admin/projects">프로젝트 관리</StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to="/admin/categories">카테고리 관리</StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to="/admin/images">이미지 관리</StyledNavLink>
                    </NavItem>
                    <NavItem>
                        <StyledNavLink to="/">사이트로 돌아가기</StyledNavLink>
                    </NavItem>
                </NavMenu>
            </Sidebar>
            <Content>
                <Outlet />
            </Content>
        </AdminContainer>
    );
};

export default AdminLayout;