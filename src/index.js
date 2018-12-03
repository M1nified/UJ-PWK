
const width = 700,
  height = 700

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
}))
document.querySelectorAll(".btn-generation-selection").forEach(btn => btn.addEventListener("click", () => {
  generation.performSelection()
  display.updateGenerationInfo()
}))
