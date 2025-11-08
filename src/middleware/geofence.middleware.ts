import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isPrivateIp } from 'src/common/helper';
import { allowedCountries } from 'src/common/allowed-countries';
import { IPinfoWrapper } from 'node-ipinfo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeofenceMiddleware implements NestMiddleware {
  private ipinfo: IPinfoWrapper;

  constructor(private readonly configService: ConfigService) {
    this.ipinfo = new IPinfoWrapper(
      this.configService.get<string>('IPINFO_TOKEN') as string,
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      '';

    console.log('Resolved IP:', ip);

    //Allow localhost and private/internal IPs
    if (ip.includes('127.0.0.1') || ip.includes('::1') || isPrivateIp(ip)) {
      return next();
    }
    try {
      const response = await this.ipinfo.lookupIp(ip);
      console.log('IPInfo response:', response);

      const country = response.countryCode;

      if (!country || !allowedCountries.includes(country)) {
        throw new ForbiddenException(
          'Access restricted to UK, Canada, and Nigeria only.',
        );
      }

      next();
    } catch (err) {
      if (err instanceof ForbiddenException) {
        throw err;
      }
      console.error('IPInfo lookup failed:', err);
      throw new ForbiddenException('Unable to verify location.');
    }
  }
}
