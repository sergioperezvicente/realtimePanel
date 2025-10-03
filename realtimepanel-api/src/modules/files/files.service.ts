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

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  createDefaultSettings(id: string) {
    const filename = id + '.json';
    const dir = join(__dirname, '..', '..', '..', 'public', 'settings');
    const path = join(dir, filename);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path, '{}', { encoding: 'utf-8' });

    files.debug(`Default settings for user ${id} created`);
  }

  sendSettingsOfUser(id: string) {
    files.debug(`Settings solicited from user ${id}`);
    const filename = id + '.json';
    const path = join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'settings',
      filename,
    );
    if (!fs.existsSync(path)) {
      throw new Error(`settings not found of user ${id}`);
    }

    const raw = fs.readFileSync(path, 'utf-8');
    return JSON.parse(raw);
  }

  updateSettingsOfUser(id: string, setting: any) {
    files.debug(`Settings from user ${id} updated`);
    const json = JSON.stringify(setting);
    const filename = id + '.json';
    const path = join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'settings',
      filename,
    );
    fs.writeFileSync(path, json);
  }
}
