type ConstructorArgumentsOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TFunc extends new (...args: any[]) => unknown
    > = TFunc extends new (...args: infer TArgs) => unknown ? TArgs : never

export class SyncReader {
    constructor(
        public dataView: DataView,
        public pointer: number = 0,
        public isLittleEndian = false,
    ) { }

    align(size: number) {
        this.pointer = Math.ceil(this.pointer / size) * size
    }

    skip(n: number) {
        this.pointer += n
    }

    bytes(size: number) {
        return this.dataView.buffer.slice(this.pointer, (this.pointer += size))
    }

    zeroTerminatedBytes() {
        const start = this.pointer
        while (this.dataView.getUint8(this.pointer)) {
            this.pointer++
        }
        return this.dataView.buffer.slice(start, this.pointer++)
    }

    zeroTerminatedString(
        ...params: ConstructorArgumentsOf<typeof TextDecoder>
    ) {
        const decoder = new TextDecoder(...params)
        return decoder.decode(this.zeroTerminatedBytes())
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
        var bits = [this.u8(), this.u8(), this.u8()]
        if (isLittleEndian) bits = bits.reverse()
        const bit = bits.reduce((prev, current) => current | (prev << 8), 0)
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
            return (right << BigInt(32)) | left
        } else {
            return (left << BigInt(32)) | right
        }
    }

    i64(isLittleEndian = this.isLittleEndian) {
        const u64 = this.u64(isLittleEndian)
        if (u64 & BigInt("0x8000000000000000")) {
            return -(u64 ^ BigInt("0xffffffffffffffff")) - BigInt(1)
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
