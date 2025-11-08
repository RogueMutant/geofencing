import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class GeofenceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract client IP
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '';

    const geo = geoip.lookup(ip);

    const allowed = ['NG', 'GB', 'CA'];

    // if the req comes from dev or test server
    if (ip.includes('127.0.0.1') || ip.includes('::1')) return next();

    if (!geo || !allowed.includes(geo.country)) {
      throw new ForbiddenException(
        'Access restricted to UK, Canada, and Nigeria only.',
      );
    }
    console.log(geo, 'your ip ==== ', ip);
    next();
  }
}
