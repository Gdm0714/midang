import React, {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {motion} from 'framer-motion';
import {
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../../services/api';
import {fetchCategories} from '../../services/categoryService';
import {ProjectStatus, Project} from '@architecture-firm/shared/dist/types/project.js';

type ProjectImage = {
    id: number;
    url: string;
    description?: string;
    isFeatured: boolean;
};

const ProjectsContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const PageTitle = styled.h1`
    font-size: 2rem;
    margin-bottom: 2rem;
`;

const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const AddButton = styled(motion.button)`
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 3px;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        background-color: #45a049;
    }
`;

const ProjectsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const TableHead = styled.thead`
    background-color: #f5f5f5;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }
`;

const TableHeader = styled.th`
    padding: 1rem;
    text-align: left;
`;

const TableCell = styled.td`
    padding: 1rem;
`;

const ActionButton = styled(motion.button)`
    background-color: ${({color}) => color || '#333'};
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 3px;
    cursor: pointer;
    margin-right: 0.5rem;

    &:hover {
        filter: brightness(1.1);
    }
`;

const StatusBadge = styled.span<{ status: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
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
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
`;

const ModalContent = styled(motion.div)`
    background-color: white;
    border-radius: 5px;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 2rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #333;
    }
`;

const FormSelect = styled.select`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 1rem;
    background-color: white;

    &:focus {
        outline: none;
        border-color: #333;
    }
`;

const FormTextarea = styled.textarea`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 3px;
    font-size: 1rem;
    resize: vertical;
    min-height: 150px;

    &:focus {
        outline: none;
        border-color: #333;
    }
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
`;

const CancelButton = styled(motion.button)`
    background-color: #f5f5f5;
    color: #333;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 3px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #eee;
    }
`;

const SaveButton = styled(motion.button)`
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 3px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #45a049;
    }
`;

const FormRow = styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const FormColumn = styled.div`
    flex: 1;
`;

const ProjectsPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        location: string;
        client: string;
        year: number | string;
        status: string; // string으로 변경
        categoryId: string;
        images: ProjectImage[];
    }>({
        title: '',
        description: '',
        location: '',
        client: '',
        year: new Date().getFullYear(),
        status: ProjectStatus.PLANNING, // 값은 그대로 유지
        categoryId: '',
        images: []
    });


    const { data: projects, isLoading } = useQuery(
        'adminProjects',
        () => fetchProjects()
    );
    const {data: categories} = useQuery('adminCategories', fetchCategories);

    const createMutation = useMutation(createProject, {
        onSuccess: () => {
            queryClient.invalidateQueries('adminProjects');
            setIsModalOpen(false);
        }
    });

    const updateMutation = useMutation(
        ({ id, data }: { id: number; data: Omit<Project, 'id'> }) => updateProject(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('adminProjects');
                setIsModalOpen(false);
            }
        }
    );

    const deleteMutation = useMutation(deleteProject, {
        onSuccess: () => {
            queryClient.invalidateQueries('adminProjects');
            setIsDeleteModalOpen(false);
        }
    });

    const handleOpenAddModal = () => {
        setSelectedProject(null);
        setFormData({
            title: '',
            description: '',
            location: '',
            client: '',
            year: new Date().getFullYear(),
            status: ProjectStatus.PLANNING,
            categoryId: categories && categories.length > 0 ? String(categories[0].id) : '',
            images: [] // 빈 이미지 배열 추가
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = async (projectId: number) => {
        try {
            const project = await fetchProjectById(projectId);
            console.log('Project data:', project);

            setSelectedProject(project as any); // 타입 문제 회피를 위해 any 사용

            setFormData({
                title: project.title || '',  // undefined 방지를 위한 기본값 추가
                description: project.description || '',
                location: project.location || '',
                client: project.client || '',
                year: project.year || new Date().getFullYear(),
                status: project.status || ProjectStatus.PLANNING,
                categoryId: project.category ? String(project.category.id) : '',
                images: (project.images || []) as any[] // 타입 문제 회피
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('프로젝트 정보를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const handleOpenDeleteModal = async (projectId: number) => {
        try {
            const project = await fetchProjectById(projectId);
            setSelectedProject(project as Project);
            setIsDeleteModalOpen(true);
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('프로젝트 정보를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('프로젝트 제목을 입력해주세요.');
            return;
        }

        const submitData = {
            ...formData,
            year: parseInt(formData.year.toString(), 10),
            categoryId: parseInt(formData.categoryId, 10),
            images: formData.images,
            // 누락된 필드 추가 (존재하지 않는 경우)
            url: (selectedProject as any)?.url || '',
            isFeatured: (selectedProject as any)?.isFeatured || false
        };

        if (selectedProject) {
            updateMutation.mutate({
                id: selectedProject.id,
                data: submitData as any // 타입 문제 회피
            });
        } else {
            createMutation.mutate(submitData as any); // 타입 문제 회피
        }
    };


    const handleDelete = () => {
        if (selectedProject) {
            deleteMutation.mutate(selectedProject.id);
        }
    };

    const getStatusText = (status: string) => { // 매개변수 타입을 string으로 변경
        switch (status) {
            case ProjectStatus.PLANNING:
                return '계획 중';
            case ProjectStatus.IN_PROGRESS:
                return '진행 중';
            case ProjectStatus.COMPLETED:
                return '완료';
            default:
                return status;
        }
    };

    return (
        <ProjectsContainer>
            <PageTitle>프로젝트 관리</PageTitle>

            <ActionBar>
                <AddButton
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={handleOpenAddModal}
                >
                    + 프로젝트 추가
                </AddButton>
            </ActionBar>

            {isLoading ? (
                <p>로딩 중...</p>
            ) : (
                <ProjectsTable>
                    <TableHead>
                        <TableRow>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>제목</TableHeader>
                            <TableHeader>위치</TableHeader>
                            <TableHeader>연도</TableHeader>
                            <TableHeader>카테고리</TableHeader>
                            <TableHeader>상태</TableHeader>
                            <TableHeader>작업</TableHeader>
                        </TableRow>
                    </TableHead>
                    <tbody>
                    {projects?.map(project => (
                        <TableRow key={project.id}>
                            <TableCell>{project.id}</TableCell>
                            <TableCell>
                                <Link to={`/projects/${project.id}`} target="_blank" rel="noopener noreferrer">
                                    {project.title}
                                </Link>
                            </TableCell>
                            <TableCell>{project.location}</TableCell>
                            <TableCell>{project.year}</TableCell>
                            <TableCell>{project.category?.name || '-'}</TableCell>
                            <TableCell>
                                <StatusBadge status={project.status}>
                                    {getStatusText(project.status)}
                                </StatusBadge>
                            </TableCell>
                            <TableCell>
                                <ActionButton
                                    color="#3498db"
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    onClick={() => handleOpenEditModal(project.id)}
                                >
                                    ✏️
                                </ActionButton>
                                <ActionButton
                                    color="#e74c3c"
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    onClick={() => handleOpenDeleteModal(project.id)}
                                >
                                    🗑️
                                </ActionButton>
                                <ActionButton
                                    color="#9b59b6"
                                    whileHover={{scale: 1.1}}
                                    whileTap={{scale: 0.9}}
                                    as={Link}
                                    to={`/admin/projects/${project.id}/images`}
                                >
                                    🖼️
                                </ActionButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {(projects?.length || 0) === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} style={{textAlign: 'center'}}>
                                등록된 프로젝트가 없습니다.
                            </TableCell>
                        </TableRow>
                    )}
                    </tbody>
                </ProjectsTable>
            )}

            {/* 나머지 모달 코드... */}
            {isModalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <ModalTitle>
                            {selectedProject ? '프로젝트 수정' : '프로젝트 추가'}
                        </ModalTitle>

                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                <FormLabel htmlFor="title">프로젝트 제목</FormLabel>
                                <FormInput
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>

                            <FormRow>
                                <FormColumn>
                                    <FormGroup>
                                        <FormLabel htmlFor="location">위치</FormLabel>
                                        <FormInput
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>
                                </FormColumn>

                                <FormColumn>
                                    <FormGroup>
                                        <FormLabel htmlFor="client">클라이언트</FormLabel>
                                        <FormInput
                                            type="text"
                                            id="client"
                                            name="client"
                                            value={formData.client}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FormGroup>
                                </FormColumn>
                            </FormRow>

                            <FormRow>
                                <FormColumn>
                                    <FormGroup>
                                        <FormLabel htmlFor="year">연도</FormLabel>
                                        <FormInput
                                            type="number"
                                            id="year"
                                            name="year"
                                            value={String(formData.year)}
                                            onChange={handleInputChange}
                                            min="1900"
                                            max="2100"
                                            required
                                        />
                                    </FormGroup>
                                </FormColumn>

                                <FormColumn>
                                    <FormGroup>
                                        <FormLabel htmlFor="status">상태</FormLabel>
                                        <FormSelect
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value={ProjectStatus.PLANNING}>계획 중</option>
                                            <option value={ProjectStatus.IN_PROGRESS}>진행 중</option>
                                            <option value={ProjectStatus.COMPLETED}>완료</option>
                                        </FormSelect>
                                    </FormGroup>
                                </FormColumn>
                            </FormRow>

                            <FormGroup>
                                <FormLabel htmlFor="categoryId">카테고리</FormLabel>
                                <FormSelect
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">카테고리 선택</option>
                                    {categories?.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </FormSelect>
                            </FormGroup>

                            <FormGroup>
                                <FormLabel htmlFor="description">설명</FormLabel>
                                <FormTextarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>

                            <ModalActions>
                                <CancelButton
                                    type="button"
                                    onClick={handleCloseModal}
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    취소
                                </CancelButton>
                                <SaveButton
                                    type="submit"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                    disabled={createMutation.isLoading || updateMutation.isLoading}
                                >
                                    {createMutation.isLoading || updateMutation.isLoading
                                        ? '저장 중...'
                                        : '저장'}
                                </SaveButton>
                            </ModalActions>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {isDeleteModalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <ModalTitle>프로젝트 삭제</ModalTitle>
                        <p>정말 "{selectedProject?.title}" 프로젝트를 삭제하시겠습니까?</p>
                        <p>이 작업은 되돌릴 수 없으며, 관련된 모든 이미지도 함께 삭제됩니다.</p>

                        <ModalActions>
                            <CancelButton
                                type="button"
                                onClick={handleCloseModal}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                취소
                            </CancelButton>
                            <SaveButton
                                type="button"
                                onClick={handleDelete}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                style={{backgroundColor: '#e74c3c'}}
                                disabled={deleteMutation.isLoading}
                            >
                                {deleteMutation.isLoading ? '삭제 중...' : '삭제'}
                            </SaveButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}

        </ProjectsContainer>
    );
};

export default ProjectsPage;