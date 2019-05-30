import Hex from '@/scripts/hex.js';

export default class Hexmap {
  title = 'hexmap'
  hexes = []

  constructor (xOffset, yOffset, size, hCount, vCount) {
    let width = size * Math.sqrt(3);
    let height = size * 3 / 2;

    for (let k = 0; k <= vCount; k++) {
      for (let i = 0; i <= -k % 2 + hCount; i++) {
        this.hexes.push(Hex.getCorners({
          x: xOffset + i * width + k % 2 * width / 2,
          y: yOffset + k * height
        }, size));
      }
    }
  }
}
