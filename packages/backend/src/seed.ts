import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppModule } from './app.module';
import { Category } from './modules/categories/category.entity';
import { Project } from './modules/projects/project.entity';
import { Image } from './modules/images/image.entity';
import { ProjectStatus } from '@architecture-firm/shared/dist/types/project';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 리포지토리 가져오기
  const categoryRepository = app.get<Repository<Category>>(
    getRepositoryToken(Category),
  );
  const projectRepository = app.get<Repository<Project>>(
    getRepositoryToken(Project),
  );
  const imageRepository = app.get<Repository<Image>>(getRepositoryToken(Image));

  // 기존 데이터 삭제
  await imageRepository.delete({});
  await projectRepository.delete({});
  await categoryRepository.delete({});

  console.log('기존 데이터 삭제 완료');

  // 카테고리 생성
  const categories = await categoryRepository.save([
    {
      name: '주거 건축',
      description: '주택, 아파트, 빌라 등 주거 목적의 건축물',
    },
    {
      name: '상업 건축',
      description: '상점, 사무실, 호텔 등 상업 목적의 건축물',
    },
    {
      name: '공공 건축',
      description: '학교, 병원, 문화시설 등 공공 목적의 건축물',
    },
    {
      name: '인테리어',
      description: '실내 공간 디자인 및 리모델링 프로젝트',
    },
  ]);

  console.log('카테고리 생성 완료');

  // 프로젝트 생성
  const projects = await projectRepository.save([
    {
      title: '서울 레지던스',
      description:
        '서울 강남에 위치한 모던 스타일의 주택입니다. 자연 채광을 최대한 활용한 디자인으로 쾌적한 주거 공간을 제공합니다.',
      location: '서울 강남구',
      client: '김고객',
      year: 2022,
      status: ProjectStatus.COMPLETED,
      category: categories[0], // 주거 건축
    },
    {
      title: '부산 오피스',
      description:
        '부산 해운대에 위치한 오피스 빌딩입니다. 현대적인 디자인과 효율적인 공간 배치로 업무 효율성을 높였습니다.',
      location: '부산 해운대구',
      client: '에이비씨 기업',
      year: 2021,
      status: ProjectStatus.COMPLETED,
      category: categories[1], // 상업 건축
    },
    {
      title: '인천 문화센터',
      description:
        '인천 송도에 위치한 공공 문화센터입니다. 다양한 문화 활동을 수용할 수 있는 유연한 공간으로 설계되었습니다.',
      location: '인천 송도',
      client: '인천시',
      year: 2023,
      status: ProjectStatus.COMPLETED,
      category: categories[2], // 공공 건축
    },
    {
      title: '제주 카페 인테리어',
      description:
        '제주의 자연환경을 모티브로 한 카페 인테리어 프로젝트입니다. 지역적 특색을 살린 디자인으로 편안한 휴식 공간을 제공합니다.',
      location: '제주 서귀포시',
      client: '커피하우스',
      year: 2022,
      status: ProjectStatus.COMPLETED,
      category: categories[3], // 인테리어
    },
    {
      title: '대전 아파트 단지',
      description:
        '대전에 위치한 친환경적 주거 단지입니다. 공용 시설과 녹지 공간을 적절히 배치하여 주민들의 삶의 질을 향상시켰습니다.',
      location: '대전 유성구',
      client: '건설주식회사',
      year: 2020,
      status: ProjectStatus.COMPLETED,
      category: categories[0], // 주거 건축
    },
    {
      title: '광주 쇼핑몰',
      description:
        '광주에 위치한 대형 쇼핑몰입니다. 동선 설계와 공간 배치를 최적화하여 쇼핑 경험을 향상시켰습니다.',
      location: '광주 서구',
      client: '리테일 그룹',
      year: 2021,
      status: ProjectStatus.COMPLETED,
      category: categories[1], // 상업 건축
    },
  ]);

  console.log('프로젝트 생성 완료');

  // 이미지 생성
  const images = await imageRepository.save([
    // 서울 레지던스 이미지
    {
      url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
      description: '서울 레지던스 외관',
      isFeatured: true,
      project: projects[0],
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
      description: '서울 레지던스 거실',
      isFeatured: false,
      project: projects[0],
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d',
      description: '서울 레지던스 침실',
      isFeatured: false,
      project: projects[0],
    },

    // 부산 오피스 이미지
    {
      url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
      description: '부산 오피스 외관',
      isFeatured: true,
      project: projects[1],
    },
    {
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174',
      description: '부산 오피스 내부',
      isFeatured: false,
      project: projects[1],
    },
    {
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      description: '부산 오피스 회의실',
      isFeatured: false,
      project: projects[1],
    },

    // 인천 문화센터 이미지
    {
      url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25',
      description: '인천 문화센터 외관',
      isFeatured: true,
      project: projects[2],
    },
    {
      url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
      description: '인천 문화센터 로비',
      isFeatured: false,
      project: projects[2],
    },
    {
      url: 'https://images.unsplash.com/photo-1527264935190-1401c51b5bbc',
      description: '인천 문화센터 공연장',
      isFeatured: false,
      project: projects[2],
    },

    // 제주 카페 인테리어 이미지
    {
      url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
      description: '제주 카페 전경',
      isFeatured: true,
      project: projects[3],
    },
    {
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
      description: '제주 카페 내부',
      isFeatured: false,
      project: projects[3],
    },
    {
      url: 'https://images.unsplash.com/photo-1539183204366-63a0589187ab',
      description: '제주 카페 좌석 공간',
      isFeatured: false,
      project: projects[3],
    },

    // 대전 아파트 단지 이미지
    {
      url: 'https://images.unsplash.com/photo-1460317442991-0ec209397118',
      description: '대전 아파트 단지 전경',
      isFeatured: true,
      project: projects[4],
    },
    {
      url: 'https://images.unsplash.com/photo-1556912998-c57cc6b63cd7',
      description: '대전 아파트 단지 조경',
      isFeatured: false,
      project: projects[4],
    },
    {
      url: 'https://images.unsplash.com/photo-1524061662917-3f9536b7ed2c',
      description: '대전 아파트 내부',
      isFeatured: false,
      project: projects[4],
    },

    // 광주 쇼핑몰 이미지
    {
      url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce9',
      description: '광주 쇼핑몰 전경',
      isFeatured: true,
      project: projects[5],
    },
    {
      url: 'https://images.unsplash.com/photo-1582889683042-4f881b97b0bf',
      description: '광주 쇼핑몰 내부',
      isFeatured: false,
      project: projects[5],
    },
    {
      url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a',
      description: '광주 쇼핑몰 식당가',
      isFeatured: false,
      project: projects[5],
    },
  ]);

  console.log('이미지 생성 완료');

  await app.close();
  console.log('데이터베이스 시드 완료');
}

bootstrap();
