export function clamp(min, max, val) {
    return (min <= val && val <= max) ? val : ((min > val) ? min : max);
}
