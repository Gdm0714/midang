import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const AboutContainer = styled.div`
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

const Section = styled.section`
  margin-bottom: 5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #333;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const AboutImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const AboutText = styled.div``;

const Paragraph = styled.p`
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: #333;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const TeamMember = styled(motion.div)`
  background-color: white;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const MemberImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const MemberInfo = styled.div`
  padding: 1.5rem;
`;

const MemberName = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const MemberTitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const MemberBio = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
`;

const TimelineContainer = styled.div`
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    width: 2px;
    background-color: #ddd;
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  padding-left: 60px;
  margin-bottom: 3rem;

  &:before {
    content: "";
    position: absolute;
    left: 10px;
    top: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #333;
  }
`;

const TimelineYear = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TimelineTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const TimelineDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #666;
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const ValueCard = styled(motion.div)`
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #eee;
    transform: translateY(-5px);
  }
`;

const ValueIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;

const ValueDescription = styled.p`
  font-size: 0.9rem;
  line-height: 1.6;
  color: #666;
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <PageTitle>소개</PageTitle>
      <PageDescription>
        건축소사무소의 철학, 팀원, 그리고 역사를 소개합니다.
      </PageDescription>

      <Section>
        <SectionTitle>회사 소개</SectionTitle>
        <AboutContent>
          <AboutImage
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
            alt="About Us"
          />
          <AboutText>
            <Paragraph>
              2010년 설립된 건축소사무소는 혁신적인 디자인과 친환경적인 접근
              방식으로 다양한 건축 프로젝트를 성공적으로 수행해왔습니다. 우리는
              공간이 인간의 삶에 미치는 영향력을 깊이 이해하고, 각 프로젝트가
              고객의 필요와 가치를 반영할 수 있도록 최선을 다합니다.
            </Paragraph>
            <Paragraph>
              건축소사무소의 디자인 철학은 기능성과 미학의 조화, 그리고 지속
              가능한 건축에 중점을 두고 있습니다. 우리는 매 프로젝트를 통해
              공간의 새로운 가능성을 모색하고, 사용자의 경험을 향상시키는
              솔루션을 제공합니다.
            </Paragraph>
            <Paragraph>
              빠르게 변화하는 현대 사회에서, 건축소사무소는 혁신적인 기술과
              디자인 접근 방식을 통해 미래지향적인 건축 솔루션을 창출하고자
              합니다. 우리는 지역 사회와 환경에 긍정적인 영향을 미치는 지속
              가능한 건축을 추구합니다.
            </Paragraph>
          </AboutText>
        </AboutContent>
      </Section>

      <Section>
        <SectionTitle>팀원 소개</SectionTitle>
        <TeamGrid>
          <TeamMember
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemberImage
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a"
              alt="김건축"
            />
            <MemberInfo>
              <MemberName>김건축</MemberName>
              <MemberTitle>대표 건축가</MemberTitle>
              <MemberBio>
                서울대학교 건축학과를 졸업하고 해외 유수 건축사무소에서 10년간
                경력을 쌓은 후, 2010년 건축소사무소를 설립하였습니다. 혁신적인
                디자인 접근법으로 다수의 상을 수상하였습니다.
              </MemberBio>
            </MemberInfo>
          </TeamMember>
          <TeamMember
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MemberImage
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
              alt="이공간"
            />
            <MemberInfo>
              <MemberName>이공간</MemberName>
              <MemberTitle>선임 건축가</MemberTitle>
              <MemberBio>
                홍익대학교 건축학과를 졸업하고 환경 친화적인 건축 디자인에
                특화된 전문가입니다. 지속 가능한 건축 솔루션을 개발하는 데
                주력하고 있습니다.
              </MemberBio>
            </MemberInfo>
          </TeamMember>
          <TeamMember
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MemberImage
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956"
              alt="박디자인"
            />
            <MemberInfo>
              <MemberName>박디자인</MemberName>
              <MemberTitle>인테리어 디자이너</MemberTitle>
              <MemberBio>
                국민대학교 실내디자인학과를 졸업하고 다양한 상업 및 주거 공간
                디자인 프로젝트에 참여해왔습니다. 사용자 경험에 초점을 맞춘
                독창적인 인테리어 솔루션을 제공합니다.
              </MemberBio>
            </MemberInfo>
          </TeamMember>
          <TeamMember
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MemberImage
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
              alt="최구조"
            />
            <MemberInfo>
              <MemberName>최구조</MemberName>
              <MemberTitle>구조 엔지니어</MemberTitle>
              <MemberBio>
                한양대학교 건축공학과를 졸업하고 구조 엔지니어링 분야에서
                전문성을 쌓았습니다. 혁신적인 건축 디자인의 안전성과 실현
                가능성을 보장하는 역할을 담당합니다.
              </MemberBio>
            </MemberInfo>
          </TeamMember>
        </TeamGrid>
      </Section>

      <Section>
        <SectionTitle>연혁</SectionTitle>
        <TimelineContainer>
          <TimelineItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TimelineYear>2010</TimelineYear>
            <TimelineTitle>건축소사무소 설립</TimelineTitle>
            <TimelineDescription>
              김건축 대표가 서울 강남구에 건축소사무소를 설립하였습니다. 소규모
              주거 및 상업 공간 디자인 프로젝트로 시작하였습니다.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TimelineYear>2013</TimelineYear>
            <TimelineTitle>첫 공공 프로젝트 수주</TimelineTitle>
            <TimelineDescription>
              지역 문화센터 설계 프로젝트를 통해 공공 건축 분야로 영역을
              확장하였습니다. 이 프로젝트는 지역 사회에 긍정적인 영향을 미친
              혁신적인 디자인으로 인정받았습니다.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TimelineYear>2016</TimelineYear>
            <TimelineTitle>국제 건축상 수상</TimelineTitle>
            <TimelineDescription>
              친환경 주거 단지 프로젝트로 국제 건축상을 수상하며 글로벌 인지도를
              높였습니다. 지속 가능한 건축 디자인에 대한 회사의 철학과 접근
              방식이 인정받는 계기가 되었습니다.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TimelineYear>2019</TimelineYear>
            <TimelineTitle>서울 오피스 확장</TimelineTitle>
            <TimelineDescription>
              성장하는 프로젝트 수요에 맞춰 서울 오피스를 확장하고 새로운
              팀원들을 영입하였습니다. 인테리어 디자인 및 구조 엔지니어링 부서를
              강화하여 종합적인 건축 서비스를 제공하게 되었습니다.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TimelineYear>2022</TimelineYear>
            <TimelineTitle>지속 가능한 건축 연구소 설립</TimelineTitle>
            <TimelineDescription>
              친환경 건축 솔루션 연구 및 개발을 위한 연구소를 설립하였습니다.
              기후 변화 대응 및 에너지 효율성 향상을 위한 혁신적인 건축 기술
              개발에 투자하고 있습니다.
            </TimelineDescription>
          </TimelineItem>
        </TimelineContainer>
      </Section>

      <Section>
        <SectionTitle>핵심 가치</SectionTitle>
        <ValueGrid>
          <ValueCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ValueIcon>🌱</ValueIcon>
            <ValueTitle>지속 가능성</ValueTitle>
            <ValueDescription>
              환경에 미치는 영향을 최소화하고 자원을 효율적으로 활용하는 지속
              가능한 건축 솔루션을 개발합니다. 친환경 자재 사용과 에너지 효율성
              향상을 통해 미래 세대를 위한 건축을 추구합니다.
            </ValueDescription>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ValueIcon>✨</ValueIcon>
            <ValueTitle>혁신</ValueTitle>
            <ValueDescription>
              전통적인 접근 방식을 넘어 새로운 가능성을 모색합니다. 최신 기술과
              디자인 트렌드를 활용하여 기존의 한계를 뛰어넘는 독창적인 건축
              솔루션을 제시합니다.
            </ValueDescription>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ValueIcon>👥</ValueIcon>
            <ValueTitle>사용자 중심</ValueTitle>
            <ValueDescription>
              건축물을 사용하는 사람들의 경험과 요구사항을 최우선으로
              고려합니다. 기능적이면서도 편안하고 영감을 주는 공간을 통해
              사용자의 삶의 질을 향상시킵니다.
            </ValueDescription>
          </ValueCard>

          <ValueCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ValueIcon>🤝</ValueIcon>
            <ValueTitle>협력</ValueTitle>
            <ValueDescription>
              클라이언트, 엔지니어, 시공사 등 다양한 이해관계자들과의 긴밀한
              협력을 통해 모든 요구사항을 충족시키는 최적의 솔루션을 개발합니다.
              열린 소통과 팀워크를 통해 프로젝트의 성공을 보장합니다.
            </ValueDescription>
          </ValueCard>
        </ValueGrid>
      </Section>
    </AboutContainer>
  );
};

export default AboutPage;
