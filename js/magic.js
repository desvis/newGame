class Magic {
	constructor() {
		this.magicNo;
		this.position;
		this.width;
		this.height;
		this.size;
		this.alive = false;
		this.motion = 0;
		this.motionCount;
		this.power;
		this.useTime = 0;
		this.recastTime;
		this.useMp;
	}
}

class LongDistanceMagicInfo {
	constructor() {
		this.useMp = 0;
		this.time = 0;
		this.useTime = 0;
		this.recastTime = 0;
		this.magicArray = new Array();
	}
}

class LongDistanceMagic extends Magic {
	constructor() {
		super();
		this.speed;
		this.direction = 0;
		this.directionX = 0;
		this.directionY = 0;
	}

	move() {
		switch (this.direction) {
		case 0: // 左
			this.position.x -= this.speed;
			break;
		case 1: // 上
			this.position.y -= this.speed;
			break;
		case 2: // 右
			this.position.x += this.speed;
			break;
		case 3: // 下
			this.position.y += this.speed;
			break;
		case 4:
			this.position.x += this.directionX * this.speed;
			this.position.y += this.directionY * this.speed;
			break;
		}

		var coCanvas = checkCollisionCanvas2(this);

		if (coCanvas) {
			this.alive = false;
		}
	}
}
