import { Test, TestingModule } from '@nestjs/testing';
import { LineUpController } from './line-up.controller';

describe('LineUpController', () => {
  let controller: LineUpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineUpController],
    }).compile();

    controller = module.get<LineUpController>(LineUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
