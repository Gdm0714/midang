import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Image } from '../images/image.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectRepository.create({
      ...createProjectDto,
      category: { id: createProjectDto.categoryId },
    });
    return this.projectRepository.save(project);
  }

  async findAll(categoryId?: number) {
    if (categoryId) {
      return this.projectRepository.find({
        where: { category: { id: categoryId } },
        relations: ['category', 'images'],
      });
    }
    return this.projectRepository.find({
      relations: ['category', 'images'],
    });
  }

  async findFeatured() {
    return this.projectRepository.find({
      relations: ['category', 'images'],
      where: {
        images: {
          isFeatured: true,
        },
      },
      take: 6,
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['category', 'images'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);
    return this.projectRepository.save({ ...project, ...updateProjectDto });
  }

  async remove(id: number) {
    const project = await this.findOne(id);

    // 먼저 프로젝트와 연결된 모든 이미지 찾기
    const images = await this.imageRepository.find({
      where: { project: { id } },
    });

    // 이미지가 있으면 먼저 삭제
    if (images.length > 0) {
      console.log(`Deleting ${images.length} images for project ${id}`);
      await this.imageRepository.remove(images);
    }

    // 이제 프로젝트 삭제
    return this.projectRepository.remove(project);
  }
}
