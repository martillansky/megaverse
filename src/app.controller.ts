import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async initMegaverse(): Promise<string> {
    return await this.appService
      .initMegaverse()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return 'UNEXPECTED ERROR!';
      });
  }
}
