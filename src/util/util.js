export const getPercent = (current, max) => (100 * current) / max
export const getLeft = (percent, offset = 10) => `calc(${percent}% - ${offset}px)`