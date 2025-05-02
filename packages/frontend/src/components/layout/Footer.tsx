import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const FooterContainer = styled.footer`
  background-color: #333;
  color: #fff;
  padding: 3rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FooterLink = styled(Link)`
  color: #ddd;
  text-decoration: none;
  margin-bottom: 0.5rem;

  &:hover {
    color: #fff;
  }
`;

const FooterText = styled.p`
  color: #ddd;
  margin-bottom: 0.5rem;
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid #555;
  text-align: center;
  font-size: 0.9rem;
  color: #aaa;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>미당건축사사무소</FooterTitle>
          <FooterText>
            혁신적인 디자인과 기능적인 공간 창출을 통해 최상의 건축 경험을
            제공합니다.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>바로가기</FooterTitle>
          <FooterLink to="/">홈</FooterLink>
          <FooterLink to="/projects">프로젝트</FooterLink>
          <FooterLink to="/about">소개</FooterLink>
          <FooterLink to="/contact">연락처</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>연락처</FooterTitle>
          <FooterText>경남 창원시 성산구 비음로 4번길 37-4</FooterText>
          <FooterText>전화: 010-8551-6600</FooterText>
          <FooterText>이메일: midang21@daum.net</FooterText>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        © {currentYear} 미당건축사사무소. All rights reserved.
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
