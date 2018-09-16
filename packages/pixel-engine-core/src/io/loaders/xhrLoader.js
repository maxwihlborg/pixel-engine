const xhrLoader = path =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = e => {
      if (xhr.status === 200) {
        resolve(e.response)
      } else {
        reject(new Error('None 200 status', e.response))
      }
    }
    xhr.onerror = err => reject(err)
    xhr.onabort = () => reject(new Error('Aborted'))
    xhr.open('GET', path, true)
    xhr.send(null)
  })

export default xhrLoader
