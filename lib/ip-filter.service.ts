import { Inject, Injectable } from '@nestjs/common';
import { IPVersion } from 'net';

import { IpFilterMode, IpFilterModuleOptions, IpOptions } from './interfaces';
import { MODULE_OPTIONS_TOKEN } from './ip-filter.module-definition';

@Injectable()
export class IpFilterService {
  mode: IpFilterMode;
  trustProxy: boolean | string[];

  private _ip: IpOptions;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    readonly options: IpFilterModuleOptions,
  ) {
    this.mode = options.mode ?? 'deny';
    this.trustProxy = options.trustProxy ?? false;

    this._ip = options.ip;
  }

  get ipList(): string[] {
    return this._ip.list;
  }
  set ipList(ips: string[]) {
    this._ip.list = ips;
  }

  get ipRange(): string[] {
    return this._ip.range;
  }
  set ipRange(range: { start: string; end: string }) {
    this._ip.range = [range.start, range.end];
  }

  get ipSubnet(): string[] {
    return this._ip.subnet;
  }
  set ipSubnet(subnet: string[]) {
    this._ip.subnet = subnet;
  }
}
