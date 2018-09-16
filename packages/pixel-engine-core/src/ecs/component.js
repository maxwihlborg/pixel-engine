export default function component(name, data) {
  if (typeof data === 'undefined') {
    return data => ({
      name: name,
      data: data,
    })
  }
  if (typeof data === 'function') {
    return (...args) => ({
      name: name,
      data: data(...args),
    })
  }
  return () => ({
    name: name,
    data: data,
  })
}
