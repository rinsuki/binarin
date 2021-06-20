# binarin

Useful Binary Reader for TypeScript.

## Required

-   JavaScript Runtime with BigInt support (Safari >= 14)

## Features (including WIP)

-   [x] Sync Reader
    -   both supporting little and big endian
    -   read 8bit, 16bit, 24bit, 32bit unsigned/signed int as number
    -   read float/double (32bit/64bit) as number
    -   read 64bit unsigned/signed int as BigInt
    -   read Zero Terminated String/Bytes
-   [ ] Async Reader

## Example

### Node.js / webpack (and other node-backend bundlers)

```typescript
import { SyncReader } from "binarin"

const reader = new SyncReader(new DataView(arrayBuffer))
reader.u8() // returns number 0..<256
reader.i8() // returns number -128..<127
reader.float() // returns number
reader.zeroTerminatedString("utf-8") // return string (decoded by TextDecoder)
```
