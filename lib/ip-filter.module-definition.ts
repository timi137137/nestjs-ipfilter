import { ConfigurableModuleBuilder } from '@nestjs/common';

import { IpFilterModuleOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IpFilterModuleOptions>().build();
