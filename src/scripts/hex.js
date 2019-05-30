export default class Hex {
  static getCorners (center, size) {
    let corners = [];
    for (let i = 0; i < 6; i++) corners[i] = Hex.getCornerFor(center, size, i);

    return corners;
  }

  static getCornerFor (center, size, i) {
    let angleDeg = 60 * i - 30;
    let angleRad = Math.PI / 180 * angleDeg;
    return {
      x: center.x + size * Math.cos(angleRad),
      y: center.y + size * Math.sin(angleRad)
    };
  }
}
