// imageService.ts 수정
import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // 서버 API URL을 확인하세요

export const fetchImages = async () => {
    try {
        const response = await axios.get(`${API_URL}/images`);
        return response.data;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};

export const fetchImagesByProject = async (projectId: number) => {
    try {
        // 백엔드에서는 ?projectId= 쿼리 파라미터를 사용합니다
        const response = await axios.get(`${API_URL}/images?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching images by project:', error);
        throw error;
    }
};

export const uploadImage = async (data: {
    url: string;
    description?: string;
    isFeatured?: boolean;
    projectId: number;
}) => {
    try {
        // CREATE 엔드포인트는 /images
        const response = await axios.post(`${API_URL}/images`, data);
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const updateImage = async (id: number, data: any) => {
    try {
        // UPDATE 엔드포인트는 /images/:id
        const response = await axios.put(`${API_URL}/images/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating image:', error);
        throw error;
    }
};

export const deleteImage = async (id: number) => {
    try {
        // DELETE 엔드포인트는 /images/:id
        const response = await axios.delete(`${API_URL}/images/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
};

export const setFeaturedImage = async (id: number, isFeatured: boolean) => {
    try {
        // 특화된 엔드포인트가 있습니다
        const response = await axios.put(`${API_URL}/images/${id}/featured`, { isFeatured });
        return response.data;
    } catch (error) {
        console.error('Error setting featured image:', error);
        throw error;
    }
};

// imageService.ts에 추가
export const uploadFile = async (file: File): Promise<{ url: string }> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // 백엔드의 /uploads/image 엔드포인트에 파일 업로드
        const response = await axios.post(`${API_URL}/uploads/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data; // { url: string } 형태로 반환됨
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};