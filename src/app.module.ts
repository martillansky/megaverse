import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComethModule } from './comeths/cometh.module';
import { ComethService } from './comeths/cometh.service';
import { validate } from './env/validation';
import { GoalMapModule } from './goal-map/goal-map.module';
import { GoalMapService } from './goal-map/goal-map.service';
import { ApiPathInterceptor } from './interceptors/api-path.interceptor';
import { PolyanetModule } from './polyanets/polyanet.module';
import { PolyanetService } from './polyanets/polyanet.service';
import { SoloonModule } from './soloons/soloon.module';
import { SoloonService } from './soloons/soloon.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    HttpModule,
    PolyanetModule,
    SoloonModule,
    ComethModule,
    GoalMapModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GoalMapService,
    PolyanetService,
    SoloonService,
    ComethService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiPathInterceptor,
    },
    {
      provide: 'BASE_URL',
      useFactory: (configService: ConfigService) =>
        configService.get('BASE_URL'),
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
