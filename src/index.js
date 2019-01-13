
const width = 900,
  height = 900

const DIRECTIONS = {
  "n": 0,
  "ne": 1,
  "e": 2,
  "se": 3,
  "s": 4,
  "sw": 5,
  "w": 6,
  "nw": 7,
},
  DIRECTION_NAMES = Object.keys(DIRECTIONS)

let shape1 = new Shape()

let data = shape1.data
let display = new Display(shape1.data)
let generation = new Generation()
display.setGeneration(generation)
generation.addRandomShapes(10)
display.updateGenerationInfo()
// data.push(new Rect(100, 100))

const dynamicDisplay = new DynamicDisplay(generation)
dynamicDisplay
  .setBigScreen(display)
  .refresh()

display.refresh()

document.querySelectorAll(".btn-undo").forEach(btn => btn.addEventListener("click", () => data.length - 1 && data.pop() && display.refresh()))
document.querySelectorAll(".btn-evaluate").forEach(btn => btn.addEventListener("click", () => {
  let mark = evaluate(data)
  display.info = [{
    title: "mark",
    info: mark
  }]
  display.updateInfo()
}))
document.querySelectorAll(".btn-generation-add").forEach(btn => btn.addEventListener("click", () => {
  generation.addRandomShape()
  display.updateGenerationInfo()
  dynamicDisplay.refresh();
}))
document.querySelectorAll(".btn-generation-selection").forEach(btn => btn.addEventListener("click", () => {
  generation.performSelection()
  display.updateGenerationInfo()
  dynamicDisplay.refresh()
}))
document.querySelectorAll(".btn-generation-crossover").forEach(btn => btn.addEventListener("click", () => {
  generation.performCrossover()
  display.updateGenerationInfo()
  dynamicDisplay.refresh()
}))
document.querySelectorAll(".btn-generation-mutation").forEach(btn => btn.addEventListener("click", () => {
  generation.performMutation()
  display.updateGenerationInfo()
  dynamicDisplay.refresh()
}))
document.querySelectorAll(".btn-generation-randomorder").forEach(btn => btn.addEventListener("click", () => {
  generation.setRandomOrder()
  display.updateGenerationInfo()
  dynamicDisplay.refresh()
}))
document.querySelectorAll(".btn-evolution-animation-start").forEach(btn => btn.addEventListener("click", () => {
  animation.start()
}))
document.querySelectorAll(".btn-evolution-animation-stop").forEach(btn => btn.addEventListener("click", () => {
  animation.stop()
}))

const animation = (new function Animation() {
  this.running = false
  this.start = function () {
    if (!this.running) {
      this.running = true
      animate()
    }
  }
  this.stop = function () {
    this.running = false
  }
  const animate = (timestamp) => {
    const singleAnimation = () => {
      generation.performEvolutionStep()
      dynamicDisplay.refresh()
      display.updateGenerationInfoCounter()
      if (this.running)
        requestAnimationFrame(animate)
      else {
        display.updateGenerationInfo()
      }
    }
    singleAnimation()
  }
  return this
}())


