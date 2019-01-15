class Generation {
  constructor() {
    this.shapes = []
    this.prevGenShapes = []
    this.generationSize = 10
    this.evolutionStepsCount = 0
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
    const
      marks = this.shapes.map(s => s.evaluate()),
      minMark = marks.sort()[Math.floor(0.3 * marks.length)],
      initialCount = this.shapes.length
    this.shapes = this.shapes.filter((s, i) => marks[i] >= minMark)
    let prevGenCpy = this.shapes.slice().sort((a, b) => a.evaluate() - b.evaluate())
    while (this.shapes.length < this.generationSize) {
      if (prevGenCpy.length > 0) {
        this.shapes.push(prevGenCpy.shift())
      } else {
        this.addRandomShape()
      }
    }
    return this
  }
  performCrossover() {
    for (let i = 0; i < this.shapes.length / 2; i += 2) {
      const fst = this.shapes[i],
        snd = this.shapes[i + 1],
        fstMid = Math.floor(fst.size / 2),
        sndMid = Math.floor(snd.size / 2),
        fstRemoved = fst.splice(fstMid),
        sndRemoved = snd.splice(sndMid)
      fst.push(...sndRemoved)
      snd.push(...fstRemoved)
    }
    return this
  }
  performMutation() {
    this.shapes.forEach(shape => {
      if (Math.random() < .1)
        shape.addRandomRect()
    })
    return this
  }
  performEvolutionStep() {
    this
      .performSelection()
      .performCrossover()
      .performMutation()
      .setRandomOrder()
      .generationComplete()
      .clearShapes()
    this.evolutionStepsCount++
    return this
  }
  generationComplete() {
    this.prevGenShapes = this.shapes.slice()
    return this
  }
  setRandomOrder() {
    const tmpShapes = this.shapes.splice(0)
    tmpShapes.forEach(shape => {
      if (Math.random() > .5)
        this.shapes.push(shape)
      else
        this.shapes.unshift(shape)
    })
    return this
  }
  clearShapes() {
    this.shapes.forEach(shape => shape.removeDuplicates())
    return this
  }
  areAllShapesTheSame() {
    console.log('aasts')
    for(let i = 1; i < this.shapes.length; i++) {
      if(!this.shapes[i].equals(this.shapes[i-1]))
        return false
    }
    return true
  }
}

let evaluate = (data) => {
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
    // console.log(rect.center, spreadPoints[direction])
  })
  spreadMark = Object.keys(spreadPoints).reduce((points, key) => points + spreadPoints[key], 0)
  spreadMark /= Math.sqrt(Math.pow(width, 2), Math.pow(height, 2)) * 8

  // console.log(symetryMark, countMark, spreadMark)
  return symetryMark + countMark + spreadMark
}
