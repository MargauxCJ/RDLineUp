import { Test, TestingModule } from '@nestjs/testing';
import { LineUpService } from './line-up.service';

describe('LineUpService', () => {
  let service: LineUpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LineUpService],
    }).compile();

    service = module.get<LineUpService>(LineUpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
