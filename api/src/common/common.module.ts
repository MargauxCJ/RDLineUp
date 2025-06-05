import { Module } from '@nestjs/common';
import { MessageModule } from 'src/common/services/message/message.module';

@Module({
  imports: [MessageModule],
  exports: [MessageModule],
})
export class CommonModule {}
