export const TO_RAD = 360 / (2 * Math.PI)
export const TO_DEG = 2 * Math.PI / 360

const math = {
  toRad(deg) {
    return deg * TO_RAD
  },
  toDeg(rad) {
    return rad * TO_DEG
  },
}

export default math
