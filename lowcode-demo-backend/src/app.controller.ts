import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  data() {
    return [
      { name: 'james', sex: '男', birthday: new Date('1994-07-07').getTime() },
      { name: 'zhang', sex: '男', birthday: new Date('1995-06-06').getTime() },
      { name: 'blue', sex: '女', birthday: new Date('1996-08-08').getTime() },
    ];
  }
}
