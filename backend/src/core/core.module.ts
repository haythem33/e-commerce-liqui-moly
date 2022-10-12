import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { CoreController } from './core.controller';

@Module({
  providers: [FileService],
  exports: [FileService],
  controllers: [CoreController],
})
export class CoreModule {}
