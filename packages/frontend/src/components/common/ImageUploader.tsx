import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {uploadFile, uploadImage} from '../../services/imageService';

const UploaderContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const UploadArea = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${({ isDragging }) => (isDragging ? '#333' : '#ddd')};
  border-radius: 5px;
  padding: 2rem;
  text-align: center;
  background-color: ${({ isDragging }) => (isDragging ? '#f9f9f9' : 'transparent')};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #666;
`;

const UploadText = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const UploadButton = styled(motion.button)`
  background-color: #333;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: #444;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-top: 1.5rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.p`
  color: #d9534f;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.p`
  color: #5cb85c;
  margin-top: 0.5rem;
`;

interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        handleFiles(files);
    };

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const selectedFile = files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

        if (!validTypes.includes(selectedFile.type)) {
            setError('이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF)');
            setFile(null);
            setPreview(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
            setError('파일 크기는 5MB 이하여야 합니다.');
            setFile(null);
            setPreview(null);
            return;
        }

        setError(null);
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('업로드할 파일을 선택해주세요.');
            return;
        }

        try {
            setIsUploading(true);

            // uploadImage 대신 uploadFile 사용
            const result = await uploadFile(file);

            setSuccess('이미지가 성공적으로 업로드되었습니다.');
            onUploadSuccess(result.url);

            // 초기화
            setFile(null);
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError('이미지 업로드 중 오류가 발생했습니다.');
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <UploaderContainer>
            <UploadArea
                isDragging={isDragging}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
            >
                <UploadIcon>📁</UploadIcon>
                <UploadText>이미지를 드래그하거나 클릭하여 업로드하세요</UploadText>
                <UploadButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                >
                    파일 선택
                </UploadButton>
                <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </UploadArea>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {preview && (
                <PreviewContainer>
                    <p>미리보기:</p>
                    <PreviewImage src={preview} alt="Image preview" />

                    <UploadButton
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUpload}
                        style={{ marginTop: '1rem' }}
                        disabled={isUploading}
                    >
                        {isUploading ? '업로드 중...' : '업로드'}
                    </UploadButton>
                </PreviewContainer>
            )}
        </UploaderContainer>
    );
};

export default ImageUploader;