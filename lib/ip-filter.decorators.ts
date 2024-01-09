import { SetMetadata } from '@nestjs/common';

export const IPFilter = (enable?: boolean) =>
  SetMetadata('ipFilter', enable ?? true);
