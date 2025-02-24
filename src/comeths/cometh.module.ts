import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ComethService } from './cometh.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    ComethService,
    {
      provide: 'BASE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get('BASE_URL'),
      inject: [ConfigService],
    },
  ],
  exports: [ComethService],
})
export class ComethModule {}
