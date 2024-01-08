import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  IIpFilterModuleOptions,
} from "./interfaces";

@Module({})
export class IpFilterModule {
  static register(options?: IIpFilterModuleOptions): DynamicModule {
    return {
      module: IpFilterModule,
      providers: [{ provide: IpFilterModuleOptions, useValue: options }],
      exports: [IpFilterModuleOptions]
    };
  }

}
