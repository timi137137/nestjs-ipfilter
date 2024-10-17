import { BlockList, isIP } from 'node:net';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { IP_FILTER_ID } from './ip-filter.constants';
import { IpFilterService } from './ip-filter.service';
import { getIp } from './utils';

@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(
    @Inject(IP_FILTER_ID)
    private readonly ipFilterService: IpFilterService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Observable<boolean> | boolean {
    // get guard
    const guard = this.reflector.getAllAndOverride<boolean>('ipFilter', [
      context.getHandler(),
      context.getClass(),
    ]);

    // if not global and guard is not defined, then skip ip filter
    if (!this.ipFilterService.isGlobal && guard === undefined) {
      return true;
    }
    // if set guard to false, then skip ip filter
    if (guard === false) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const clientIp: string = getIp(request, this.ipFilterService.options);
    const blockList = new BlockList();

    if (this.ipFilterService.ipList) {
      this.ipFilterService.ipList.forEach((ip) => {
        if (!isIP(ip)) {
          throw TypeError(`ip ${ip} is not a valid IP address`);
        }

        blockList.addAddress(ip);
      });
    }
    if (this.ipFilterService.ipRange) {
      const range = this.ipFilterService.ipRange;
      blockList.addRange(range[0], range[1]);
    }
    if (this.ipFilterService.ipSubnet) {
      const subnetList = this.ipFilterService.ipSubnet;
      subnetList.forEach((subnet) => {
        if (!subnet.includes('/')) {
          throw TypeError(`${subnet} is not a valid IP subnet address`);
        }

        const subnetSplit = subnet.split('/');
        if (!isIP(subnetSplit[0]) && typeof subnetSplit[1] !== 'number') {
          throw TypeError(`${subnetSplit[0]} is not a valid IP subnet address`);
        }

        blockList.addSubnet(
          subnetSplit[0],
          subnetSplit[1] as unknown as number,
        );
      });
    }

    if (clientIp == null) {
      return this.ipFilterService.mode === 'allow';
    }

    const matching = blockList.check(clientIp);
    const approved =
      this.ipFilterService.mode === 'allow' ? matching : !matching;

    if (!approved) {
      throw new ForbiddenException(undefined, 'Sorry, you have been blocked');
    }

    return approved;
  }
}
