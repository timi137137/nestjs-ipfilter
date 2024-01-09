import { isIP } from 'node:net';

import { IpFilterModuleOptions } from '../interfaces';

export function getIp(request: Request, options: IpFilterModuleOptions) {
  if (request.headers) {
    // Default nginx proxy/cgi; alternative to x-forwarded-for, used by some proxies.
    if (isIP(request.headers['x-real-ip'])) {
      return request.headers['x-real-ip'];
    }

    // Load-balancers (AWS ELB) or proxies.
    const forwardedFor = getIpFromXForwardedFor(
      request.headers['x-forwarded-for'],
      options.trustProxy,
    );
    if (forwardedFor !== null) return forwardedFor;

    // Standard headers used by Amazon EC2, Heroku, and others
    if (isIP(request.headers['x-client-ip']) !== 0) {
      return request.headers['x-client-ip'];
    }

    // Fastly and Firebase hosting header (When forward to cloud function)
    if (isIP(request.headers['fastly-client-ip'])) {
      return request.headers['fastly-client-ip'];
    }

    // Cloudflare.
    // @see https://developers.cloudflare.com/fundamentals/reference/http-request-headers/
    // CF-Connecting-IP - applied to every request to the origin.
    if (isIP(request.headers['cf-connecting-ip'])) {
      return request.headers['cf-connecting-ip'];
    }

    // Cloudflare fallback
    // https://blog.cloudflare.com/eliminating-the-last-reasons-to-not-enable-ipv6/#introducingpseudoipv4
    if (isIP(request.headers['Cf-Pseudo-IPv4'])) {
      return request.headers['Cf-Pseudo-IPv4'];
    }

    // Akamai and Cloudflare: True-Client-IP.
    if (isIP(request.headers['true-client-ip'])) {
      return request.headers['true-client-ip'];
    }

    // Google Cloud App Engine
    // https://cloud.google.com/appengine/docs/standard/go/reference/request-response-headers
    if (isIP(request.headers['x-appengine-user-ip'])) {
      return request.headers['x-appengine-user-ip'];
    }
  }

  return null;
}

export function getIpFromXForwardedFor(
  header: string,
  trustProxy?: boolean | string[],
) {
  if (header == null) return null;

  // x-forwarded-for may return multiple IP addresses in the format:
  // "client IP, proxy 1 IP, proxy 2 IP"
  // Therefore, the right-most IP address is the IP address of the most recent proxy
  // and the left-most IP address is the IP address of the originating client.
  // source: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For
  // Azure Web App's also adds a port for some reason, so we'll only use the first part (the IP)
  const forwardedIps = header.split(',').map((e) => {
    const ip = e.trim();

    // isIP can't validate IPv4 with port numbers, so we'll remove it
    if (ip.includes(':') && isIP(ip) === 4) {
      return ip.split(':')[0];
    }

    // Sometimes IP addresses in this header can be 'unknown' (http://stackoverflow.com/a/11285650).
    // Sometimes there are irregularities that require filtering
    return isIP(ip) !== 0 ? ip : null;
  });

  if (typeof trustProxy === 'boolean') {
    // If the trust proxy option is enabled, return the ip directly
    if (trustProxy === true) {
      return forwardedIps[0];
    } else {
      // If the trusted proxy option is disabled, brokered addresses are not trusted
      return null;
    }
  }

  // If any proxy address is not in the whitelist, it is considered untrusted
  if (Array.isArray(trustProxy)) {
    for (let i = 1; i < forwardedIps.length; i++) {
      if (!trustProxy.includes(forwardedIps[i])) {
        return null;
      }
    }

    return forwardedIps[0];
  }

  return null;
}
