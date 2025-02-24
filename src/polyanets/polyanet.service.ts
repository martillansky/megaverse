import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { AxiosError } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { sleep } from 'src/utils';
import { Polyanet } from '../entities/polyanet.entity';
import { ApiPathInterceptor } from '../interceptors/api-path.interceptor';

@Injectable()
@UseInterceptors(ApiPathInterceptor)
export class PolyanetService {
  private readonly logger = new Logger(PolyanetService.name);

  constructor(private readonly httpService: HttpService) {}

  async postPolyanet(polyanetObj: Polyanet): Promise<Polyanet> {
    this.logger.log(
      `Creating POLYANET at row ${polyanetObj.row} col ${polyanetObj.column}`,
    );

    try {
      await sleep();
      const response = await lastValueFrom(
        this.httpService
          .post('/polyanets', {
            row: polyanetObj.row,
            column: polyanetObj.column,
            candidateId: polyanetObj.candidateId,
          })
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to create POLYANET: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }

  async deletePolyanet(polyanetObj: Polyanet): Promise<Polyanet> {
    this.logger.log(
      `Removing POLYANET at row ${polyanetObj.row} col ${polyanetObj.column}`,
    );

    try {
      await sleep();
      const response = await lastValueFrom(
        this.httpService
          .delete('/polyanets', {
            data: {
              row: polyanetObj.row,
              column: polyanetObj.column,
              candidateId: polyanetObj.candidateId,
            },
          })
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to delete POLYANET: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }
}
