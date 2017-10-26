function Player() {
	this.position = new Position();
	this.nextPosition = new Position();
	this.width = 64;
	this.height = 64;
	this.speed = 10;
	this.hp = 100;
	this.alive = true;
	this.damaged = false;
	this.direction = 3;
	this.attacking = false;

	this.move = function(keyCode, CANVAS_WIDTH, CANVAS_HEIGHT, boss) {
		switch (keyCode) {
		case 37: // ←
			this.direction = 0;
			this.nextPosition.x = this.position.x - this.speed;
			this.nextPosition.y = this.position.y;

			var length = this.nextPosition.getDistance(boss.position).getLength();
			if (!boss.alive) length = 9999;

			if (this.nextPosition.x - this.width / 2 > 0 && length > player.width + 10) {
				this.position.x = this.nextPosition.x;
			}

			break;

		case 38: // ↑
			this.direction = 1;
			this.nextPosition.x = this.position.x;
			this.nextPosition.y = this.position.y - this.speed;

			var length = this.nextPosition.getDistance(boss.position).getLength();
			if (!boss.alive) length = 9999;

			if (this.nextPosition.y - this.height / 2 > 150 && length > player.width + 10) {
				this.position.y = this.nextPosition.y;
			}

			break;

		case 39: // →
			this.direction = 2;
			this.nextPosition.x = this.position.x + this.speed;
			this.nextPosition.y = this.position.y;

			var length = this.nextPosition.getDistance(boss.position).getLength();
			if (!boss.alive) length = 9999;

			if (this.nextPosition.x + this.width / 2 < CANVAS_WIDTH && length > player.width + 10) {
				this.position.x = this.nextPosition.x;
			}

			break;

		case 40: // ↓
			this.direction = 3;
			this.nextPosition.x = this.position.x;
			this.nextPosition.y = this.position.y + this.speed;

			var length = this.nextPosition.getDistance(boss.position).getLength();
			if (!boss.alive) length = 9999;

			if (this.nextPosition.y + this.height / 2 < CANVAS_HEIGHT && length > player.width + 10) {
				this.position.y = this.nextPosition.y;
			}

			break;
		}
	};

	this.attack = function(playerMagic, updCount) {
		if (!this.attacking && updCount - playerMagic.useTime >= playerMagic.recastTime) {
			switch (this.direction) {
			case 0: // 左
				playerMagic.position.x = this.position.x - player.width;
				playerMagic.position.y = this.position.y;
				break;
			case 1: // 上
				playerMagic.position.x = this.position.x
				playerMagic.position.y = this.position.y - player.height;
				break;
			case 2: // 右
				playerMagic.position.x = this.position.x + player.width;
				playerMagic.position.y = this.position.y
				break;
			case 3: // 下
				playerMagic.position.x = this.position.x
				playerMagic.position.y = this.position.y + player.height;
				break;
			}

			this.attacking = true;
			playerMagic.useTime = updCount;
		}
	};
}

function PlayerMagic(FPS) {
	this.position = new Position();
	this.width = 128;
	this.height = 128;
	this.motion = 0;
	this.power = 10;
	this.useTime = 0;
	this.recastTime = FPS / 2;
}

function Enemy() {
	this.position = new Position();
	this.width = 64;
	this.height = 64;
	this.speed = 5;
	this.hp = 10;
	this.alive = false;
	this.damaged = false;
}

Enemy.prototype.move = function(distance, player) {
	var length = distance.getLength();

	if (length > player.width / 2) {
		this.position.x += distance.x * 1 / length * this.speed;
		this.position.y += distance.y * 1 / length * this.speed;
	}
};

function Boss() {
	this.position = new Position();
	this.nextPosition = new Position();
	this.width = 235;
	this.height = 110;
	this.speed = 1;
	this.hp = 100;
	this.alive = false;
	this.damaged = false;
	this.attacking = false;
	this.moveClassX = 0;
	this.moveClassY = 0;
}

Boss.prototype.move = function(CANVAS_WIDTH, CANVAS_HEIGHT, player, updCountForBoss, FPS) {

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
	 && length > player.width + 10) {
		this.position.x = this.nextPosition.x;
	}
	if (this.nextPosition.y > boss.height / 2 && this.nextPosition.y < CANVAS_HEIGHT - boss.height / 2
	 && length > player.width + 10) {
		this.position.y = this.nextPosition.y;
	}
};

Boss.prototype.attack = function(bossMagic) {
	bossMagic.position.x = this.position.x;
	bossMagic.position.y = this.position.y;
	this.attacking = true;
};

function BossMagic() {
	this.position = new Position();
	this.width = 320;
	this.height = 240;
	this.motion = 0;
	this.power = 20;
}
