import { SyncReader } from "../src/sync-reader"

describe("SyncReader", () => {
    test("u8", () => {
        const arr = new Uint8Array([0x01, 0x02, 0xff])
        const reader = new SyncReader(new DataView(arr.buffer))
        expect(reader.u8()).toBe(1)
        expect(reader.u8()).toBe(2)
        expect(reader.u8()).toBe(255)
        expect(reader.pointer).toBe(3)
    })

    test("i8", () => {
        const arr = new Uint8Array([0x01, 0x02, 0xff])
        const reader = new SyncReader(new DataView(arr.buffer))
        expect(reader.i8()).toBe(1)
        expect(reader.i8()).toBe(2)
        expect(reader.i8()).toBe(-1)
        expect(reader.pointer).toBe(3)
    })

    describe("u16", () => {
        const arr = new Uint8Array([0x01, 0x00, 0x00, 0x02, 0xff, 0xff])
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.u16()).toBe(1)
            expect(reader.u16()).toBe(512)
            expect(reader.u16()).toBe(65535)
            expect(reader.pointer).toBe(6)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.u16()).toBe(256)
            expect(reader.u16()).toBe(2)
            expect(reader.u16()).toBe(65535)
            expect(reader.pointer).toBe(6)
        })
    })

    describe("i16", () => {
        const arr = new Uint8Array([0x01, 0x00, 0x00, 0x02, 0xff, 0xff])
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.i16()).toBe(1)
            expect(reader.i16()).toBe(512)
            expect(reader.i16()).toBe(-1)
            expect(reader.pointer).toBe(6)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.i16()).toBe(256)
            expect(reader.i16()).toBe(2)
            expect(reader.i16()).toBe(-1)
            expect(reader.pointer).toBe(6)
        })
    })

    describe("u24", () => {
        const arr = new Uint8Array(
            [
                [0x01, 0x00, 0x00],
                [0x00, 0x00, 0x02],
                [0xff, 0xff, 0xff],
            ].flat(),
        )
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.u24()).toBe(1)
            expect(reader.u24()).toBe(0x20000)
            expect(reader.u24()).toBe(0xffffff)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.u24()).toBe(0x10000)
            expect(reader.u24()).toBe(2)
            expect(reader.u24()).toBe(0xffffff)
        })
    })

    describe("i24", () => {
        const arr = new Uint8Array(
            [
                [0x01, 0x00, 0x00],
                [0x00, 0x00, 0x02],
                [0xff, 0xff, 0xff],
            ].flat(),
        )
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.i24()).toBe(1)
            expect(reader.i24()).toBe(0x20000)
            expect(reader.i24()).toBe(-1)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.i24()).toBe(0x10000)
            expect(reader.i24()).toBe(2)
            expect(reader.i24()).toBe(-1)
        })
    })

    describe("u32", () => {
        const arr = new Uint8Array(
            [
                [0x01, 0x00, 0x00, 0x00],
                [0x00, 0x00, 0x00, 0x02],
                [0xff, 0xff, 0xff, 0xff],
            ].flat(),
        )
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.u32()).toBe(1)
            expect(reader.u32()).toBe(0x02000000)
            expect(reader.u32()).toBe(0xffffffff)
            expect(reader.pointer).toBe(12)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.u32()).toBe(0x01000000)
            expect(reader.u32()).toBe(2)
            expect(reader.u32()).toBe(0xffffffff)
            expect(reader.pointer).toBe(12)
        })
    })

    describe("i32", () => {
        const arr = new Uint8Array(
            [
                [0x01, 0x00, 0x00, 0x00],
                [0x00, 0x00, 0x00, 0x02],
                [0xff, 0xff, 0xff, 0xff],
            ].flat(),
        )
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.i32()).toBe(1)
            expect(reader.i32()).toBe(0x02000000)
            expect(reader.i32()).toBe(-1)
            expect(reader.pointer).toBe(12)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.i32()).toBe(0x01000000)
            expect(reader.i32()).toBe(2)
            expect(reader.i32()).toBe(-1)
            expect(reader.pointer).toBe(12)
        })
    })

    describe("u64", () => {
        const arr = new Uint8Array(
            [
                [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
                [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
            ].flat(),
        )
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.u64()).toBe(1n)
            expect(reader.u64()).toBe(0x0200_0000_0000_0000n)
            expect(reader.u64()).toBe(0xffff_ffff_ffff_ffffn)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.u64()).toBe(0x0100_0000_0000_0000n)
            expect(reader.u64()).toBe(0x02n)
            expect(reader.u64()).toBe(0xffff_ffff_ffff_ffffn)
        })
    })

    describe("i64", () => {
        const arr = new Uint8Array(
            [
                [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
                [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02],
                [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
            ].flat(),
        )
        test("le", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, true)
            expect(reader.i64()).toBe(1n)
            expect(reader.i64()).toBe(0x0200_0000_0000_0000n)
            expect(reader.i64()).toBe(-1n)
        })
        test("be", () => {
            const reader = new SyncReader(new DataView(arr.buffer), 0, false)
            expect(reader.i64()).toBe(0x0100_0000_0000_0000n)
            expect(reader.i64()).toBe(0x02n)
            expect(reader.i64()).toBe(-1n)
        })
    })

    describe("zero terminated", () => {
        const arr = new Uint8Array(
            [[0x61, 0x62, 0x63, 0], [0], [0x61, 0x62, 0x63, 0]].flat(),
        )
        test("bytes", () => {
            const reader = new SyncReader(new DataView(arr.buffer))
            const bytes = new SyncReader(
                new DataView(reader.zeroTerminatedBytes()),
            )
            expect(bytes.dataView.buffer.byteLength).toEqual(3)
            expect(bytes.u8()).toEqual(0x61)
            expect(bytes.u8()).toEqual(0x62)
            expect(bytes.u8()).toEqual(0x63)
            // ---
            expect(reader.zeroTerminatedBytes().byteLength).toEqual(0)
            expect(reader.zeroTerminatedBytes().byteLength).toEqual(3)
            expect(reader.pointer).toEqual(9)
        })
        test("string", () => {
            const reader = new SyncReader(new DataView(arr.buffer))
            expect(reader.zeroTerminatedString()).toEqual("abc")
            expect(reader.zeroTerminatedString()).toEqual("")
            expect(reader.zeroTerminatedString()).toEqual("abc")
            expect(reader.pointer).toEqual(9)
        })
    })
})
