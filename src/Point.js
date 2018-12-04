class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distanceTo(p1) {
    let dist = Math.sqrt(
      Math.pow(this.x - p1.x, 2) +
      Math.pow(this.y - p1.y, 2))
    return dist
  }
  avg(p1) {
    // console.log(p1, this, (p1.x + this.x) / 2, (p1.y + this.y) / 2)
    return new Point(
      (p1.x + this.x) / 2,
      (p1.y + this.y) / 2
    )
  }
  findFurthest(points) {
    let dist = -1
    return points.reduce((furthestPoint, point) => dist < this.distanceTo(point) ? point : furthestPoint, this)
  }
  findFurthestAll(points) {
    let furthest = this.findFurthest(points)
    let dist = this.distanceTo(furthest)
    return points.filter(point => dist == this.distanceTo(point))
  }
  directionTo(point) {
    let direction = null
    if (point.x < this.x) {
      if (point.y > this.y)
        direction = "ne"
      else if (point.y < this.y)
        direction = "nw"
      else
        direction = "n"
    } else if (point.x > this.x) {
      if (point.y > this.y)
        direction = "se"
      else if (point.y < this.y)
        direction = "sw"
      else
        direction = "s"
    } else {
      if (point.y > this.y)
        direction = "e"
      else if (point.y < this.y)
        direction = "w"
    }
    return direction
  }
}
