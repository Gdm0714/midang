import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const image = this.imageRepository.create(createImageDto);
    return this.imageRepository.save(image);
  }

  async findAll(): Promise<Image[]> {
    return this.imageRepository.find({
      relations: ['project'],
    });
  }

  async findByProject(projectId: number): Promise<Image[]> {
    return this.imageRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(id);
    return this.imageRepository.save({ ...image, ...updateImageDto });
  }

  async remove(id: number): Promise<Image> {
    const image = await this.findOne(id);
    return this.imageRepository.remove(image);
  }

  async setFeatured(id: number, isFeatured: boolean): Promise<Image> {
    const image = await this.findOne(id);
    image.isFeatured = isFeatured;
    return this.imageRepository.save(image);
  }
}
