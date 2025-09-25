import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { WsModule } from './modules/ws/ws.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        type: 'postgres',
        host: cs.get('PG_HOST', 'localhost'),
        port: Number(cs.get('PG_PORT', 5432)),
        username: cs.get('APP_DB_USER'),
        password: cs.get('APP_DB_PASSWORD'),
        database: cs.get('APP_DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // solo en dev; en prod usa migraciones
      }),

      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '15s' },
    }),
    AuthModule,
    FilesModule,
    WsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService],
})
export class AppModule {}
