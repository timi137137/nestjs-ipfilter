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
   * If your application runs behind a proxy server, check the specific HTTP adapter options for the trust proxy option and enable it.\
   * If-select array, only the incoming proxy server is trusted, otherwise it is rejected.
   */
  trustProxy?: boolean | string[];
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
   * List of subnets. The passed value must conform to the specification\
   * Example 192.168.0.1/24
   */
  subnet?: string[];
}

export type IpFilterMode = 'allow' | 'deny';
