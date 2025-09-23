import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { WsModule } from './modules/ws/ws.module';

@Module({
  imports: [AuthModule, FilesModule, WsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
