class Player {
	constructor (position) {
		this.position = position;
		this.nextPosition = new Position(0, 0);
		this.width = 64;
		this.height = 64;
		this.size = 32;
		this.speed = 10;
		this.hp = 100;
		this.alive = true;
		this.damaged = false;
		this.direction = 3;
		this.attacking = false;
		this.attackMagicNo = 0;
	}

	move(keyCode, CANVAS_WIDTH, CANVAS_HEIGHT, boss) {
		if (!this.attacking) {
			this.nextPosition.x = this.position.x;
			this.nextPosition.y = this.position.y;

			switch (keyCode) {
			case 37: // ←
				this.direction = 0;
				this.nextPosition.x = this.position.x - this.speed;

				var length = this.nextPosition.getDistance(boss.position).getLength();
				if (!boss.alive) length = 9999;

				if (this.nextPosition.x - this.size > 0 && length > player.size + boss.size) {
					this.position.x = this.nextPosition.x;
				}

				break;

			case 38: // ↑
				this.direction = 1;
				this.nextPosition.y = this.position.y - this.speed;

				var length = this.nextPosition.getDistance(boss.position).getLength();
				if (!boss.alive) length = 9999;

				if (this.nextPosition.y - this.size > 150 && length > player.size + boss.size) {
					this.position.y = this.nextPosition.y;
				}

				break;

			case 39: // →
				this.direction = 2;
				this.nextPosition.x = this.position.x + this.speed;

				var length = this.nextPosition.getDistance(boss.position).getLength();
				if (!boss.alive) length = 9999;

				if (this.nextPosition.x + this.size < CANVAS_WIDTH && length > player.size + boss.size) {
					this.position.x = this.nextPosition.x;
				}

				break;

			case 40: // ↓
				this.direction = 3;
				this.nextPosition.y = this.position.y + this.speed;

				var length = this.nextPosition.getDistance(boss.position).getLength();
				if (!boss.alive) length = 9999;

				if (this.nextPosition.y + this.size < CANVAS_HEIGHT && length > player.size + boss.size) {
					this.position.y = this.nextPosition.y;
				}

				break;
			}
		}
	}

	attackA(magic, updCount) {
		if (!this.attacking && updCount - magic.useTime >= magic.recastTime) {
			magic.position.x = this.position.x;
			magic.position.y = this.position.y;

			switch (this.direction) {
			case 0: // 左
				magic.position.x -= (this.size + magic.size);
				break;
			case 1: // 上
				magic.position.y -= (this.size + magic.size);
				break;
			case 2: // 右
				magic.position.x += (this.size + magic.size);
				break;
			case 3: // 下
				magic.position.y += (this.size + magic.size);
				break;
			}

			magic.alive = true;
			magic.useTime = updCount;
			this.attacking = true;
			this.attackMagicNo = magic.magicNo;
		}
	}

	attackS(magicInfo, updCount) {
		if (!this.attacking && updCount - magicInfo.useTime >= magicInfo.recastTime) {
			var magic = new LongDistanceMagic(2, new Position(this.position.x, this.position.y), 80, 80, 22, 15, 10, 0, 5);

			switch (this.direction) {
			case 0: // 左
				magic.position.x -= (this.size + magic.size - 10);
				magic.direction = 0;
				break;
			case 1: // 上
				magic.position.y -= (this.size + magic.size - 10);
				magic.direction = 1;
				break;
			case 2: // 右
				magic.position.x += (this.size + magic.size - 10);
				magic.direction = 2;
				break;
			case 3: // 下
				magic.position.y += (this.size + magic.size - 10);
				magic.direction = 3;
				break;
			}

			magic.alive = true;
			magicInfo.magicArray.push(magic);
			magicInfo.useTime = updCount;
			this.attacking = true;
			this.attackMagicNo = magic.magicNo;
		}
	}
}

class Enemy {
	constructor(position) {
		this.position = position;
		this.width = 64;
		this.height = 64;
		this.size = 25;
		this.power = 5;
		this.speed = 5;
		this.hp = 10;
		this.alive = false;
		this.damaged = false;
	}

	move(distance, player) {
		var length = distance.getLength();

		if (length > this.size + player.size - 15) {
			this.position.x += distance.x * 1 / length * this.speed;
			this.position.y += distance.y * 1 / length * this.speed;
		}
	}
}

class Boss {
	constructor(position) {
		this.position = position;
		this.nextPosition = new Position();
		this.width = 235;
		this.height = 110;
		this.size = 55;
		this.speed = 1;
		this.hp = 100;
		this.alive = false;
		this.damaged = false;
		this.attacking = false;
		this.moveClassX = 0;
		this.moveClassY = 0;
	}

	move(CANVAS_WIDTH, CANVAS_HEIGHT, player, updCountForBoss, FPS) {

		if (updCountForBoss % FPS == 0) {
			var randomX = Math.floor(Math.random() * 10);
			var randomY = Math.floor(Math.random() * 10);
			this.moveClassX = (randomX % 2 == 0) ? 0 : 1;
			this.moveClassY = (randomY % 2 == 0) ? 0 : 1;
		}

		this.nextPosition.x = (this.moveClassX == 0) ? this.position.x + this.speed : this.position.x - this.speed;
		this.nextPosition.y = (this.moveClassY == 0) ? this.position.y + this.speed : this.position.y - this.speed;

		var length = this.nextPosition.getDistance(player.position).getLength();

		if (this.nextPosition.x > boss.width / 2 && this.nextPosition.x < CANVAS_WIDTH - boss.width / 2
		 && length > player.size + boss.size) {
			this.position.x = this.nextPosition.x;
		}
		if (this.nextPosition.y > boss.height / 2 && this.nextPosition.y < CANVAS_HEIGHT - boss.height / 2
		 && length > player.size + boss.size) {
			this.position.y = this.nextPosition.y;
		}
	}

	attack(magic, updCount) {
		if (!this.attacking && updCount - magic.useTime >= magic.recastTime) {
			magic.position.x = this.position.x;
			magic.position.y = this.position.y;
			magic.useTime = updCount;
			this.attacking = true;
		}
	}
}

class Magic {
	constructor(magicNo, position, width, height, size, motionCount, power, recastTime) {
		this.magicNo = magicNo;
		this.position = position;
		this.width = width;
		this.height = height;
		this.size = size;
		this.alive = false;
		this.motion = 0;
		this.motionCount = motionCount;
		this.power = power;
		this.useTime = 0;
		this.recastTime = recastTime;
	}
}

class LongDistanceMagic extends Magic {
	constructor(magicNo, position, width, height, size, motionCount, power, recastTime, speed) {
		super(magicNo, position, width, height, size, motionCount, power, recastTime);
		this.speed = speed;
		this.direction = 0;
	}
	move(CANVAS_WIDTH, CANVAS_HEIGHT) {
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
		}

		if (this.position.x + this.width / 2 < 0 || this.position.x - this.width > CANVAS_WIDTH
		 || this.position.y + this.height / 2 < 0 || this.position.y - this.height > CANVAS_HEIGHT) {
			this.alive = false;
		}
	}
}

class LongDistanceMagicInfo {
	constructor(recastTime) {
		this.time = 5;
		this.useTime = 0;
		this.recastTime = recastTime;
		this.magicArray = new Array();
	}
}
