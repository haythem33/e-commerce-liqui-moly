import { Test, TestingModule } from '@nestjs/testing';
import { InitServiceService } from './init-service.service';

describe('InitServiceService', () => {
  let service: InitServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitServiceService],
    }).compile();

    service = module.get<InitServiceService>(InitServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
