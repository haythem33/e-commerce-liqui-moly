import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { FileService } from './services/file.service';

@Controller({
  path: 'core',
  version: '1',
})
export class CoreController {
  constructor(private fileService: FileService) {}
  @Get('static_file/:filename')
  @HttpCode(HttpStatus.OK)
  public async getfile(
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    return this.fileService.get_static_file(filename);
  }
}
