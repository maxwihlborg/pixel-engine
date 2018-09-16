import jsonLoader from './jsonLoader'
import imageLoader from './imageLoader'
import xhrLoader from './xhrLoader'

const extensionLoader = path => {
  const extension = String(path.split('.').pop())
    .toLowerCase()
    .trim()

  switch (extension) {
    case 'png':
    case 'jpeg':
    case 'jpg':
    case 'gif':
    case 'webp':
    case 'svg':
      return imageLoader(path)

    case 'json':
      return jsonLoader(path)

    case 'txt':
      return xhrLoader(path)
  }

  return Promise.reject(new Error(`No loader for extension: ${extension}`))
}

export default extensionLoader
