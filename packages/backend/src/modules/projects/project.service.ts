import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectRepository.create(createProjectDto);
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
    return this.projectRepository.remove(project);
  }
}
