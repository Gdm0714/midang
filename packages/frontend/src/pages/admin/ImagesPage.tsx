import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    fetchImagesByProject,
    uploadImage,
    updateImage,
    deleteImage,
    setFeaturedImage
} from '../../services/imageService';
import { useParams } from 'react-router-dom';
import { fetchProjectById } from '../../services/api';
import ImageUploader from '../../components/common/ImageUploader';
import axios from "axios";

const ImagesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const BackLink = styled.a`
  display: inline-block;
  margin-bottom: 1rem;
  color: #3498db;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ProjectInfo = styled.div`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #333;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ImageCard = styled.div`
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

const ImagePreview = styled.div<{ src: string }>`
    height: 180px;
    background-size: cover;
    background-position: center;
    background-image: url(${({ src }) => src});
`;

const ImageInfo = styled.div`
  padding: 1rem;
`;

const ImageActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const ImageAction = styled(motion.button)`
  background-color: ${({ color }) => color || '#333'};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 3px;
  cursor: pointer;
  
  &:hover {
    filter: brightness(1.1);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(52, 152, 219, 0.8);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f5f5f5;
  border-radius: 5px;
  margin-bottom: 3rem;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ddd;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
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
  max-width: 500px;
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
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

type Image = {
    id: number;
    url: string;
    description: string;
    isFeatured: boolean;
};

const ImagesPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [formData, setFormData] = useState({
        description: '',
        isFeatured: false
    });

    const { data: project, isLoading: projectLoading } = useQuery(
        ['project', id],
        () => fetchProjectById(parseInt(id || '0')),
        { enabled: !!id }
    );


    const { data: images, isLoading: imagesLoading } = useQuery<Image[]>(
        ['projectImages', id],
        () => fetchImagesByProject(parseInt(id || '0')),
        { enabled: !!id }
    );

    const updateImageMutation = useMutation(
        ({ id, data }: { id: number; data: { description: string; isFeatured: boolean } }) =>
            updateImage(id, data),
        { onSuccess: () => { queryClient.invalidateQueries(['projectImages', id]); setIsEditModalOpen(false); } }
    );

    const deleteImageMutation = useMutation(deleteImage, {
        onSuccess: () => {
            queryClient.invalidateQueries(['projectImages', id]);
            setIsDeleteModalOpen(false);
        }
    });

    const setFeaturedMutation = useMutation(
        ({ id, isFeatured }: { id: number; isFeatured: boolean }) =>
            setFeaturedImage(id, isFeatured),
        { onSuccess: () => { queryClient.invalidateQueries(['projectImages', id]); } }
    );

    const handleOpenEditModal = (image: Image) => {
        setSelectedImage(image);
        setFormData({
            description: image.description || '',
            isFeatured: image.isFeatured
        });
        setIsEditModalOpen(true);
    };

    const handleOpenDeleteModal = (image: Image) => {
        setSelectedImage(image);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const { name, value, type } = target;
        const checked = (target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdateImage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedImage) {
            updateImageMutation.mutate({
                id: selectedImage.id,
                data: {
                    description: formData.description,
                    isFeatured: formData.isFeatured
                }
            });
        }
    };

    const handleDeleteImage = () => {
        if (selectedImage) {
            deleteImageMutation.mutate(selectedImage.id);
        }
    };

    const handleToggleFeatured = (image: Image) => {
        setFeaturedMutation.mutate({
            id: image.id,
            isFeatured: !image.isFeatured
        });
    };

    const handleImageUpload = async (url: string) => {
        try {
            console.log('Image uploaded successfully, URL:', url);

            // 프로젝트 ID가 유효한지 확인
            if (!id || isNaN(parseInt(id))) {
                alert('유효하지 않은 프로젝트 ID입니다.');
                return;
            }

            const projectId = parseInt(id);

            // 이미지 메타데이터 생성 (URL + 프로젝트 ID)
            const newImageData = {
                url,
                description: '',
                isFeatured: false,
                projectId
            };

            // API 호출하여 이미지 정보 저장
            await uploadImage(newImageData);

            // 이미지 목록 갱신
            queryClient.invalidateQueries(['projectImages', id]);
        } catch (error) {
            console.error('Error saving image metadata:', error);
            alert('이미지 정보 저장 중 오류가 발생했습니다.');
        }
    };


    const isLoading = projectLoading || imagesLoading;

    if (isLoading) {
        return <p>로딩 중...</p>;
    }

    if (!project) {
        return <p>프로젝트를 찾을 수 없습니다.</p>;
    }

    return (
        <ImagesContainer>
            <PageHeader>
                <BackLink href="/admin/projects">&larr; 프로젝트 목록으로 돌아가기</BackLink>
                <PageTitle>프로젝트 이미지 관리</PageTitle>
                <ProjectInfo>
                    {project.title} ({project.location}, {project.year})
                </ProjectInfo>
            </PageHeader>

            <SectionTitle>새 이미지 업로드</SectionTitle>
            <ImageUploader onUploadSuccess={handleImageUpload} />

            <SectionTitle>프로젝트 이미지</SectionTitle>
            {images && images.length > 0 ? (
                <ImageGrid>
                    {images.map(image => (
                        <ImageCard key={image.id}>
                            {image.isFeatured && <FeaturedBadge>대표 이미지</FeaturedBadge>}
                            <ImagePreview src={image.url} />
                            <ImageInfo>
                                <p>{image.description || '설명 없음'}</p>
                                <ImageActionBar>
                                    <ImageAction
                                        color="#3498db"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleOpenEditModal(image)}
                                    >
                                        ✏️ 수정
                                    </ImageAction>
                                    <ImageAction
                                        color={image.isFeatured ? '#e67e22' : '#27ae60'}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleToggleFeatured(image)}
                                    >
                                        {image.isFeatured ? '⭐ 해제' : '⭐ 대표'}
                                    </ImageAction>
                                    <ImageAction
                                        color="#e74c3c"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleOpenDeleteModal(image)}
                                    >
                                        🗑️ 삭제
                                    </ImageAction>
                                </ImageActionBar>
                            </ImageInfo>
                        </ImageCard>
                    ))}
                </ImageGrid>
            ) : (
                <EmptyState>
                    <EmptyStateIcon>🖼️</EmptyStateIcon>
                    <EmptyStateText>아직 등록된 이미지가 없습니다.</EmptyStateText>
                </EmptyState>
            )}

            {isEditModalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <ModalTitle>이미지 정보 수정</ModalTitle>

                        <form onSubmit={handleUpdateImage}>
                            <FormGroup>
                                <FormLabel htmlFor="description">이미지 설명</FormLabel>
                                <FormTextarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="이미지에 대한 설명을 입력하세요"
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                    />
                                    {' '}대표 이미지로 설정
                                </label>
                            </FormGroup>

                            <ModalActions>
                                <CancelButton
                                    type="button"
                                    onClick={handleCloseModal}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    취소
                                </CancelButton>
                                <SaveButton
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={updateImageMutation.isLoading}
                                >
                                    {updateImageMutation.isLoading ? '저장 중...' : '저장'}
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
                        <ModalTitle>이미지 삭제</ModalTitle>
                        <p>정말 이 이미지를 삭제하시겠습니까?</p>
                        <p>이 작업은 되돌릴 수 없습니다.</p>

                        <ModalActions>
                            <CancelButton
                                type="button"
                                onClick={handleCloseModal}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                취소
                            </CancelButton>
                            <SaveButton
                                type="button"
                                onClick={handleDeleteImage}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ backgroundColor: '#e74c3c' }}
                                disabled={deleteImageMutation.isLoading}
                            >
                                {deleteImageMutation.isLoading ? '삭제 중...' : '삭제'}
                            </SaveButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </ImagesContainer>
    );
};

export default ImagesPage;