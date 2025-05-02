import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchFeaturedProjects } from "../services/api";

const HomeContainer = styled.div`
  max-width: 100%;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f5f5f5;
  padding: 0 2rem;
  position: relative;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("https://images.unsplash.com/photo-1487958449943-2429e8be8625");
  background-size: cover;
  background-position: center;
  filter: brightness(0.7);
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  color: white;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #f0f0f0;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroButton = styled(motion.button)`
  background-color: white;
  color: #333;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }
`;

const FeaturedSection = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background-color: #333;
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ProjectInfo = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const ProjectLocation = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectLink = styled(Link)`
  display: inline-block;
  color: #333;
  font-weight: 600;
  text-decoration: none;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #333;
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: right;
  }

  &:hover:after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const AboutSection = styled.section`
  padding: 5rem 2rem;
  background-color: #f5f5f5;
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const AboutImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const AboutInfo = styled.div``;

const AboutText = styled.p`
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #333;
`;

const AboutButton = styled(Link)`
  display: inline-block;
  background-color: #333;
  color: white;
  padding: 0.8rem 2rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #555;
    transform: translateY(-2px);
  }
`;

const HomePage = () => {
  const {
    data: featuredProjects,
    isLoading,
    error,
  } = useQuery("featuredProjects", fetchFeaturedProjects);

  return (
    <HomeContainer>
      <HeroSection>
        <HeroBackground />
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            건축을 통한 공간의 재해석
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            혁신적인 디자인으로 일상의 공간에 새로운 가치를 더합니다
          </HeroSubtitle>
          <Link to="/projects">
            <HeroButton
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              프로젝트 둘러보기
            </HeroButton>
          </Link>
        </HeroContent>
      </HeroSection>

      <FeaturedSection>
        <SectionTitle>주요 프로젝트</SectionTitle>
        {isLoading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>프로젝트를 불러오는 중 오류가 발생했습니다.</p>
        ) : (
          <ProjectsGrid>
            {featuredProjects?.map((project) => (
              <ProjectCard
                key={project.id}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProjectImage
                  src={
                    project.images && project.images.length > 0
                      ? project.images[0].url
                      : "https://via.placeholder.com/350x250?text=No+Image"
                  }
                  alt={project.title}
                />
                <ProjectInfo>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectLocation>
                    {project.location} · {project.year}
                  </ProjectLocation>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <ProjectLink to={`/projects/${project.id}`}>
                    자세히 보기
                  </ProjectLink>
                </ProjectInfo>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        )}
      </FeaturedSection>

      <AboutSection>
        <AboutContent>
          <AboutImage
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
            alt="About Us"
          />
          <AboutInfo>
            <SectionTitle>우리 소개</SectionTitle>
            <AboutText>
              2010년 설립된 건축소사무소는 혁신적인 디자인과 친환경적인 접근
              방식으로 다양한 건축 프로젝트를 성공적으로 수행해왔습니다. 우리는
              공간이 인간의 삶에 미치는 영향력을 깊이 이해하고, 각 프로젝트가
              고객의 필요와 가치를 반영할 수 있도록 최선을 다합니다.
            </AboutText>
            <AboutText>
              건축소사무소의 디자인 철학은 기능성과 미학의 조화, 그리고 지속
              가능한 건축에 중점을 두고 있습니다. 우리는 매 프로젝트를 통해
              공간의 새로운 가능성을 모색하고, 사용자의 경험을 향상시키는
              솔루션을 제공합니다.
            </AboutText>
            <AboutButton to="/about">더 알아보기</AboutButton>
          </AboutInfo>
        </AboutContent>
      </AboutSection>
    </HomeContainer>
  );
};

export default HomePage;
