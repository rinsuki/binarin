# binarin

Useful Binary Reader for TypeScript (both works Browser and Node.js).

## Required

-   JavaScript Runtime with BigInt support
    -   https://caniuse.com/#feat=bigint
    -   Note: currently (2020/05), Safari (WebKit) not supported BigInt

## Features (including WIP)

-   [x] Sync Reader
    -   both supporting little and big endian
    -   read 8bit, 16bit, 32bit unsigned/signed int as number
    -   read float/double (32bit/64bit) as number
    -   read 64bit unsigned/signed int as BigInt
    -   read Zero Terminated String/Bytes
-   [ ] Async Reader

## Example

```typescript
import { SyncReader } from "binarin"

const reader = new SyncReader(new DataView(arrayBuffer))
reader.u8() // returns number 0..<256
reader.i8() // returns number -128..<127
reader.float() // returns number
reader.zeroTerminatedString("utf-8") // return string (decoded by TextDecoder)
```
