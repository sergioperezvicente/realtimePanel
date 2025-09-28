import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

const files = new Logger('FilesService');

@Injectable()
export class FilesService {
  deleteImage(url: string, category: string) {
    const filename = url.split('/').pop()!;
    const imagePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'images',
      category,
      filename,
    );

    //files.debug(filename, ' on ', imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
}
