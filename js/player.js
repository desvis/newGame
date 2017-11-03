class Player {
	constructor (position) {
		this.position = position;
		this.nextPosition = new Position(0, 0);
		this.width = 64;
		this.height = 64;
		this.size = 32;
		this.speed = 10;
		this.maxHp = 100;
		this.hp = 100;
		this.maxMp = 100;
		this.mp = 100;
		this.alive = true;
		this.damaged = false;
		this.direction = 3;
		this.attacking = false;
		this.attackMagicNo = 0;
	}

	move(keyCode, skeletons, boss) {
		if (!this.attacking) {
			this.nextPosition.x = this.position.x;
			this.nextPosition.y = this.position.y;

			switch (keyCode) {
			case 37: // ←
				this.direction = 0;
				this.nextPosition.x = this.position.x - this.speed;

				var collisionChar = this._checkCollisionChar(skeletons, boss);

				if (this.nextPosition.x - this.width / 2 > 0 && !collisionChar) {
					this.position.x = this.nextPosition.x;
				}

				break;

			case 38: // ↑
				this.direction = 1;
				this.nextPosition.y = this.position.y - this.speed;

				var collisionChar = this._checkCollisionChar(skeletons, boss);

				if (this.nextPosition.y - this.height / 2 > 150 && !collisionChar) {
					this.position.y = this.nextPosition.y;
				}

				break;

			case 39: // →
				this.direction = 2;
				this.nextPosition.x = this.position.x + this.speed;

				var collisionChar = this._checkCollisionChar(skeletons, boss);

				if (this.nextPosition.x + this.width / 2 < CANVAS_WIDTH && !collisionChar) {
					this.position.x = this.nextPosition.x;
				}

				break;

			case 40: // ↓
				this.direction = 3;
				this.nextPosition.y = this.position.y + this.speed;

				var collisionChar = this._checkCollisionChar(skeletons, boss);

				if (this.nextPosition.y + this.height / 2 < CANVAS_HEIGHT && !collisionChar) {
					this.position.y = this.nextPosition.y;
				}

				break;
			}
		}
	}

	_checkCollisionChar(skeletons, boss) {
		var coSkeleton = false;
		for (var i = 0; i < skeletons.length; i++) {
			coSkeleton = checkCollisionObj(this, skeletons[i]);
			if (coSkeleton) break;
		}

		var coBoss = checkCollisionObj(this, boss);

		if (coSkeleton || coBoss) {
			return true;
		}

		return false;
	}

	attackA(magic, updCount) {
		if (!this.attacking && player.mp >= magic.useMp && updCount - magic.useTime >= magic.recastTime) {
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
			this.mp -= magic.useMp;
		}
	}

	attackS(magicInfo, updCount) {
		if (!this.attacking && player.mp >= magicInfo.useMp && updCount - magicInfo.useTime >= magicInfo.recastTime) {
			var magic = new LongDistanceMagic();
			magic.magicNo = 2;
			magic.position = new Position(this.position.x, this.position.y);
			magic.width = 80;
			magic.height = 80;
			magic.size = 22;
			magic.motionCount = 15;
			magic.power = 10;
			magic.speed = 5;
			magic.alive = true;
			magic.recastTime = magicInfo.recastTime;
			magic.useMp = 10;

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

			magicInfo.magicArray.push(magic);
			magicInfo.useTime = updCount;

			this.attacking = true;
			this.attackMagicNo = magic.magicNo;
			this.mp -= magic.useMp;
		}
	}
}