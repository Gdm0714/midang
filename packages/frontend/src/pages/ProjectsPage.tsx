import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchProjects } from "../services/api";
import { Category, fetchCategories } from "../services/categoryService";

interface FilterButtonProps {
  isActive: boolean;
}

interface ViewModeProps {
  viewMode: "grid" | "list";
}

const ProjectsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #4CAF50, #2196F3);
  }
`;

const PageDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  line-height: 1.6;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<FilterButtonProps>`
  background-color: ${({ isActive }) => (isActive ? "#3498db" : "white")};
  color: ${({ isActive }) => (isActive ? "white" : "#333")};
  border: 1px solid ${({ isActive }) => (isActive ? "#3498db" : "#ddd")};
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${({ isActive }) => (isActive ? "600" : "400")};
  box-shadow: ${({ isActive }) => (isActive ? "0 2px 6px rgba(52, 152, 219, 0.3)" : "none")};

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#2980b9" : "#f1f1f1")};
    transform: translateY(-2px);
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button<FilterButtonProps>`
  background-color: ${({ isActive }) => (isActive ? "#3498db" : "white")};
  color: ${({ isActive }) => (isActive ? "white" : "#333")};
  border: 1px solid ${({ isActive }) => (isActive ? "#3498db" : "#ddd")};
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#2980b9" : "#f1f1f1")};
    transform: translateY(-2px);
  }
`;

const ProjectsGrid = styled.div<ViewModeProps>`
  display: grid;
  grid-template-columns: ${({ viewMode }) =>
    viewMode === "grid" ? "repeat(auto-fill, minmax(350px, 1fr))" : "1fr"};
  gap: 2rem;
`;

const ProjectCard = styled(motion.div)<ViewModeProps>`
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  display: ${({ viewMode }) => (viewMode === "grid" ? "block" : "flex")};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const ProjectImage = styled.div<ViewModeProps & { bgUrl: string }>`
  width: ${({ viewMode }) => (viewMode === "grid" ? "100%" : "300px")};
  height: ${({ viewMode }) => (viewMode === "grid" ? "250px" : "100%")};
  background-image: url(${props => props.bgUrl});
  background-size: cover;
  background-position: center;
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    opacity: ${({ viewMode }) => (viewMode === "grid" ? "1" : "0")};
    transition: opacity 0.3s ease;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
`;

const ProjectInfo = styled.div<ViewModeProps>`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  ${({ viewMode }) => viewMode === "list" && `
    padding-left: 2rem;
  `}
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  color: #333;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const ProjectLocation = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:before {
    content: "📍";
    font-size: 1.1rem;
  }
`;

const ProjectYear = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  &:before {
    content: "🗓";
    font-size: 1.1rem;
  }
`;

const ProjectCategory = styled.span`
  background-color: #e8f4fd;
  color: #3498db;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
`;

const ProjectLink = styled(Link)`
  display: inline-block;
  color: #3498db;
  font-weight: 600;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border: 2px solid #3498db;
  border-radius: 30px;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    background-color: #3498db;
    color: white;
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin: 2rem 0;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #ddd;
`;

const EmptyStateText = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const YearFiltersContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
  background-color: #f1f8e9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

// 나머지 컴포넌트 내용은 그대로 유지하고, return 부분만 수정
// 이전 코드에서 아래처럼 변경

const ProjectsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery(["projects", categoryFilter], () =>
      fetchProjects(categoryFilter ?? undefined),
  );

  const filteredProjects = projects?.filter((project) => {
    if (yearFilter && project.year !== yearFilter) {
      return false;
    }
    return true;
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(
      'categories',
      fetchCategories
  );

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  const years = [2023, 2022, 2021, 2020, 2019];

  const renderEmptyState = () => (
      <EmptyState>
        <EmptyStateIcon>🏗️</EmptyStateIcon>
        <EmptyStateText>선택한 필터에 해당하는 프로젝트가 없습니다.</EmptyStateText>
        <FilterButton isActive={false} onClick={() => {
          setCategoryFilter(null);
          setYearFilter(null);
        }}>
          필터 초기화
        </FilterButton>
      </EmptyState>
  );

  return (
      <ProjectsContainer>
        <PageTitle>프로젝트</PageTitle>
        <PageDescription>
          건축소사무소에서 진행한 다양한 프로젝트들을 소개합니다.
          카테고리와 연도별로 살펴보세요.
        </PageDescription>

        <FilterContainer>
          <FilterGroup>
            <FilterButton
                isActive={categoryFilter === null}
                onClick={() => setCategoryFilter(null)}
            >
              전체
            </FilterButton>
            {categories.map((category) => (
                <FilterButton
                    key={category.id}
                    isActive={categoryFilter === category.id}
                    onClick={() => setCategoryFilter(category.id)}
                >
                  {category.name}
                </FilterButton>
            ))}
          </FilterGroup>

          <ViewToggle>
            <ViewButton
                isActive={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
            >
              □
            </ViewButton>
            <ViewButton
                isActive={viewMode === "list"}
                onClick={() => setViewMode("list")}
            >
              ≡
            </ViewButton>
          </ViewToggle>
        </FilterContainer>

        <YearFiltersContainer>
          <FilterGroup>
            <FilterButton
                isActive={yearFilter === null}
                onClick={() => setYearFilter(null)}
            >
              전체 연도
            </FilterButton>
            {years.map((year) => (
                <FilterButton
                    key={year}
                    isActive={yearFilter === year}
                    onClick={() => setYearFilter(year)}
                >
                  {year}
                </FilterButton>
            ))}
          </FilterGroup>
        </YearFiltersContainer>

        {isLoading ? (
            <p>로딩 중...</p>
        ) : error ? (
            <p>프로젝트를 불러오는 중 오류가 발생했습니다.</p>
        ) : filteredProjects && filteredProjects.length > 0 ? (
            <ProjectsGrid viewMode={viewMode}>
              {filteredProjects.map((project) => (
                  <ProjectCard
                      key={project.id}
                      viewMode={viewMode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -10 }}
                  >
                    <ProjectImage
                        viewMode={viewMode}
                        bgUrl={
                          project.images && project.images.length > 0
                              ? project.images[0].url
                              : "https://via.placeholder.com/350x250?text=No+Image"
                        }
                    />
                    <ProjectInfo viewMode={viewMode}>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectMeta>
                        <ProjectLocation>{project.location}</ProjectLocation>
                        <ProjectYear>{project.year}</ProjectYear>
                      </ProjectMeta>
                      {project.category && (
                          <ProjectCategory>{project.category.name}</ProjectCategory>
                      )}
                      <ProjectDescription>{project.description}</ProjectDescription>
                      <ProjectLink to={`/projects/${project.id}`}>자세히 보기</ProjectLink>
                    </ProjectInfo>
                  </ProjectCard>
              ))}
            </ProjectsGrid>
        ) : (
            renderEmptyState()
        )}
      </ProjectsContainer>
  );
};

export default ProjectsPage;