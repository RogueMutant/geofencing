import { Injectable } from '@nestjs/common';
import * as geoip from 'geoip-lite';
import { allowedCountries } from './common/allowed-ip';

@Injectable()
export class AppService {
  getHello() {
    return {
      message:
        '🌍 Welcome to the Test Server! This backend is set up for testing geofencing, server health checks, and client IP detection.',
      description:
        'It restricts access to users located in Nigeria, the United Kingdom, or Canada and provides endpoints for monitoring server status and location-based access.',
      endpoints: {
        root: '/',
        status: '/status',
        clientInfo: '/client',
        allowedCountries: '/allowed',
      },
    };
  }

  getServerStatus() {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return {
      status: 'ok',
      message: 'Server is running smoothly 🚀',
      uptime: `${hours}h ${minutes}m ${seconds}s`,
      timestamp: new Date().toISOString(),
    };
  }

  getClientInfo(ip: string) {
    const geo = ip ? geoip.lookup(ip) : null;

    return {
      ip,
      country: geo?.country || 'Unknown',
      region: geo?.region || 'Unknown',
      city: geo?.city || 'Unknown',
      coordinates: geo?.ll || [],
      allowed: geo ? allowedCountries.includes(geo.country) : false,
    };
  }

  getAllowedCountries() {
    return {
      allowedCountries: allowedCountries,
      note: 'Only users from these countries can access the app.',
    };
  }
}
