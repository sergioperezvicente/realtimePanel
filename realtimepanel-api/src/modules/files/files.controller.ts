import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  //constructor(private readonly filesService: FilesService) {}

  @Post('upload/:category')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const category = req.params.category;
        const uploadPath = join(__dirname, '..','..','..', 'public', 'images', category);
        console.log(uploadPath)

        // crea carpeta si no existe
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
    console.log('File detected')
    const filePath = `${process.env.API_URL}/images/${category}/${file.filename}`;

    return {
      message: 'Archivo subido correctamente',
      category,
      filePath,
    };
  }
}

