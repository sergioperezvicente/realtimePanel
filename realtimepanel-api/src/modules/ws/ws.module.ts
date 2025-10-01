import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [WsGateway, WsService],
  exports: [WsService]
})
export class WsModule {}
