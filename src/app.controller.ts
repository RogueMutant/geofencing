import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('status')
  getStatus() {
    return this.appService.getServerStatus();
  }

  @Get('client')
  getClient(@Req() req: Request) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '';
    return this.appService.getClientInfo(ip);
  }

  @Get('allowed')
  getAllowedCountries() {
    return this.appService.getAllowedCountries();
  }
}
