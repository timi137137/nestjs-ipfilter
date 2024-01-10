<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">IP filter module for Nest framework (node.js) 🌎</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/%40timi137%2Fnestjs-ipfilter.svg" alt="NPM Version" />
  <img src="https://img.shields.io/npm/l/%40timi137%2Fnestjs-ipfilter.svg" alt="Package License" />
  <img src="https://img.shields.io/npm/dm/%40timi137%2Fnestjs-ipfilter.svg" alt="NPM Downloads" />
</p>

## Description

IP filter module for [Nest](https://github.com/nestjs/nest).

This module allows you to control whether certain routes can be accessed from listed addresses.

Thanks to awesometic, this module was developed with reference to his [package](https://github.com/awesometic/nestjs-ip-filter)

## Installation

```bash
$ npm i --save @timi137/nestjs-ipfilter
```

## Quick Start

First register the filter in `app.module.ts`, The sample code shows the IP address access interface in the global deny list.

```typescript
IpFilterModule.register({
  isGlobal: true,
  mode: 'deny',
  trustProxy: true,
  ip: {
    list: ['127.0.0.1'],
  },
})
```

Then add the `@IpFilter()` decorator to the controller or method you want to filter.

Pass false to the decorator to prevent filtering from running on the corresponding controller or method.

```typescript
@IPFilter(false)
@Get()
getHello(): string {
  return 'Hello world!';
}
```

## Options

| Name       | Type                | Default   | Description                                                          |
|------------|---------------------|-----------|----------------------------------------------------------------------|
| isGlobal   | boolean             | false     | enabling this option will filter all routes                          |
| mode       | string              | deny      | deny or allow                                                        |
| trustProxy | boolean or string[] | false     | trust proxy headers                                                  |
| ip.list    | string[]            | undefined | list of IPs                                                          |
| ip.range   | string[]            | undefined | list of IP ranges, Only the start and end of the pass are allowed    |
| ip.subnet  | string[]            | undefined | List of subnets. The passed value must conform to the specification. |

### Example Options

```txt
{
  isGlobal: true,
  mode: 'deny',
  trustProxy: true,
  ip: {
    list: ['127.0.0.1', '192.168.0.1'],
    range: ['192.168.1.1', '192.168.1.100'],
    subnet: ['192.168.0.1/24']
  },
}
```

## License

This project is [MIT licensed](LICENSE).
