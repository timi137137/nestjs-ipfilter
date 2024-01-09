import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { IP_FILTER_ID } from './ip-filter.constants';
import { IpFilterGuard } from './ip-filter.guard';
import { ConfigurableModuleClass } from './ip-filter.module-definition';
import { IpFilterService } from './ip-filter.service';

const ipFilterServiceProvider = {
  provide: IP_FILTER_ID,
  useClass: IpFilterService,
};
const ipFilterGuardProvider = {
  provide: APP_GUARD,
  useClass: IpFilterGuard,
};

@Module({
  providers: [ipFilterServiceProvider, ipFilterGuardProvider],
  exports: [ipFilterServiceProvider],
})
export class IpFilterModule extends ConfigurableModuleClass {}
