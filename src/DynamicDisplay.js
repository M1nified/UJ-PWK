class DynamicDisplay {
	constructor(generation) {
		this.setGeneration(generation)
		this.display = d3.select(".display-dynamic")
		this.scale = 1 / 10
	}
	setData(data) {
		this.data = data
		return this
	}
	setGeneration(generation) {
		this.generation = generation
		return this
	}
	setBigScreen(bigScreen) {
		this.bigScreen = bigScreen
		return this
	}
	refresh() {
		const fillShapeSvg = (shape, i, shapes) => {
			const svg = d3
				.select(shapes[i])
			const rect = svg
				.selectAll("rect")
				.data(shape.data)
			rect
				.exit()
				.remove()
			rect
				.enter()
				.append("rect")
				.attr("height", r => r.size * this.scale)
				.attr("width", r => r.size * this.scale)
				.attr("x", r => r.x * this.scale)
				.attr("y", r => r.y * this.scale)
				.attr("fill-opacity", ".95")
				.attr("stroke", "black")
			rect
				.transition()
				.attr("height", r => r.size * this.scale)
				.attr("width", r => r.size * this.scale)
				.attr("x", r => r.x * this.scale)
				.attr("y", r => r.y * this.scale)
		}
		const shape = this.display
			.selectAll(".shape")
			.data(this.generation.shapes)
		shape
			.exit()
			.remove()
		shape
			.enter()
			.append("svg")
			.attr("width", 1000 * this.scale)
			.attr("height", 1000 * this.scale)
			.attr("class", "shape")
			.each(fillShapeSvg)
			.on('click', shape => {
				this.bigScreen
					.setData(shape.data)
					.refresh()
			})
		shape
			.transition()
			.each(fillShapeSvg)
	}
}
