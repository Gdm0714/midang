import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchProjects } from "../services/api";

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
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<FilterButtonProps>`
  background-color: ${({ isActive }) => (isActive ? "#333" : "transparent")};
  color: ${({ isActive }) => (isActive ? "white" : "#333")};
  border: 1px solid #333;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#444" : "#f1f1f1")};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button<FilterButtonProps>`
  background-color: ${({ isActive }) => (isActive ? "#333" : "transparent")};
  color: ${({ isActive }) => (isActive ? "white" : "#333")};
  border: 1px solid #333;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#444" : "#f1f1f1")};
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
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: ${({ viewMode }) => (viewMode === "grid" ? "block" : "flex")};

  @media (max-width: 768px) {
    display: block;
  }
`;

const ProjectImage = styled.img<ViewModeProps>`
  width: ${({ viewMode }) => (viewMode === "grid" ? "100%" : "300px")};
  height: ${({ viewMode }) => (viewMode === "grid" ? "250px" : "100%")};
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
`;

const ProjectsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const categories = [
    { id: 1, name: "주거 건축" },
    { id: 2, name: "상업 건축" },
    { id: 3, name: "공공 건축" },
    { id: 4, name: "인테리어" },
  ];

  const years = [2023, 2022, 2021, 2020, 2019];

  return (
      <ProjectsContainer>
        <PageTitle>프로젝트</PageTitle>
        <PageDescription>
          건축소사무소에서 진행한 다양한 프로젝트를 소개합니다.
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

        <FilterGroup style={{ marginBottom: "2rem" }}>
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

        {isLoading ? (
            <p>로딩 중...</p>
        ) : error ? (
            <p>프로젝트를 불러오는 중 오류가 발생했습니다.</p>
        ) : (
            <ProjectsGrid viewMode={viewMode}>
              {filteredProjects?.map((project) => (
                  <ProjectCard
                      key={project.id}
                      viewMode={viewMode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                  >
                    <ProjectImage
                        viewMode={viewMode}
                        src={
                          project.images && project.images.length > 0
                              ? project.images[0].url
                              : "https://via.placeholder.com/350x250?text=No+Image"
                        }
                        alt={project.title}
                    />
                    <div>
                      <h3>{project.title}</h3>
                      <p>
                        {project.location} · {project.year}
                      </p>
                      <p>{project.description}</p>
                      <Link to={`/projects/${project.id}`}>자세히 보기</Link>
                    </div>
                  </ProjectCard>
              ))}
            </ProjectsGrid>
        )}
      </ProjectsContainer>
  );
};

export default ProjectsPage;