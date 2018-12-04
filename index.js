"use strict";
class Display {
    constructor(data) {
        this.data = data;
        this.display = d3.select(".display")
            .attr("width", width)
            .attr("height", height)
            .on("click", (_, __, [svg, ...___]) => data.push(new Rect(d3.event.offsetX, d3.event.offsetY)) && this.refresh() && d3.select(svg).on("click", null));
        this.info = [];
        this.infoBox = d3.select(".info");
        this.generationInfoBox = d3.select(".generation-info");
    }
    setData(data) {
        this.data = data;
        return this;
    }
    setGeneration(generation) {
        this.generation = generation;
        return this;
    }
    updateGenerationInfo() {
        if (!this.generation)
            return this;
        let shapes = this.generationInfoBox
            .selectAll("p")
            .data(this.generation.shapes);
        shapes
            .exit()
            .remove();
        shapes
            .enter()
            .append("p")
            .attr("class", "shape")
            .text(s => "Shape: " + s.size + " Mark: " + s.evaluate())
            .on('click', (shape) => {
            this.data = shape.data;
            this.refresh();
        });
        shapes
            .transition()
            .text(s => "Shape: " + s.size + " Mark: " + s.evaluate());
        return this;
    }
    updateInfo() {
        let info = this.infoBox
            .selectAll("p")
            .data(this.info);
        info
            .exit()
            .remove();
        info
            .enter()
            .append("p");
        info
            .transition()
            .text(i => i.title + ":" + i.info);
        return this;
    }
    refresh() {
        let rect = this.display
            .selectAll("rect")
            .data(this.data);
        rect
            .exit()
            .remove();
        rect
            .enter()
            .append("rect")
            .attr("height", r => r.size)
            .attr("width", r => r.size)
            .attr("x", r => r.x)
            .attr("y", r => r.y)
            .attr("fill-opacity", ".95")
            .attr("stroke", "black")
            .on("click", (r, i, a) => {
            let mouseX = d3.event.layerX - r.x, mouseY = d3.event.layerY - r.y, newRect = null, halfSize = r.size / 2;
            if (mouseX > halfSize && mouseY < halfSize)
                newRect = transformations.ne(r);
            else if (mouseX > halfSize && mouseY > halfSize)
                newRect = transformations.se(r);
            else if (mouseX < halfSize && mouseY > halfSize)
                newRect = transformations.sw(r);
            else if (mouseX < halfSize && mouseY < halfSize)
                newRect = transformations.nw(r);
            newRect && this.data.push(newRect) && this.refresh();
        })
            .on("mouseover", r => {
            r.highlight = true;
            r.findFurthestAll(this.data).forEach(r => {
                r.highlight = true;
            });
            this.refresh();
        })
            .on("mouseout", r => {
            this.data.forEach(r => {
                r.highlight = false;
            });
            this.refresh();
        });
        rect
            .transition()
            .attr("x", r => r.x)
            .attr("y", r => r.y)
            .attr("fill-opacity", ".95")
            .attr("stroke", "black")
            .attr("fill", r => r.fill);
        return this;
    }
}
class Generation {
    constructor() {
        this.shapes = [];
    }
    addShape(shape) {
        this.shapes.push(shape);
        return this;
    }
    addRandomShape() {
        let shape = new Shape(), rectsCount = Math.random() * 40;
        shape.addInitialRect();
        for (let i = 0; i < rectsCount; i++) {
            shape.addRandomRect();
        }
        this.addShape(shape);
        return this;
    }
    addRandomShapes(count) {
        for (let i = 0; i < count; i++) {
            this.addRandomShape();
        }
        return this;
    }
    performSelection() {
        let marks = this.shapes.map(s => s.evaluate()), minMark = marks.sort()[Math.floor(0.3 * marks.length)];
        this.shapes = this.shapes.filter((s, i) => marks[i] >= minMark);
        return this;
    }
    performCrossover() {
        for (let i = 0; i < this.shapes.length / 2; i += 2) {
            const fst = this.shapes[i], snd = this.shapes[i + 1], fstMid = Math.floor(fst.size / 2), sndMid = Math.floor(snd.size / 2), fstRemoved = fst.splice(fstMid), sndRemoved = snd.splice(sndMid);
            fst.push(...sndRemoved);
            snd.push(...fstRemoved);
        }
        return this;
    }
    performMutation() {
        this.shapes.forEach(shape => {
            if (Math.random() < .1)
                shape.addRandomRect();
        });
        return this;
    }
    setRandomOrder() {
        const tmpShapes = this.shapes.splice(0);
        tmpShapes.forEach(shape => {
            if (Math.random() > .5)
                this.shapes.push(shape);
            else
                this.shapes.unshift(shape);
        });
    }
}
let evaluate = (data) => {
    console.log('evaluate', data);
    let distances = [], distancesMap = {}, rects = data.slice(), avgs = [], avgPoint;
    let symetryMark = 0, countMark = 0;
    while (rects.length > 0) {
        let furthests = [], maxDistance = -1;
        rects.forEach(r => {
            let group = r.findFurthestAll(rects), dist = group[0].distanceTo(r);
            if (dist > maxDistance) {
                maxDistance = dist;
                furthests = [r, ...group];
            }
        });
        rects = rects.filter(r => {
            for (let i in furthests) {
                if (furthests[i].x == r.x && furthests[i].y == r.y)
                    return false;
            }
            return true;
        });
        avgs.push(furthests[0].center.avg(furthests[1].center));
    }
    avgPoint = avgs.reduce((avg, point) => avg.avg(point), avgs[0]);
    avgs.forEach(p => symetryMark -= p.distanceTo(avgPoint));
    symetryMark /= Math.sqrt(Math.pow(width, 2), Math.pow(height, 2));
    countMark = data.length / (width / 50 * height / 50);
    let spreadMark = 0;
    let spreadPoints = {};
    DIRECTION_NAMES.forEach(directionName => spreadPoints[directionName] = 0);
    data.forEach(rect => {
        let direction = avgPoint.directionTo(rect.center);
        if (direction === null)
            return;
        spreadPoints[direction] += avgPoint.distanceTo(rect.center) / 2;
        console.log(rect.center, spreadPoints[direction]);
    });
    spreadMark = Object.keys(spreadPoints).reduce((points, key) => points + spreadPoints[key], 0);
    spreadMark /= Math.sqrt(Math.pow(width, 2), Math.pow(height, 2)) * 8;
    console.log(symetryMark, countMark, spreadMark);
    return symetryMark + countMark + spreadMark;
};
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distanceTo(p1) {
        let dist = Math.sqrt(Math.pow(this.x - p1.x, 2) +
            Math.pow(this.y - p1.y, 2));
        return dist;
    }
    avg(p1) {
        // console.log(p1, this, (p1.x + this.x) / 2, (p1.y + this.y) / 2)
        return new Point((p1.x + this.x) / 2, (p1.y + this.y) / 2);
    }
    findFurthest(points) {
        let dist = -1;
        return points.reduce((furthestPoint, point) => dist < this.distanceTo(point) ? point : furthestPoint, this);
    }
    findFurthestAll(points) {
        let furthest = this.findFurthest(points);
        let dist = this.distanceTo(furthest);
        return points.filter(point => dist == this.distanceTo(point));
    }
    directionTo(point) {
        let direction = null;
        if (point.x < this.x) {
            if (point.y > this.y)
                direction = "ne";
            else if (point.y < this.y)
                direction = "nw";
            else
                direction = "n";
        }
        else if (point.x > this.x) {
            if (point.y > this.y)
                direction = "se";
            else if (point.y < this.y)
                direction = "sw";
            else
                direction = "s";
        }
        else {
            if (point.y > this.y)
                direction = "e";
            else if (point.y < this.y)
                direction = "w";
        }
        return direction;
    }
}
class Rect {
    constructor(x, y, size = 50) {
        this.pos = new Point(x, y);
        this.size = size;
        this.highlight = false;
        this._fill = "white";
    }
    get x() {
        return this.pos.x;
    }
    get y() {
        return this.pos.y;
    }
    get centerX() {
        return this.x + Math.floor(this.size / 2);
    }
    get centerY() {
        return this.y + Math.floor(this.size / 2);
    }
    get center() {
        return new Point(this.centerX, this.centerY);
    }
    get fill() {
        return this.highlight ? "green" : this._fill;
    }
    distanceTo(rect) {
        return this.center.distanceTo(rect.center);
    }
    findFurthest(rects) {
        return rects.reduce(([dist, furthest], rect) => dist < this.distanceTo(rect) ? [this.distanceTo(rect), rect] : [dist, furthest], [-1, this])[1];
    }
    findFurthestAll(rects) {
        let furthest = this.findFurthest(rects);
        let dist = this.distanceTo(furthest);
        return rects.filter(rect => dist == this.distanceTo(rect));
    }
}
class Shape {
    constructor() {
        this.data = [];
    }
    get size() {
        return this.data.length;
    }
    addInitialRect() {
        this.data.push(new Rect(width / 2, height / 2));
        return this;
    }
    addRect(rect) {
        this.data.push(rect);
        return this;
    }
    addRandomRect() {
        if (this.data.length === 0) {
            this.addInitialRect();
            return this;
        }
        let transformationIndex = Math.floor(Math.random() * Object.keys(transformations).length), transformation = transformations[Object.keys(transformations)[transformationIndex]], rectToTransform = this.data[Math.floor(Math.random() * this.data.length)], newRect = transformation(rectToTransform);
        this.data.push(newRect);
        return this;
    }
    evaluate() {
        return evaluate(this.data);
    }
    splice(...args) {
        return this.data.splice(...args);
    }
    push(...args) {
        return this.data.push(...args);
    }
    unshift(...args) {
        return this.data.unshift(...args);
    }
}
const transformations = {
    "ne": rect0 => new Rect(rect0.centerX, rect0.centerY - rect0.size, rect0.size),
    "se": rect0 => new Rect(rect0.centerX, rect0.centerY, rect0.size),
    "sw": rect0 => new Rect(rect0.centerX - rect0.size, rect0.centerY, rect0.size),
    "nw": rect0 => new Rect(rect0.centerX - rect0.size, rect0.centerY - rect0.size, rect0.size)
};
const width = 700, height = 700;
const DIRECTIONS = {
    "n": 0,
    "ne": 1,
    "e": 2,
    "se": 3,
    "s": 4,
    "sw": 5,
    "w": 6,
    "nw": 7,
}, DIRECTION_NAMES = Object.keys(DIRECTIONS);
let shape1 = new Shape();
let data = shape1.data;
let display = new Display(shape1.data);
let generation = new Generation();
display.setGeneration(generation);
generation.addRandomShapes(10);
display.updateGenerationInfo();
// data.push(new Rect(100, 100))
display.refresh();
document.querySelectorAll(".btn-undo").forEach(btn => btn.addEventListener("click", () => data.length - 1 && data.pop() && display.refresh()));
document.querySelectorAll(".btn-evaluate").forEach(btn => btn.addEventListener("click", () => {
    let mark = evaluate(data);
    display.info = [{
            title: "mark",
            info: mark
        }];
    display.updateInfo();
}));
document.querySelectorAll(".btn-generation-add").forEach(btn => btn.addEventListener("click", () => {
    generation.addRandomShape();
    display.updateGenerationInfo();
}));
document.querySelectorAll(".btn-generation-selection").forEach(btn => btn.addEventListener("click", () => {
    generation.performSelection();
    display.updateGenerationInfo();
}));
document.querySelectorAll(".btn-generation-crossover").forEach(btn => btn.addEventListener("click", () => {
    generation.performCrossover();
    display.updateGenerationInfo();
}));
document.querySelectorAll(".btn-generation-mutation").forEach(btn => btn.addEventListener("click", () => {
    generation.performMutation();
    display.updateGenerationInfo();
}));
document.querySelectorAll(".btn-generation-randomorder").forEach(btn => btn.addEventListener("click", () => {
    generation.setRandomOrder();
    display.updateGenerationInfo();
}));
//# sourceMappingURL=index.js.map