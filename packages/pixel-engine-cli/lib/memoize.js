const toJson = (...args) => JSON.stringify(args)

export default function memoize(fn, resolve = toJson) {
  const cache = {}
  return (...args) => {
    const key = resolve(...args)
    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(...args)
    }
    return cache[key]
  }
}
