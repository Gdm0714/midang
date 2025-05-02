import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const NotFoundContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  text-align: center;
`;

const ErrorCode = styled(motion.h1)`
  font-size: 8rem;
  color: #333;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const ErrorTitle = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ErrorDescription = styled(motion.p)`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HomeButton = styled(motion.div)`
  display: inline-block;
`;

const HomeLink = styled(Link)`
  background-color: #333;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #444;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <ErrorCode
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        404
      </ErrorCode>

      <ErrorTitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        페이지를 찾을 수 없습니다
      </ErrorTitle>

      <ErrorDescription
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수
        없는 상태입니다. 홈페이지로 돌아가서 다시 시작해보세요.
      </ErrorDescription>

      <HomeButton
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <HomeLink to="/">홈페이지로 돌아가기</HomeLink>
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
