import React from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { fetchProjects } from '../../services/api';
import { fetchCategories } from '../../services/categoryService';
import { fetchImages } from '../../services/imageService';

const DashboardContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
`;

const RecentSection = styled.div`
  background-color: white;
  border-radius: 5px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const RecentItemsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const RecentItem = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const ItemMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const DashboardPage = () => {
    const { data: projects, isLoading: projectsLoading } = useQuery(
        'adminProjects',
        () => fetchProjects()
    );
    const { data: categories, isLoading: categoriesLoading } = useQuery('adminCategories', fetchCategories);
    const { data: images, isLoading: imagesLoading } = useQuery('adminImages', fetchImages);

    const isLoading = projectsLoading || categoriesLoading || imagesLoading;

    return (
        <DashboardContainer>
            <PageTitle>대시보드</PageTitle>

            {isLoading ? (
                <p>로딩 중...</p>
            ) : (
                <>
                    <StatsGrid>
                        <StatCard>
                            <StatTitle>전체 프로젝트</StatTitle>
                            <StatValue>{projects?.length || 0}</StatValue>
                        </StatCard>

                        <StatCard>
                            <StatTitle>전체 카테고리</StatTitle>
                            <StatValue>{categories?.length || 0}</StatValue>
                        </StatCard>

                        <StatCard>
                            <StatTitle>전체 이미지</StatTitle>
                            <StatValue>{images?.length || 0}</StatValue>
                        </StatCard>

                        <StatCard>
                            <StatTitle>주요 프로젝트</StatTitle>
                            <StatValue>
                                {projects?.filter(p =>
                                    p.images?.some(img => img.isFeatured)
                                ).length || 0}
                            </StatValue>
                        </StatCard>
                    </StatsGrid>

                    <RecentSection>
                        <SectionTitle>최근 프로젝트</SectionTitle>
                        <RecentItemsList>
                            {projects?.slice(0, 5).map(project => (
                                <RecentItem key={project.id}>
                                    <ItemTitle>{project.title}</ItemTitle>
                                    <ItemMeta>
                                        {project.location} · {project.year} · {project.category?.name}
                                    </ItemMeta>
                                </RecentItem>
                            ))}
                            {(projects?.length || 0) === 0 && (
                                <RecentItem>
                                    <ItemTitle>등록된 프로젝트가 없습니다.</ItemTitle>
                                </RecentItem>
                            )}
                        </RecentItemsList>
                    </RecentSection>

                    <RecentSection>
                        <SectionTitle>최근 카테고리</SectionTitle>
                        <RecentItemsList>
                            {categories?.slice(0, 5).map(category => (
                                <RecentItem key={category.id}>
                                    <ItemTitle>{category.name}</ItemTitle>
                                    <ItemMeta>
                                        {category.description || '설명 없음'}
                                    </ItemMeta>
                                </RecentItem>
                            ))}
                            {(categories?.length || 0) === 0 && (
                                <RecentItem>
                                    <ItemTitle>등록된 카테고리가 없습니다.</ItemTitle>
                                </RecentItem>
                            )}
                        </RecentItemsList>
                    </RecentSection>
                </>
            )}
        </DashboardContainer>
    );
};

export default DashboardPage;