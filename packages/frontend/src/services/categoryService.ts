import api from './api';

export interface Category {
    id: number;
    name: string;
    description: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
};

export const fetchCategoryById = async (id: number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
};

export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
};

export const updateCategory = async (
    id: number,
    categoryData: Partial<Category>
): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
};