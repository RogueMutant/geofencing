import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import { Request, Response, NextFunction } from 'express';
import { isPrivateIp } from 'src/common/helper';
import { allowedCountries } from 'src/common/allowed-countries';

@Injectable()
export class GeofenceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (req.headers['x-real-ip'] as string) ||
      req.socket.remoteAddress ||
      '';

    console.log('Resolved IP:', ip);

    // Allow localhost and private/internal IPs (common in cloud setups)
    if (ip.includes('127.0.0.1') || ip.includes('::1') || isPrivateIp(ip)) {
      return next();
    }

    const geo = geoip.lookup(ip);

    if (!geo || !allowedCountries.includes(geo.country)) {
      throw new ForbiddenException(
        'Access restricted to UK, Canada, and Nigeria only.',
      );
    }
    next();
  }
}
