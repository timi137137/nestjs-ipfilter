import { IPVersion } from "net";

export type IpFilterModuleOptions = {
  /**
   * Whether to deny or allow to the IPs provided\
   * Default: 'deny'
   */
  mode?: IpFilterMode;
  /**
   * IP options
   */
  ip: IpOptions;
  /**
   * If your application runs behind a proxy server, check the specific HTTP adapter options (express and fastify) for the trust proxy option and enable it.
   */
  trustProxy?: boolean;
}

export type IpOptions = {
  /**
   * List of IPs
   */
  list?: string[];
  /**
   * List of IP ranges, Only the start and end of the pass are allowed
   */
  range?: string[];
  /**
   * The number of CIDR prefix bits. For IPv4, this must be a value between 0 and 32. For IPv6, this must be between 0 and 128.
   */
  prefix?: number;
  /**
   * "ipv4" | "ipv6"\
   * Default: ipv4
   */
  version?: IPVersion;
}

export type IpFilterMode = 'allow' | 'deny';
