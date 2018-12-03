class Shape {
  constructor() {
    this.data = []
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
}
