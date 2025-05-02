import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const PageDescription = styled.p`
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
`;

const ContactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #333;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SuccessMessage = styled(motion.div)`
  font-size: 1rem;
  color: green;
  margin-top: 1rem;
`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    setIsSubmitted(true);

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
      <ContactContainer>
        <PageTitle>연락처</PageTitle>
        <PageDescription>미당건축사사무소에 문의하거나 방문하실 수 있는 방법을 안내합니다.</PageDescription>

        <ContactContent>
          <ContactInfo>
            <InfoItem>
              <InfoTitle>주소</InfoTitle>
              <InfoText>경남 창원시 성산구 비음로 4번길 37-4</InfoText>
              <InfoText>서윤빌딩 2층</InfoText>
            </InfoItem>

            <InfoItem>
              <InfoTitle>연락처</InfoTitle>
              <InfoText>전화: 010-8551-6600</InfoText>
              <InfoText>이메일: midang21@daum.net</InfoText>
            </InfoItem>

            <InfoItem>
              <InfoTitle>운영 시간</InfoTitle>
              <InfoText>월요일 - 금요일: 오전 9시 - 오후 6시</InfoText>
              <InfoText>토요일, 일요일, 공휴일: 휴무</InfoText>
            </InfoItem>

            <MapContainer>
              지도가 표시될 영역입니다.
            </MapContainer>
          </ContactInfo>

          <ContactForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="name">이름</FormLabel>
              <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="email">이메일</FormLabel>
              <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="subject">제목</FormLabel>
              <FormInput
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="message">메시지</FormLabel>
              <FormTextarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
              />
            </FormGroup>

            <SubmitButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
              메시지 보내기
            </SubmitButton>

            {isSubmitted && (
                <SuccessMessage
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                  메시지가 성공적으로 전송되었습니다. 곧 연락드리겠습니다.
                </SuccessMessage>
            )}
          </ContactForm>
        </ContactContent>
      </ContactContainer>
  );
};

export default ContactPage;