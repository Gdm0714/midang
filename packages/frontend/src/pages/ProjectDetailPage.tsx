import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchProjectById } from "../services/api";
import { Project } from "@architecture-firm/shared/src/types/project";

interface ProjectWithImages extends Project {
  images: Array<{
    id: number;
    url: string;
    description: string;
  }>;
  category: {
    id: number;
    name: string;
  };
}

const ProjectContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const BreadcrumbNav = styled.nav`
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const BreadcrumbLink = styled(Link)`
  color: #666;
  text-decoration: none;

  &:hover {
    color: #333;
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 3rem;
`;

const ProjectTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 2rem;
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Gallery = styled.div`
  margin-bottom: 3rem;
`;

const MainImage = styled.img`
  width: 100%;
  height: 600px;
  object-fit: cover;
  margin-bottom: 1rem;
  border-radius: 5px;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

interface ThumbnailImageProps {
  src: string;
  alt: string;
  isActive: boolean;
  onClick: () => void;
}

const ThumbnailImage = styled.img<ThumbnailImageProps>`
  width: 80px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: ${props => props.isActive ? '2px solid #333' : 'none'};
  opacity: ${props => props.isActive ? 1 : 0.7};
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const ProjectContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectDescription = styled.div``;

const DescriptionText = styled.p`
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #333;
`;

const ProjectDetails = styled.div`
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 5px;
`;

const DetailTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 30px;
    height: 2px;
    background-color: #333;
  }
`;

const DetailList = styled.dl`
  margin: 0;
`;

const DetailTerm = styled.dt`
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

const DetailDescription = styled.dd`
  margin: 0;
  color: #666;
`;

const RelatedProjects = styled.section`
  margin-top: 5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #333;
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const RelatedCard = styled(motion.div)`
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const RelatedImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const RelatedInfo = styled.div`
  padding: 1rem;
`;

const RelatedTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const RelatedLocation = styled.p`
  color: #666;
  font-size: 0.8rem;
`;

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: project,
    isLoading,
    error,
  } = useQuery<ProjectWithImages>(["project", id], () => fetchProjectById(Number(id)));

  // 더미 관련 프로젝트
  const relatedProjects = [
    {
      id: 101,
      title: "서울 레지던스",
      location: "서울, 한국",
      year: 2022,
      imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    },
    {
      id: 102,
      title: "부산 오피스",
      location: "부산, 한국",
      year: 2021,
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      id: 103,
      title: "제주 빌라",
      location: "제주, 한국",
      year: 2023,
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    },
  ];

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>프로젝트를 불러오는 중 오류가 발생했습니다.</p>;
  if (!project) return <p>프로젝트를 찾을 수 없습니다.</p>;

  // 프로젝트 이미지가 없을 경우 기본 이미지
  const projectImages =
    project.images && project.images.length > 0
      ? project.images
      : [
          {
            id: 0,
            url: process.env.REACT_APP_DEFAULT_IMAGE_URL || "https://via.placeholder.com/800x600?text=No+Image",
            description: "",
          },
        ];

  return (
    <ProjectContainer>
      <BreadcrumbNav>
        <BreadcrumbLink to="/">홈</BreadcrumbLink> &gt;{" "}
        <BreadcrumbLink to="/projects">프로젝트</BreadcrumbLink> &gt;{" "}
        {project.title}
      </BreadcrumbNav>

      <ProjectHeader>
        <ProjectTitle>{project.title}</ProjectTitle>
        <ProjectMeta>
          <MetaItem>
            <span>위치:</span> {project.location}
          </MetaItem>
          <MetaItem>
            <span>연도:</span> {project.year}
          </MetaItem>
          <MetaItem>
            <span>클라이언트:</span> {project.client}
          </MetaItem>
          <MetaItem>
            <span>상태:</span>{" "}
            {project.status === "completed" ? "완료" : "진행 중"}
          </MetaItem>
        </ProjectMeta>
      </ProjectHeader>

      <Gallery>
        <MainImage
          src={projectImages[activeImageIndex].url}
          alt={`${project.title} - ${activeImageIndex + 1}`}
        />
        <ThumbnailsContainer>
          {projectImages.map((image: { id: number; url: string; description: string }, index: number) => (
            <ThumbnailImage
              key={image.id}
              src={image.url}
              alt={image.description}
              isActive={index === activeImageIndex}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </ThumbnailsContainer>
      </Gallery>

      <ProjectContent>
        <ProjectDescription>
          <DescriptionText>{project.description}</DescriptionText>
          <DescriptionText>
            본 프로젝트는 건축소사무소의 접근 방식을 잘 보여주는 사례입니다.
            주변 환경과의 조화를 고려하고, 지속 가능한 건축 요소를 적용하여
            효율적이면서도 아름다운 공간을 창출하였습니다.
          </DescriptionText>
          <DescriptionText>
            프로젝트의 디자인은 기능성과 심미성을 모두 고려하며, 클라이언트의
            요구사항을 세심하게 반영하였습니다. 자연 채광을 최대한 활용하고,
            공간의 흐름을 자연스럽게 이어주는 설계로 사용자 경험을 높였습니다.
          </DescriptionText>
        </ProjectDescription>

        <ProjectDetails>
          <DetailTitle>프로젝트 세부 정보</DetailTitle>
          <DetailList>
            <DetailTerm>건축 유형</DetailTerm>
            <DetailDescription>
              {project.category?.name || "미분류"}
            </DetailDescription>

            <DetailTerm>규모</DetailTerm>
            <DetailDescription>500m²</DetailDescription>

            <DetailTerm>주요 자재</DetailTerm>
            <DetailDescription>콘크리트, 유리, 목재</DetailDescription>

            <DetailTerm>협력업체</DetailTerm>
            <DetailDescription>구조 설계: 구조 엔지니어링</DetailDescription>
            <DetailDescription>조경: 그린스페이스 디자인</DetailDescription>

            <DetailTerm>특징</DetailTerm>
            <DetailDescription>친환경 설계</DetailDescription>
            <DetailDescription>자연 채광 최적화</DetailDescription>
            <DetailDescription>에너지 효율성 향상</DetailDescription>
          </DetailList>
        </ProjectDetails>
      </ProjectContent>

      <RelatedProjects>
        <SectionTitle>관련 프로젝트</SectionTitle>
        <RelatedGrid>
          {relatedProjects.map((relatedProject) => (
            <RelatedCard
              key={relatedProject.id}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/projects/${relatedProject.id}`}>
                <RelatedImage
                  src={relatedProject.imageUrl}
                  alt={relatedProject.title}
                />
                <RelatedInfo>
                  <RelatedTitle>{relatedProject.title}</RelatedTitle>
                  <RelatedLocation>
                    {relatedProject.location} · {relatedProject.year}
                  </RelatedLocation>
                </RelatedInfo>
              </Link>
            </RelatedCard>
          ))}
        </RelatedGrid>
      </RelatedProjects>
    </ProjectContainer>
  );
};

export default ProjectDetailPage;
