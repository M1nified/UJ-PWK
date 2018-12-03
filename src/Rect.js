class Rect {
  constructor(x, y, size = 50) {
    this.pos = new Point(x, y)
    this.size = size
    this.highlight = false
    this._fill = "white"
  }
  get x() {
    return this.pos.x
  }
  get y() {
    return this.pos.y
  }
  get centerX() {
    return this.x + Math.floor(this.size / 2)
  }
  get centerY() {
    return this.y + Math.floor(this.size / 2)
  }
  get center() {
    return new Point(
      this.centerX,
      this.centerY
    )
  }
  get fill() {
    return this.highlight ? "green" : this._fill
  }
  distanceTo(rect) {
    return this.center.distanceTo(rect.center)
  }
  findFurthest(rects) {
    return rects.reduce(([dist, furthest], rect) => dist < this.distanceTo(rect) ? [this.distanceTo(rect), rect] : [dist, furthest], [-1, this])[1]
  }
  findFurthestAll(rects) {
    let furthest = this.findFurthest(rects)
    let dist = this.distanceTo(furthest)
    return rects.filter(rect => dist == this.distanceTo(rect))
  }
}
