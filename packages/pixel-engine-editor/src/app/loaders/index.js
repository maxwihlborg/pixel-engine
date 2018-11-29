import Tileset from '../gfx/Tileset'

export const loadJson = path => fetch(path).then(res => res.json())

export const loadImage = src =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = err => reject(err)
    img.src = src
  })

export const loadTileset = async (path, startTile = 0) => {
  const data = await loadJson(path)
  const img = await loadImage(data.src)
  return new Tileset(img, data, startTile)
}
