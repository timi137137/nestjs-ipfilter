import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IpFilterService } from './ip-filter.service';
import { IP_FILTER_ID } from './ip-filter.constants';
import { IpFilterDenyException } from './ipfilter-deny.exception';

@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(
    @Inject(IP_FILTER_ID)
    private readonly ipFilterService: IpFilterService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Observable<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    const ipAddress: string = requestIp.getClientIp(request);

    const whitelist = this.ipFilterService.;
    const blacklist = this.ipFilterService.blacklist;

    let approved = false;

    if (whitelist.length > 0) {
      approved = whitelist.some((item) => {
        return new RegExp(item).test(ipAddress);
      });
    }

    if (blacklist.length > 0) {
      approved = !blacklist.some((item) => {
        return new RegExp(item).test(ipAddress);
      });
    }

    if (!approved && this.ipFilterService.useDenyException) {
      throw new IpFilterDenyException(
        {
          clientIp: ipAddress,
          whitelist: whitelist,
          blacklist: blacklist,
        },
        403,
      );
    }

    return approved;
  }
}
