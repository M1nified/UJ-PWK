class Generation {
  constructor() {
    this.shapes = []
  }
  addShape(shape) {
    this.shapes.push(shape)
    return this
  }
  addRandomShape() {
    let shape = new Shape(),
      rectsCount = Math.random() * 40
    shape.addInitialRect()
    for (let i = 0; i < rectsCount; i++) {
      shape.addRandomRect()
    }
    this.addShape(shape)
    return this
  }
  addRandomShapes(count) {
    for (let i = 0; i < count; i++) {
      this.addRandomShape()
    }
    return this
  }
  performSelection() {
    let marks = this.shapes.map(s => s.evaluate()),
      minMark = marks.sort()[Math.floor(0.3 * marks.length)]
    this.shapes = this.shapes.filter((s, i) => marks[i] >= minMark)
    return this
  }
  performCrossover() {
    return this
  }
  performMutation() {
    return this
  }
}

let evaluate = (data) => {
  console.log('evaluate', data)
  let distances = [],
    distancesMap = {},
    rects = data.slice(),
    avgs = [],
    avgPoint

  let symetryMark = 0,
    countMark = 0

  while (rects.length > 0) {
    let furthests = [],
      maxDistance = -1
    rects.forEach(r => {
      let group = r.findFurthestAll(rects),
        dist = group[0].distanceTo(r)
      if (dist > maxDistance) {
        maxDistance = dist
        furthests = [r, ...group]
      }
    })
    rects = rects.filter(r => {
      for (let i in furthests) {
        if (furthests[i].x == r.x && furthests[i].y == r.y)
          return false
      }
      return true
    })
    avgs.push(furthests[0].center.avg(furthests[1].center))
  }
  avgPoint = avgs.reduce((avg, point) => avg.avg(point), avgs[0])
  avgs.forEach(p => symetryMark -= p.distanceTo(avgPoint))
  symetryMark /= Math.sqrt(Math.pow(width, 2), Math.pow(height, 2))

  countMark = data.length / (width / 50 * height / 50)

  let spreadMark = 0
  let spreadPoints = {}
  DIRECTION_NAMES.forEach(directionName => spreadPoints[directionName] = 0)
  data.forEach(rect => {
    let direction = avgPoint.directionTo(rect.center)
    if (direction === null) return
    spreadPoints[direction] += avgPoint.distanceTo(rect.center) / 2
    console.log(rect.center, spreadPoints[direction])
  })
  spreadMark = Object.keys(spreadPoints).reduce((points, key) => points + spreadPoints[key], 0)
  spreadMark /= Math.sqrt(Math.pow(width, 2), Math.pow(height, 2)) * 8

  console.log(symetryMark, countMark, spreadMark)
  return symetryMark + countMark + spreadMark
}
