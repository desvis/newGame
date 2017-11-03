class Enemy {
	constructor() {
		this.position;
		this.width;
		this.height;
		this.size;
		this.power;
		this.speed;
		this.maxHp;
		this.hp;
		this.alive = false;
		this.attacking = false;
		this.damaged = false;
	}
}

class Bat extends Enemy {
	constructor() {
		super();
		this.attackUpdateCount = 0;
	}

	move(player, distanceOfPlayer) {
		var length = distanceOfPlayer.getLength();

		if (distanceOfPlayer.getLength() > this.size + player.size) {
			this.position.x += distanceOfPlayer.x * (1 / length) * this.speed;
			this.position.y += distanceOfPlayer.y * (1 / length) * this.speed;
		}
	}
}

class Skeleton extends Enemy {
	constructor(type) {
		super();
		this.nextPosition = new Position(0, 0);
		this.ready = false;
		this.type = type;
		this.stopping = false;
		this.attackUpdateCount = 0;
	}

	move(player, skeletons, i, boss) {
		if (!this.stopping) {
			this.nextPosition.x = this.position.x;
			this.nextPosition.y = this.position.y;

			if (this.ready) {
				var distanceOfPlayer = this.position.getDistance(player.position);

				var length = distanceOfPlayer.getLength();
				if (length < 200) {
					this.type = 2;
				} else {
					if (this.type == 2) {
						this.type = (getRandom() % 2 == 0) ? 0 : 1;
					}
				}

				switch (this.type) {
				case 0:
					this.nextPosition.x += this.speed;
					if (this.nextPosition.x + this.width / 2 >= CANVAS_WIDTH) {
						this.type = 1;
					}
					break;
				case 1:
					this.nextPosition.x -= this.speed;
					if (this.nextPosition.x - this.width / 2 <= 0) {
						this.type = 0;
					}
					break;
				case 2:
					this.nextPosition.x += distanceOfPlayer.x * (1 / length) * this.speed;
					this.nextPosition.y += distanceOfPlayer.y * (1 / length) * this.speed;
					break;
				}

				var collisionCanvas = checkCollisionCanvas(this);
				var collisionChar = this._checkCollisionChar(player, skeletons, i, boss);

				if (!collisionCanvas && !collisionChar) {
					this.position.x = this.nextPosition.x;
					this.position.y = this.nextPosition.y;
				}
			} else {
				switch (this.type) {
				case 0:
					this.nextPosition.x += this.speed;
					if (this.nextPosition.x >= 100) {
						this.ready = true;
					}
					break;
				case 1:
					this.nextPosition.x -= this.speed;
					if (this.nextPosition.x <= 700) {
						this.ready = true;
					}
					break;
				}

				var collisionChar = this._checkCollisionChar(player, skeletons, i, boss);

				if (!collisionChar) {
					this.position.x = this.nextPosition.x;
					this.position.y = this.nextPosition.y;
				}
			}
		}
	}

	_checkCollisionChar(player, skeletons, i, boss) {
		var coPlayer = checkCollisionObj(this, player);

		var coSkeleton = false;
		for (var j = 0; j < skeletons.length; j++) {
			if (j != i) coSkeleton = checkCollisionObj(this, skeletons[j]);
			if (coSkeleton) {
				this.type = (this.type == 0) ? 1 : 0;
				break; 
			}
		}

		var coBoss = checkCollisionObj(this, boss);
		if (coBoss) {
			this.type = (this.type == 0) ? 1 : 0;
		}

		if (coPlayer || coSkeleton || coBoss) {
			return true;
		}

		return false;
	}
}

class Boss extends Enemy {
	constructor() {
		super();
		this.nextPosition = new Position(0, 0);
		this.aliveUpdateCount = 0;
		this.ready = false;
		this.type = 0;
		this.typeX = 0;
		this.typeY = 0;
		this.attackType = 0;
	}

	move(player, skeletons) {
		this.nextPosition.x = this.position.x;
		this.nextPosition.y = this.position.y;

		if (this.ready) {
			if (this.type == 0) {
				if (this.aliveUpdateCount % (FPS * 2) == 0) {
					this.typeX = (getRandom() % 2 == 0) ? 0 : 1;
					this.typeY = (getRandom() % 2 == 0) ? 0 : 1;
				}
			}

			switch (this.type) {
			case 0:
				this.nextPosition.x = (this.typeX == 0) ? this.position.x + this.speed : this.position.x - this.speed;
				this.nextPosition.y = (this.typeY == 0) ? this.position.y + this.speed : this.position.y - this.speed;
				break;
			}

			var collisionCanvas = checkCollisionCanvas(this);
			var collisionChar = this._checkCollisionChar(player, skeletons);

			if (!collisionCanvas && !collisionChar) {
				this.position.x = this.nextPosition.x;
				this.position.y = this.nextPosition.y;
			}
		} else {
			this.nextPosition.y += this.speed;

			if (this.nextPosition.y > 150) {
				this.ready = true;
			}

			var collisionChar = this._checkCollisionChar(player, skeletons);

			if (!collisionChar) {
				this.position.x = this.nextPosition.x;
				this.position.y = this.nextPosition.y;
			}
		}
	}

	_checkCollisionChar(player, skeletons) {
		var coPlayer = checkCollisionObj(this, player);

		var coSkeleton = false;
		for (var i = 0; i < skeletons.length; i++) {
			coSkeleton = checkCollisionObj(this, skeletons[i]);
			if (coSkeleton) break;
		}

		if (coPlayer || coSkeleton) {
			return true;
		}

		return false;
	}

	attack(bossMagics, player, updCount) {
		var distanceOfPlayer = this.position.getDistance(player.position);
		var length = distanceOfPlayer.getLength();
		this.attackType = (length < this.size + player.size + 100) ? 1 : 0;

		switch (this.attackType) {
		case 0:
			if (updCount % (FPS * 2) == 0) {
				var magic = new LongDistanceMagic();
				magic.magicNo = 91;
				magic.position = new Position(this.position.x, this.position.y);
				magic.width = 80;
				magic.height = 80;
				magic.size = 22;
				magic.motionCount = 15;
				magic.power = 10;
				magic.speed = 5;
				magic.alive = true;
				magic.direction = 4;

				magic.directionX = distanceOfPlayer.x * (1 / length);
				magic.directionY = distanceOfPlayer.y * (1 / length);

				bossMagics[0].magicArray.push(magic);
			}

			break;

		case 1:
			if (updCount % (FPS * 3) == 0) {
				var magic = bossMagics[1];
				magic.position.x = this.position.x;
				magic.position.y = this.position.y;
				magic.alive = true;
			}

			break;
		}
	}
}