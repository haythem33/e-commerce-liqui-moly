import { Module } from '@nestjs/common';
import { AdminServiceService } from './services/admin-service.service';
import { AdminController } from './admin.controller';

@Module({
  providers: [AdminServiceService],
  controllers: [AdminController],
})
export class AdminModule {}
