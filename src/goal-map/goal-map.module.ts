import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoalMapService } from './goal-map.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    GoalMapService,
    Logger,
    {
      provide: 'BASE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get('BASE_URL'),
      inject: [ConfigService],
    },
  ],
  exports: [GoalMapService],
})
export class GoalMapModule {}
