import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProjectById } from "../services/api";
import { fetchImagesByProject } from "../services/imageService";
import { Project } from "@architecture-firm/shared/dist/types/project.js";

interface ProjectWithImages extends Project {
    images: Array<{
        id: number;
        url: string;
        description: string;
        isFeatured: boolean;
    }>;
}

const ProjectContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
`;

const BreadcrumbNav = styled.nav`
    margin-bottom: 2rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const BreadcrumbLink = styled(Link)`
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
        color: #2980b9;
    }

    &:after {
        content: "/";
        margin-left: 0.5rem;
        color: #ccc;
    }
`;

const BreadcrumbCurrent = styled.span`
    color: #666;
`;

const ProjectHeader = styled.div`
    margin-bottom: 3rem;
    position: relative;
    padding-bottom: 2rem;

    &:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(to right, #3498db, transparent);
    }
`;

const ProjectTitle = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
    color: #333;
`;

const ProjectMeta = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    color: #666;
    font-size: 1rem;
    margin-bottom: 2rem;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f8f9fa;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const MetaIcon = styled.span`
    font-size: 1.2rem;
`;

const CategoryBadge = styled.div`
    background-color: #3498db;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    display: inline-block;
    margin-bottom: 1rem;
`;

const StatusBadge = styled.div<{ status: string }>`
    background-color: ${({ status }) => {
        switch (status) {
            case 'planning':
                return '#3498db';
            case 'inProgress':
                return '#f39c12';
            case 'completed':
                return '#2ecc71';
            default:
                return '#95a5a6';
        }
    }};
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;

    &:before {
        content: ${({ status }) => {
            switch (status) {
                case 'planning':
                    return '"🔍"';
                case 'inProgress':
                    return '"🏗️"';
                case 'completed':
                    return '"✅"';
                default:
                    return '"❓"';
            }
        }};
    }
`;

const Gallery = styled.div`
    margin-bottom: 3rem;
    background-color: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const MainImageContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 600px;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
`;

const MainImage = styled(motion.img)`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const ImageNavButton = styled.button<{ direction: 'prev' | 'next' }>`
    position: absolute;
    top: 50%;
    ${({ direction }) => direction === 'prev' ? 'left: 20px;' : 'right: 20px;'}
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    z-index: 10;

    &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        transform: translateY(-50%) scale(1.1);
    }
`;

const ImageCounter = styled.div`
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
`;

const ImageCaption = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 70px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    font-size: 0.9rem;
    max-width: 80%;
`;

const ThumbnailsContainer = styled.div`
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem 0;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 3px;
    }
`;

const ThumbnailWrapper = styled(motion.div)<{ isActive: boolean }>`
    border: ${props => props.isActive ? '3px solid #3498db' : '3px solid transparent'};
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: ${props => props.isActive ? 1 : 0.7};

    &:hover {
        opacity: 1;
        transform: scale(1.05);
    }
`;

const ThumbnailImage = styled.img`
    width: 100px;
    height: 75px;
    object-fit: cover;
    display: block;
`;

const ProjectContent = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    margin-top: 4rem;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
    }
`;

const ProjectDescription = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
    font-size: 1.8rem;
    margin-bottom: 2rem;
    position: relative;
    color: #333;

    &:after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 40px;
        height: 3px;
        background-color: #3498db;
    }
`;

const DescriptionText = styled.p`
    line-height: 1.8;
    margin-bottom: 2rem;
    color: #666;
    font-size: 1.1rem;
`;

const ProjectDetails = styled.div`
    background-color: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    height: fit-content;
`;

const DetailTitle = styled.h3`
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    position: relative;
    color: #333;

    &:after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 30px;
        height: 2px;
        background-color: #3498db;
    }
`;

const DetailList = styled.dl`
    margin: 0;
`;

const DetailTerm = styled.dt`
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:before {
    font-size: 1.2rem;
  }
`;

const LocationTerm = styled(DetailTerm)`
  &:before {
    content: "📍";
  }
`;

const ClientTerm = styled(DetailTerm)`
  &:before {
    content: "👥";
  }
`;

const YearTerm = styled(DetailTerm)`
  &:before {
    content: "📅";
  }
`;

const CategoryTerm = styled(DetailTerm)`
  &:before {
    content: "🏷️";
  }
`;

const StatusTerm = styled(DetailTerm)`
  &:before {
    content: "🚧";
  }
`;

const DetailDescription = styled.dd`
  margin: 0;
  color: #666;
  font-size: 1.1rem;
  padding-left: 1.7rem;
`;

const NoImageState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  height: 400px;
  border-radius: 12px;
  color: #666;
`;

const NoImageIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #ccc;
`;

const NoImageText = styled.p`
  font-size: 1.2rem;
`;

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isImagesLoading, setIsImagesLoading] = useState(true);

    const {
        data: project,
        isLoading,
        error,
    } = useQuery<ProjectWithImages>(["project", id], () => fetchProjectById(Number(id)));

    const { data: projectImages } = useQuery(
        ['projectImages', id],
        () => fetchImagesByProject(Number(id)),
        {
            enabled: !!project,
            onSuccess: () => {
                setIsImagesLoading(false);
            },
            onError: () => {
                setIsImagesLoading(false);
            },
        }
    );

    useEffect(() => {
        if (project) {
            console.log("Project data loaded:", project);
        }
    }, [project]);

    const handlePrevImage = () => {
        if (projectImages && projectImages.length > 0) {
            setActiveImageIndex((prev) =>
                prev === 0 ? projectImages.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (projectImages && projectImages.length > 0) {
            setActiveImageIndex((prev) =>
                prev === projectImages.length - 1 ? 0 : prev + 1
            );
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'planning': return '계획 중';
            case 'inProgress': return '진행 중';
            case 'completed': return '완료';
            default: return status;
        }
    };

    if (isLoading) return (
        <ProjectContainer>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <p>프로젝트 정보를 로딩 중입니다...</p>
            </motion.div>
        </ProjectContainer>
    );

    if (error) return (
        <ProjectContainer>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <p>프로젝트를 불러오는 중 오류가 발생했습니다.</p>
                <p>잠시 후 다시 시도해 주세요.</p>
                <BreadcrumbLink to="/projects">프로젝트 목록으로 돌아가기</BreadcrumbLink>
            </motion.div>
        </ProjectContainer>
    );

    if (!project) return (
        <ProjectContainer>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <p>프로젝트를 찾을 수 없습니다.</p>
                <BreadcrumbLink to="/projects">프로젝트 목록으로 돌아가기</BreadcrumbLink>
            </motion.div>
        </ProjectContainer>
    );

    return (
        <ProjectContainer>
            <BreadcrumbNav>
                <BreadcrumbLink to="/">홈</BreadcrumbLink>
                <BreadcrumbLink to="/projects">프로젝트</BreadcrumbLink>
                <BreadcrumbCurrent>{project.title}</BreadcrumbCurrent>
            </BreadcrumbNav>

            <ProjectHeader>
                <div>
                    {project.category && (
                        <CategoryBadge>{project.category.name}</CategoryBadge>
                    )}
                    <StatusBadge status={project.status}>
                        {getStatusText(project.status)}
                    </StatusBadge>
                </div>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectMeta>
                    <MetaItem>
                        <MetaIcon>📍</MetaIcon> {project.location}
                    </MetaItem>
                    <MetaItem>
                        <MetaIcon>📅</MetaIcon> {project.year}
                    </MetaItem>
                    <MetaItem>
                        <MetaIcon>👥</MetaIcon> {project.client || '비공개 고객'}
                    </MetaItem>
                </ProjectMeta>
            </ProjectHeader>

            <Gallery>
                {isImagesLoading ? (
                    <p>이미지 로딩 중...</p>
                ) : projectImages && projectImages.length > 0 ? (
                    <>
                        <MainImageContainer
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AnimatePresence mode="wait">
                                <MainImage
                                    key={projectImages[activeImageIndex].id}
                                    src={projectImages[activeImageIndex].url}
                                    alt={`${project.title} - ${activeImageIndex + 1}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </AnimatePresence>

                            {projectImages.length > 1 && (
                                <>
                                    <ImageNavButton
                                        direction="prev"
                                        onClick={handlePrevImage}
                                    >
                                        ←
                                    </ImageNavButton>
                                    <ImageNavButton
                                        direction="next"
                                        onClick={handleNextImage}
                                    >
                                        →
                                    </ImageNavButton>
                                </>
                            )}

                            <ImageCounter>
                                {activeImageIndex + 1} / {projectImages.length}
                            </ImageCounter>

                            {projectImages[activeImageIndex].description && (
                                <ImageCaption>
                                    {projectImages[activeImageIndex].description}
                                </ImageCaption>
                            )}
                        </MainImageContainer>

                        {projectImages.map((image: { id: number; url: string; description: string; isFeatured: boolean }, index: number) => (
                            <ThumbnailWrapper
                                key={image.id}
                                isActive={index === activeImageIndex}
                                onClick={() => setActiveImageIndex(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ThumbnailImage
                                    src={image.url}
                                    alt={`Thumbnail ${index + 1}`}
                                />
                            </ThumbnailWrapper>
                        ))}
                    </>
                ) : (
                    <NoImageState>
                        <NoImageIcon>🖼️</NoImageIcon>
                        <NoImageText>등록된 이미지가 없습니다.</NoImageText>
                    </NoImageState>
                )}
            </Gallery>

            <ProjectContent>
                <ProjectDescription>
                    <SectionTitle>프로젝트 소개</SectionTitle>
                    <DescriptionText>
                        {project.description || '이 프로젝트에 대한 상세 설명이 준비 중입니다.'}
                    </DescriptionText>
                </ProjectDescription>

                <ProjectDetails>
                    <DetailTitle>프로젝트 정보</DetailTitle>
                    <DetailList>
                        <LocationTerm>위치</LocationTerm>
                        <DetailDescription>{project.location}</DetailDescription>

                        <ClientTerm>클라이언트</ClientTerm>
                        <DetailDescription>{project.client || '비공개'}</DetailDescription>

                        <YearTerm>연도</YearTerm>
                        <DetailDescription>{project.year}</DetailDescription>

                        <CategoryTerm>카테고리</CategoryTerm>
                        <DetailDescription>
                            {project.category ? project.category.name : '미분류'}
                        </DetailDescription>

                        <StatusTerm>상태</StatusTerm>
                        <DetailDescription>
                            {getStatusText(project.status)}
                        </DetailDescription>
                    </DetailList>
                </ProjectDetails>
            </ProjectContent>
        </ProjectContainer>
    );
};

export default ProjectDetailPage;