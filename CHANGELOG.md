# CHANGELOG

## 0.2.0

- no copy 系メソッドを実装
    - SyncReader#bytesNoCopy
    - SyncReader#zeroTerminatedBytesNoCopy
    - これらのメソッドは byteOffset と byteLength で ArrayBuffer から切り出すので高速ですが、以下の注意点があります
        - `.buffer`でそのまま ArrayBuffer を切り出すと不正確な結果になります
        - 得た `Uint8Array` を上書きすると予期せぬ結果になる可能性があります
- `SyncReader` のコンストラクタに DataView だけではなく Uint8Array と ArrayBuffer が渡せるようになりました
- Deno サポートを削除

## 0.1.4
- SyncReader.i64() のパフォーマンスを若干改善

## 0.1.3

- BigIntリテラルを使わないように
    - BigIntが実装されていない環境(e.g. Safari)でも 64bit integer 以外の機能は使えるようになりました

## 0.1.2

-   Add `SyncReader#skip`
-   Create CHANGELOG.md

## 0.1.1

-   Add `SyncReader#u24` / `SyncReader#i24`

## 0.1.0

First Release
