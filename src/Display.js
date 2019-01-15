class Display {
  constructor(data) {
    this.data = data
    this.display = d3.select(".display")
      .attr("width", width)
      .attr("height", height)
      .on("click", (_, __, [svg, ...___]) => data.push(new Rect(d3.event.offsetX, d3.event.offsetY)) && this.refresh() && d3.select(svg).on("click", null))
    this.info = []
    this.infoBox = d3.select(".info")
    this.generationInfoBox = d3.select(".generation-info")
    this.generationCounter = d3.select(".generation-info-counter")
  }
  setData(data) {
    this.data = data
    return this
  }
  setGeneration(generation) {
    this.generation = generation
    return this
  }
  updateGenerationInfoCounter() {
    if (!this.generation) return this

    let counter = this.generationCounter
    counter.text("Generation No.: " + this.generation.evolutionStepsCount)
  }
  updateGenerationInfo() {
    if (!this.generation) return this

    this.updateGenerationInfoCounter()

    let shapes = this.generationInfoBox
      .selectAll("p")
      .data(this.generation.shapes.sort((a,b) => -1 * (a.evaluate() - b.evaluate())))
    shapes
      .exit()
      .remove()
    shapes
      .enter()
      .append("p")
      .attr("class", "shape")
      .text((s, i) => `Shape ${i + 1}, rectangles: ${s.size}, mark: ${s.evaluate()}`)
      .on('click', (shape) => {
        this.data = shape.data
        this.refresh()
      })
    shapes
      .transition()
      .text((s, i) => `Shape ${i + 1}, rectangles: ${s.size}, mark: ${s.evaluate()}`)
    return this
  }
  updateInfo() {
    let info = this.infoBox
      .selectAll("p")
      .data(this.info)
    info
      .exit()
      .remove()
    info
      .enter()
      .append("p")
    info
      .transition()
      .text(i => i.title + ":" + i.info)
    return this
  }
  refresh() {      
    const rect = this.display
      .selectAll("rect")
      .data(this.data)
    rect
      .exit()
      .remove()
    rect
      .enter()
      .append("rect")
      .attr("height", r => r.size)
      .attr("width", r => r.size)
      .attr("x", r => r.x)
      .attr("y", r => r.y)
      .attr("fill-opacity", ".5")
//      .attr("fill-opacity", ".95")
      .attr("stroke", "black")
      .on("click", (r, i, a) => {
        let mouseX = d3.event.layerX - r.x,
          mouseY = d3.event.layerY - r.y,
          newRect = null,
          halfSize = r.size / 2
        if (mouseX > halfSize && mouseY < halfSize)
          newRect = transformations.ne(r)
        else if (mouseX > halfSize && mouseY > halfSize)
          newRect = transformations.se(r)
        else if (mouseX < halfSize && mouseY > halfSize)
          newRect = transformations.sw(r)
        else if (mouseX < halfSize && mouseY < halfSize)
          newRect = transformations.nw(r)
        newRect && this.data.push(newRect) && this.refresh()
      })
      .on("mouseover", r => {
        r.highlight = true
        r.findFurthestAll(this.data).forEach(r => {
          r.highlight = true
        })
        this.refresh()
      })
      .on("mouseout", r => {
        this.data.forEach(r => {
          r.highlight = false
        })
        this.refresh()
      })
    rect
      .transition()
      .attr("x", r => r.x)
      .attr("y", r => r.y)
      .attr("stroke", "black")
      .attr("fill", r => r.fill)
      
    
    const 
      centerPoint = (new Shape(this.data)).findCenter(),
      center = this.display
        .selectAll("circle")
        .data([centerPoint])
    if(centerPoint) {
      center
        .data([])
        .exit()
        .remove()
      center
        .data([centerPoint])
      center
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", c => c.x)
        .attr("cy", c => c.y)
        .attr("fill", "red")
      center
        .transition()
        .attr("r", 3)
        .attr("cx", c => c.x)
        .attr("cy", c => c.y)
        .attr("fill", "red")    
    }
    return this
  }
}
