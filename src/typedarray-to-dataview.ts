export function typedArrayToDataView(view: ArrayBufferView): DataView {
    return new DataView(view.buffer, view.byteOffset, view.byteLength)
}
