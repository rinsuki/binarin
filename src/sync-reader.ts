import { typedArrayToDataView } from "./typedarray-to-dataview"

type ConstructorArgumentsOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TFunc extends new (...args: any[]) => unknown
> = TFunc extends new (...args: infer TArgs) => unknown ? TArgs : never

let bigint32: bigint,
    bigint0x8000000000000000: bigint,
    bigint0xffffffffffffffff: bigint
// もしBigIntに対応していない環境でも、BigInt以外の機能は使えるようにする
// (BigIntリテラルを直接使うとBigIntに未対応な環境の場合SyntaxErrorで死んでしまう
//  ここではそれを回避するためにstringからBigIntを作っている)
try {
    bigint32 = BigInt(32)
    bigint0x8000000000000000 = BigInt("0x8000000000000000")
    bigint0xffffffffffffffff = BigInt("0xffffffffffffffff")
} catch {
    // This environment doesn't support BigInt
}

export class SyncReader {
    dataView: DataView
    constructor(
        source: DataView | Uint8Array | ArrayBuffer,
        public pointer: number = 0,
        public isLittleEndian = false,
    ) {
        if (source instanceof DataView) {
            this.dataView = source
        } else if (source instanceof ArrayBuffer) {
            this.dataView = new DataView(source)
        } else if (source instanceof Uint8Array) {
            this.dataView = typedArrayToDataView(source)
        } else {
            throw new Error(
                "source should be DataView or ArrayBuffer or Uint8Array",
            )
        }
    }

    align(size: number) {
        this.pointer = Math.ceil(this.pointer / size) * size
    }

    skip(n: number) {
        this.pointer += n
    }

    bytes(size: number) {
        return this.dataView.buffer.slice(this.pointer, (this.pointer += size))
    }

    /**
     * return bytes as Uint8Array with byteOffset (zero copy).
     */
    bytesNoCopy(size: number): Uint8Array {
        const arr = new Uint8Array(
            this.dataView.buffer,
            this.dataView.byteOffset + this.pointer,
            size,
        )
        this.pointer += size
        return arr
    }

    zeroTerminatedBytes() {
        const start = this.pointer
        while (this.dataView.getUint8(this.pointer)) {
            this.pointer++
        }
        return this.dataView.buffer.slice(start, this.pointer++)
    }

    /**
     * zeroTerminatedBytes as Uint8Array with byteOffset (zero copy).
     */
    zeroTerminatedBytesNoCopy() {
        const start = this.pointer
        while (this.dataView.getUint8(this.pointer)) {
            this.pointer++
        }
        const len = this.pointer - start
        this.pointer++
        return new Uint8Array(
            this.dataView.buffer,
            this.dataView.byteOffset + start,
            len,
        )
    }

    zeroTerminatedString(
        ...params: ConstructorArgumentsOf<typeof TextDecoder>
    ) {
        const decoder = new TextDecoder(...params)
        return decoder.decode(this.zeroTerminatedBytesNoCopy())
    }

    u8() {
        return this.dataView.getUint8(this.pointer++)
    }

    i8() {
        return this.dataView.getInt8(this.pointer++)
    }

    u16(isLittleEndian = this.isLittleEndian) {
        const res = this.dataView.getUint16(this.pointer, isLittleEndian)
        this.pointer += 2
        return res
    }

    i16(isLittleEndian = this.isLittleEndian) {
        const res = this.dataView.getInt16(this.pointer, isLittleEndian)
        this.pointer += 2
        return res
    }

    u24(isLittleEndian = this.isLittleEndian) {
        const bit0 = this.u8()
        const bit1 = this.u8()
        const bit2 = this.u8()
        const bit = isLittleEndian
            ? bit0 | (bit1 << 8) | (bit2 << 16)
            : bit2 | (bit1 << 8) | (bit0 << 16)
        return bit
    }

    i24(isLittleEndian = this.isLittleEndian) {
        const u24 = this.u24(isLittleEndian)
        if (u24 >> 23) {
            return -(u24 ^ 0xffffff) - 1
        }
        return u24
    }

    u32(isLittleEndian = this.isLittleEndian) {
        const res = this.dataView.getUint32(this.pointer, isLittleEndian)
        this.pointer += 4
        return res
    }

    i32(isLittleEndian = this.isLittleEndian) {
        const res = this.dataView.getInt32(this.pointer, isLittleEndian)
        this.pointer += 4
        return res
    }

    u64(isLittleEndian = this.isLittleEndian) {
        const left = BigInt(this.u32(isLittleEndian))
        const right = BigInt(this.u32(isLittleEndian))
        if (isLittleEndian) {
            return (right << bigint32) | left
        } else {
            return (left << bigint32) | right
        }
    }

    i64(isLittleEndian = this.isLittleEndian) {
        const u64 = this.u64(isLittleEndian)
        if (u64 & bigint0x8000000000000000) {
            return -(u64 ^ bigint0xffffffffffffffff) - BigInt(1)
        }
        return u64
    }

    float(isLittleEndian = this.isLittleEndian) {
        const res = this.dataView.getFloat32(this.pointer, isLittleEndian)
        this.pointer += 4
        return res
    }

    double(isLittleEndian = this.isLittleEndian) {
        const res = this.dataView.getFloat64(this.pointer, isLittleEndian)
        this.pointer += 8
        return res
    }
}
