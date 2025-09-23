import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';

@Module({
  providers: [WsService, WsGateway]
})
export class WsModule {}
