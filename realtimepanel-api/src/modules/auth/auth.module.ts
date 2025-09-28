import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthController } from './auth.controller';
import { WsModule } from '../ws/ws.module';
import { FilesService } from '../files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => WsModule)],
  controllers: [AuthController],
  providers: [AuthService, FilesService],
  exports: [AuthService],
})
export class AuthModule {}
