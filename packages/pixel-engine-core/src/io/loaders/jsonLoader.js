import xhrLoader from './xhrLoader'

const jsonLoader = path =>
  xhrLoader(path).then(res => {
    try {
      return JSON.parse(res)
    } catch (e) {
      throw new Error('could not parse json')
    }
  })

export default jsonLoader
