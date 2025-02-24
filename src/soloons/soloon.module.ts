import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SoloonService } from './soloon.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    SoloonService,
    {
      provide: 'BASE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get('BASE_URL'),
      inject: [ConfigService],
    },
  ],
  exports: [SoloonService],
})
export class SoloonModule {}
