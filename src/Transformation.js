const transformations = {
  "ne": rect0 => new Rect(rect0.centerX, rect0.centerY - rect0.size, rect0.size),
  "se": rect0 => new Rect(rect0.centerX, rect0.centerY, rect0.size),
  "sw": rect0 => new Rect(rect0.centerX - rect0.size, rect0.centerY, rect0.size),
  "nw": rect0 => new Rect(rect0.centerX - rect0.size, rect0.centerY - rect0.size, rect0.size)
}
