import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get()
  findAll(@Query('projectId') projectId?: number) {
    if (projectId) {
      return this.imageService.findByProject(projectId);
    }
    return this.imageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.imageService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.imageService.remove(id);
  }

  @Put(':id/featured')
  setFeatured(
    @Param('id') id: number,
    @Body('isFeatured') isFeatured: boolean,
  ) {
    return this.imageService.setFeatured(id, isFeatured);
  }
}
