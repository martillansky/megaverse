import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UseInterceptors } from '@nestjs/common';
import { AxiosError } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { sleep } from 'src/utils';
import { Cometh } from '../entities/cometh.entity';
import { ApiPathInterceptor } from '../interceptors/api-path.interceptor';

@Injectable()
@UseInterceptors(ApiPathInterceptor)
export class ComethService {
  private readonly logger = new Logger(ComethService.name);

  constructor(private readonly httpService: HttpService) {}

  async postCometh(comethObj: Cometh): Promise<Cometh> {
    this.logger.log(
      `Creating ${comethObj.convertionService()} COMETH at row ${comethObj.row} col ${comethObj.column}`,
    );

    try {
      await sleep();
      const response = await lastValueFrom(
        this.httpService
          .post('/comeths', {
            row: comethObj.row,
            column: comethObj.column,
            direction: comethObj.convertionService(),
            candidateId: comethObj.candidateId,
          })
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to create COMETH: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }

  async deleteCometh(comethObj: Cometh): Promise<Cometh> {
    this.logger.log(
      `Removing COMETH at row ${comethObj.row} col ${comethObj.column}`,
    );

    try {
      await sleep();
      const response = await lastValueFrom(
        this.httpService
          .delete('/comeths', {
            data: {
              row: comethObj.row,
              column: comethObj.column,
              candidateId: comethObj.candidateId,
            },
          })
          .pipe(map((response) => response.data)),
      );
      return response;
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Failed to delete COMETH: ${axiosError.response?.data || axiosError.message}`,
      );
      throw error;
    }
  }
}
