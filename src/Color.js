const MAX_COLOR = 0xffffff
const BASE_R    = 0x010000
const BASE_G    = 0x000100
const BASE_B    = 0x000001
const NO_COLOR  = 0x000000

export function valueToColor(value) {
    const r = Math.floor(value / BASE_R)
    let rest = value % BASE_R
    const g = Math.floor(rest / BASE_G)
    rest = value % BASE_G
    const b = Math.floor(rest)
    return [r, g, b]
}

export function colorToValue(r, g, b) {
    return r * BASE_R + g * BASE_G + b * BASE_B
}