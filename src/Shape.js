class Shape {
  constructor(data = []) {
    this.data = data
  }
  get size() {
    return this.data.length
  }
  addInitialRect() {
    this.data.push(new Rect(width / 2, height / 2))
    return this
  }
  addRect(rect) {
    this.data.push(rect)
    return this
  }
  addRandomRect() {
    if (this.data.length === 0) {
      this.addInitialRect()
      return this
    }
    let transformationIndex = Math.floor(Math.random() * Object.keys(transformations).length),
      transformation = transformations[Object.keys(transformations)[transformationIndex]],
      rectToTransform = this.data[Math.floor(Math.random() * this.data.length)],
      newRect = transformation(rectToTransform)
    this.data.push(newRect)
    return this
  }
  evaluate() {
    return evaluate(this.data)
  }
  splice(...args) {
    return this.data.splice(...args)
  }
  push(...args) {
    return this.data.push(...args)
  }
  unshift(...args) {
    return this.data.unshift(...args)
  }
  removeDuplicates() {
    this.data = this.data.sort((a, b) => {
      if (a.x === b.x) {
        return a.y - b.y
      } else {
        return a.x - b.x
      }
    })
    let prev = this.data[this.data.length - 1]
    for (let i = this.data.length - 2; i >= 0; i--) {
      const rect = this.data[i]
      if (rect.x === prev.x && rect.y === prev.y) {
        this.data.splice(i++, 1)
      } else {
        prev = rect
      }
      if (i >= this.data.length) {
        i = this.data.length
      }
    }
    return this
  }
  equals(shape){
    if(this.data.length !== shape.data.length)
      return false
    const 
      sortF = (a,b) => {
        if(a.x === b.x)
          return a.y - b.y
        else
          return a.x - b.x
      },
      aData = this.data.sort(sortF),
      bData = shape.data.sort(sortF)
    for(let i = 0; i < aData.length; i++) {
      if(aData[i].x !== bData[i].x || aData[i].y !== bData[i].y)
        return false
    }
    return true
  }
  findCenter() {
    let 
      distances = [],
      distancesMap = {},
      rects = this.data.slice(),
      avgs = [],
      avgPoint

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
    return avgPoint
  }
}

