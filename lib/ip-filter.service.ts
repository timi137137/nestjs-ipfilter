import { Inject, Injectable } from '@nestjs/common';
import {IpFilterMode, IpFilterModuleOptions, IpOptions} from './interfaces';
import { MODULE_OPTIONS_TOKEN } from './ip-filter.module-definition';
import {IPVersion} from "net";

@Injectable()
export class IpFilterService {
  mode: IpFilterMode;
  trustProxy: boolean;

  private _ip: IpOptions;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    readonly options: IpFilterModuleOptions,
  ) {
    this.mode = options.mode ?? 'deny';
    this.trustProxy = options.trustProxy ?? false;

    this._ip = options.ip;
  }

  get ipVersion(): string {
    return this._ip.version ?? 'ipv4';
  }
  set ipVersion(version: IPVersion) {
    this._ip.version = version;
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
  set ipRange(range: { start: string, end: string }) {
    this._ip.range = [range.start, range.end];
  }

  get ipPrefix(): number {
    return this._ip.prefix;
  }
  set ipPrefix(prefix: number) {
    this._ip.prefix = prefix;
  }
}
