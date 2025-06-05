import { Test, TestingModule } from '@nestjs/testing';
import { JamService } from './jam.service';

describe('JamService', () => {
  let service: JamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JamService],
    }).compile();

    service = module.get<JamService>(JamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
