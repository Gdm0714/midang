import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'node:fs';

@Controller('uploads')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // uploads 폴더가 없으면 생성
          const uploadPath = './uploads';
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          console.log('Upload destination:', uploadPath);
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          const filename = `${randomName}${extname(file.originalname)}`;
          console.log('Generated filename:', filename);
          return cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log(
          'Received file:',
          file.originalname,
          'mimetype:',
          file.mimetype,
        );
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  uploadImage(@UploadedFile() file) {
    console.log('Received file in controller:', file);

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const apiUrl = process.env.API_URL || 'http://localhost:3001';
    const imageUrl = `${apiUrl}/uploads/${file.filename}`;

    console.log('Returning image URL:', imageUrl);

    return {
      url: imageUrl,
    };
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuidv4();
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  uploadImages(@UploadedFiles() files) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }
    return files.map((file) => ({
      url: `${process.env.API_URL}/uploads/${file.filename}`,
    }));
  }
}
