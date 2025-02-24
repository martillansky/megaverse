import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { EnvironmentVariables } from 'src/env/validation';
import { CurrentMap, GoalMap } from '../entities/goal-map.entity';
import { ApiPathInterceptor } from '../interceptors/api-path.interceptor';

@Injectable()
@UseInterceptors(ApiPathInterceptor)
export class GoalMapService {
  private readonly logger = new Logger(GoalMapService.name);
  private readonly candidateId: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    const candidateId = this.configService.get('CANDIDATE_ID', { infer: true });
    if (!candidateId) throw new Error('CANDIDATE_ID is required');
    this.candidateId = candidateId;
  }

  async getGoalMap(): Promise<GoalMap> {
    try {
      const response = await lastValueFrom(
        this.httpService
          .get(`/map/${this.candidateId}/goal`)
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to get goal map: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }

  async getCurrentMap(): Promise<CurrentMap> {
    try {
      const response = await lastValueFrom(
        this.httpService
          .get(`/map/${this.candidateId}`)
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to get current map: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }
}
