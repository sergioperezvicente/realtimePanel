import { Controller, Logger, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { diskStorage } from 'multer';

const files = new Logger('FilesController')

@Controller('files')
export class FilesController {

  @Post('upload/:category')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const category = req.params.category;
        const uploadPath = join(__dirname, '..','..','..', 'public', 'images', category);
        //files.debug(uploadPath)

        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        // nombre único (ej. timestamp + original)
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
  }))
  uploadImage(
    @Param('category') category: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    files.debug('new file detected')
    const filePath = `${process.env.API_URL}/images/${category}/${file.filename}`;

    return {
      message: 'Archivo subido correctamente',
      category,
      filePath,
    };
  }
}

