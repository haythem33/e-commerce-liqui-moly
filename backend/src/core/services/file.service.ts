import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService implements OnApplicationBootstrap {
  constructor(private configService: ConfigService) {}
  onApplicationBootstrap(): void {
    console.log('CREATE UPLOADS FILES');
    if (!existsSync(this.configService.get<string>('CLIENT_FILES_FOLDER'))) {
      mkdirSync(this.configService.get<string>('CLIENT_FILES_FOLDER'));
      return;
    }
    console.log('FOLDER EXISTS');
  }
  public get_static_file(filename: string): StreamableFile {
    if (
      !existsSync(
        join(
          process.cwd(),
          this.configService.get<string>('CLIENT_FILES_FOLDER'),
          filename,
        ),
      )
    ) {
      throw new HttpException(
        'NO FILE FOUND WITH THIS NAME',
        HttpStatus.NOT_FOUND,
      );
    }
    return new StreamableFile(
      createReadStream(
        join(
          process.cwd(),
          this.configService.get<string>('CLIENT_FILES_FOLDER'),
          filename,
        ),
      ),
    );
  }
}
