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
        const response = await axios.get(`${API_URL}/images?projectId=${projectId}`);

        // URL 형식을 확인 및 수정
        const images = response.data.map((image: {url: string}) => {
            let imageUrl = image.url;

            // URL이 상대 경로인 경우 전체 경로로 변환
            if (imageUrl && (imageUrl.startsWith('/uploads') || imageUrl.startsWith('uploads'))) {
                imageUrl = `http://localhost:3001${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                return { ...image, url: imageUrl };
            }

            return image;
        });

        console.log('Images with fixed URLs:', images);
        return images;
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

export const uploadFile = async (file: File): Promise<{ url: string }> => {
    try {
        console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

        const formData = new FormData();
        formData.append('file', file);

        console.log('FormData created, sending to backend...');

        // 백엔드의 /uploads/image 엔드포인트에 파일 업로드
        const response = await axios.post(`${API_URL}/uploads/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('Backend response:', response.data);

        // URL 수정: undefined가 포함되거나 상대 경로인 경우 수정
        let imageUrl = response.data.url;

        if (imageUrl) {
            if (imageUrl.startsWith('undefined')) {
                imageUrl = imageUrl.replace('undefined', 'http://localhost:3001');
            } else if (imageUrl.startsWith('/uploads')) {
                imageUrl = `http://localhost:3001${imageUrl}`;
            }
        }

        console.log('Final image URL:', imageUrl);
        return { url: imageUrl };
    } catch (error) {
        console.error('Error uploading file:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.response?.data, error.message);
        }
        throw error;
    }
};