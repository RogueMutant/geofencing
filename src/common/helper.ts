// this function addresses situations where cloud hosted ips might
//mess with geolocation

export function isPrivateIp(ip: string): boolean {
  return (
    ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')
  );
}
