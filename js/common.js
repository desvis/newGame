// - const -------------------------------------------------------------------
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FPS = 30;

// - class -------------------------------------------------------------------
class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;	
	}
	getDistance(position) {
		var d = new Distance();
		d.x = position.x - this.x;
		d.y = position.y - this.y;
		return d;
	}
}

class Distance {
	constructor() {
		this.x = 0;
		this.y = 0;
	}
	getLength() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}

// - function -----------------------------------------------------------------
function getRandom() {
	return Math.floor(Math.random() * 10);
}