function checkCollisionCanvas(obj) {
	if (obj.nextPosition.x - obj.width / 2 <= 0 || obj.nextPosition.x + obj.width / 2 >= CANVAS_WIDTH
	 || obj.nextPosition.y - obj.height / 2 <= 0 || obj.nextPosition.y + obj.height / 2 >= CANVAS_HEIGHT) {
		return true;
	}

	return false;
}

function checkCollisionCanvas2(obj) {
	if (obj.position.x + obj.width / 2 < 0 || obj.position.x - obj.width > CANVAS_WIDTH
	 || obj.position.y + obj.height / 2 < 0 || obj.position.y - obj.height > CANVAS_HEIGHT) {
		return true;
	}

	return false;
}

function checkCollisionObj(obj1, obj2) {
	var length = obj1.nextPosition.getDistance(obj2.position).getLength();

	if (length <= obj1.size + obj2.size) {
		return true;
	}

	return false;
}

function drawCollisionRange(obj) {
	ctx.beginPath();
	ctx.arc(obj.position.x, obj.position.y, obj.size, 0, Math.PI * 2, false);
	ctx.stroke();
}