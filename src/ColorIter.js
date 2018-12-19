import {valueToColor} from "./Color"

export default function* colorIter(offset = 1) {
    let value = offset
    while (value < 0xffffff) {
        yield valueToColor(value)
        value += 1
    }
    throw 'max color range exceeded'
}
