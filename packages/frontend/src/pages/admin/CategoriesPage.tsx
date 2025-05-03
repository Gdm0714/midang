import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../services/categoryService';

const CategoriesContainer = styled.div`
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

const CategoriesTable = styled.table`
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
  background-color: ${({ color }) => color || '#333'};
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

const CategoriesPage = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const { data: categories, isLoading } = useQuery('adminCategories', fetchCategories);

    const createMutation = useMutation(createCategory, {
        onSuccess: () => {
            queryClient.invalidateQueries('adminCategories');
            setIsModalOpen(false);
        }
    });

    const updateMutation = useMutation(
        ({ id, data }) => updateCategory(id, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('adminCategories');
                setIsModalOpen(false);
            }
        }
    );

    const deleteMutation = useMutation(deleteCategory, {
        onSuccess: () => {
            queryClient.invalidateQueries('adminCategories');
            setIsDeleteModalOpen(false);
        }
    });

    const handleOpenAddModal = () => {
        setSelectedCategory(null);
        setFormData({ name: '', description: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setIsModalOpen(true);
    };

    const handleOpenDeleteModal = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsDeleteModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('카테고리 이름을 입력해주세요.');
            return;
        }

        if (selectedCategory) {
            updateMutation.mutate({
                id: selectedCategory.id,
                data: formData
            });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = () => {
        if (selectedCategory) {
            deleteMutation.mutate(selectedCategory.id);
        }
    };

    return (
        <CategoriesContainer>
            <PageTitle>카테고리 관리</PageTitle>

            <ActionBar>
                <AddButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenAddModal}
                >
                    + 카테고리 추가
                </AddButton>
            </ActionBar>

            {isLoading ? (
                <p>로딩 중...</p>
            ) : (
                <CategoriesTable>
                    <TableHead>
                        <TableRow>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>이름</TableHeader>
                            <TableHeader>설명</TableHeader>
                            <TableHeader>작업</TableHeader>
                        </TableRow>
                    </TableHead>
                    <tbody>
                    {categories?.map(category => (
                        <TableRow key={category.id}>
                            <TableCell>{category.id}</TableCell>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.description || '-'}</TableCell>
                            <TableCell>
                                <ActionButton
                                    color="#3498db"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleOpenEditModal(category)}
                                >
                                    ✏️
                                </ActionButton>
                                <ActionButton
                                    color="#e74c3c"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleOpenDeleteModal(category)}
                                >
                                    🗑️
                                </ActionButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {(categories?.length || 0) === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                등록된 카테고리가 없습니다.
                            </TableCell>
                        </TableRow>
                    )}
                    </tbody>
                </CategoriesTable>
            )}

            {isModalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <ModalTitle>
                            {selectedCategory ? '카테고리 수정' : '카테고리 추가'}
                        </ModalTitle>

                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                <FormLabel htmlFor="name">카테고리 이름</FormLabel>
                                <FormInput
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel htmlFor="description">설명 (선택사항)</FormLabel>
                                <FormTextarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
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
                        <ModalTitle>카테고리 삭제</ModalTitle>
                        <p>정말 "{selectedCategory?.name}" 카테고리를 삭제하시겠습니까?</p>
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
                                onClick={handleDelete}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ backgroundColor: '#e74c3c' }}
                                disabled={deleteMutation.isLoading}
                            >
                                {deleteMutation.isLoading ? '삭제 중...' : '삭제'}
                            </SaveButton>
                        </ModalActions>
                    </ModalContent>
                </ModalOverlay>
            )}
        </CategoriesContainer>
    );
};

export default CategoriesPage;