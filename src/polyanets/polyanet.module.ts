import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PolyanetService } from './polyanet.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    PolyanetService,
    {
      provide: 'BASE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get('BASE_URL'),
      inject: [ConfigService],
    },
  ],
  exports: [PolyanetService],
})
export class PolyanetModule {}
