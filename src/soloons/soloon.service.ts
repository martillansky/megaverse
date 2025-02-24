import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { AxiosError } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { sleep } from 'src/utils';
import { Soloon } from '../entities/soloon.entity';
import { ApiPathInterceptor } from '../interceptors/api-path.interceptor';

@Injectable()
@UseInterceptors(ApiPathInterceptor)
export class SoloonService {
  private readonly logger = new Logger(SoloonService.name);

  constructor(private readonly httpService: HttpService) {}

  async postSoloon(soloonObj: Soloon): Promise<Soloon> {
    this.logger.log(
      `Creating ${soloonObj.convertionService()} SOLOON at row ${soloonObj.row} col ${soloonObj.column}`,
    );

    try {
      await sleep();
      const response = await lastValueFrom(
        this.httpService
          .post('/soloons', {
            row: soloonObj.row,
            column: soloonObj.column,
            color: soloonObj.convertionService(),
            candidateId: soloonObj.candidateId,
          })
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to create SOLOON: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }

  async deleteSoloon(soloonObj: Soloon): Promise<Soloon> {
    this.logger.log(
      `Removing SOLOON at row ${soloonObj.row} col ${soloonObj.column}`,
    );

    try {
      await sleep();
      const response = await lastValueFrom(
        this.httpService
          .delete('/soloons', {
            data: {
              row: soloonObj.row,
              column: soloonObj.column,
              candidateId: soloonObj.candidateId,
            },
          })
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to delete SOLOON: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }
}
