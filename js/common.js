function Position() {
	this.x = 0;
	this.y = 0;
}

Position.prototype.getDistance = function(p) {
	var d = new Distance();
	d.x = p.x - this.x;
	d.y = p.y - this.y;
	return d;
};

function Distance() {
	this.x = 0;
	this.y = 0;
}

Distance.prototype.getLength = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
}