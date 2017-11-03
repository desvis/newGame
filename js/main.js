// - global -------------------------------------------------------------------
var canvas;
var ctx;
var asset;
var screenNo = 0;
var updCount = 0;
var updCountForGameClear = 0;
var updCountForGameOver = 0;
var killBatCount = 0;
var player;
var playerMagics;
var bats;
var skeletons;
var boss;
var bossMagics;
var isGameClear = false;
var run = true;

// - const --------------------------------------------------------------------
const ENEMY_BAT_COUNT = 4;
const ENEMY_SKELETON_COUNT = 2;
const EFFECT_02_TIME = 5;
const ENEMY_HP_WIDTH = 80;
const ENEMY_HP_HEIGHT = 10;
const PLAYER_HP_X = 60;
const PLAYER_HP_Y = 41;
const PLAYER_HP_WIDTH = 200;
const PLAYER_HP_HEIGHT = 20;
const PLAYER_MP_X = 60;
const PLAYER_MP_Y = 71;
const PLAYER_MP_WIDTH = 200;
const PLAYER_MP_HEIGHT = 20;

// - main ---------------------------------------------------------------------
window.onload = function() {
	canvas = document.getElementById('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	ctx = canvas.getContext('2d');

	window.addEventListener('keydown', keyDown, true);

	asset = new Asset();
	asset.load(update);
}

function update() {
	updCount++;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	switch (screenNo) {
	case 0:
		ctx.drawImage(asset.images.top, 0, 0);
		ctx.drawImage(asset.images.title, 10, 400);
		ctx.font = '25px sans-serif';
		ctx.fillText('※ enterキーを押して下さい', 220, 560);
		break;
	case 1:
		ctx.drawImage(asset.images.main, 0 ,0);

		drawPlayer();
		drawBat();
		drawSkeleton();
		drawBoss();
		drawBossMagic();
		drawPlayerMagic();

		if (updCount % (FPS / 2) == 0 && player.mp < player.maxMp) {
			player.mp++;
		}

		drawPlayerStatus();

		if (player.hp <= 0) {
			updCountForGameOver++;
			player.alive = false;

			if (updCountForGameOver > 10) {
				ctx.drawImage(asset.images.gameOver, 80, 200);
				ctx.font = '25px sans-serif';
				ctx.fillText('※ escキーを押して下さい', 250, 400);
				run = false;
			}
		}

		if (isGameClear) {
			updCountForGameClear++;
			
			if (updCountForGameClear > FPS) {
				ctx.drawImage(asset.images.gameClear, 80, 200);
				ctx.font = '25px sans-serif';
				ctx.fillText('※ escキーを押して下さい', 250, 400);
				run = false;
			}
		}

		break;
	}

	if (run) {
		setTimeout(arguments.callee, 1000 / FPS);
	}
}

function init() {
	updCount = 0;
	updCountForGameClear = 0;
	updCountForGameOver = 0;
	isGameClear = false;
	player = new Player(new Position((CANVAS_WIDTH / 2), 400));
	createEnemy();
	createMagic();
}

function createEnemy() {
	bats = new Array();
	for (var i = 0; i < ENEMY_BAT_COUNT; i++) {
		var bat = new Bat();
		bat.position = new Position(0, 0);
		bat.width = 64;
		bat.height = 64;
		bat.size = 24;
		bat.power = 5;
		bat.speed = 4;
		bat.maxHp = 10;
		bat.hp = bat.maxHp;
		bats.push(bat);
	}

	skeletons = new Array();
	for (var i = 0; i < ENEMY_SKELETON_COUNT; i++) {
		var skeleton = new Skeleton(i);
		skeleton.width = 120;
		skeleton.height = 120;
		skeleton.size = 40;
		skeleton.power = 10;
		skeleton.speed = 1;
		skeleton.maxHp = 30;
		skeleton.hp = skeleton.maxHp;
		skeleton.position = (i == 0)
			? new Position(-skeleton.width / 2, 400)
			: new Position(CANVAS_WIDTH + skeleton.width / 2, 400);
		skeletons.push(skeleton);
	}

	boss = new Boss();
	boss.width = 235;
	boss.height = 110;
	boss.size = 55;
	boss.speed = 1;
	boss.maxHp = 200;
	boss.hp = boss.maxHp;
	boss.position = new Position(CANVAS_WIDTH / 2, -boss.height / 2);
}

function createMagic() {
	var playerMagic01 = new Magic();
	playerMagic01.magicNo = 1;
	playerMagic01.position = new Position(0, 0);
	playerMagic01.width = 128;
	playerMagic01.height = 128;
	playerMagic01.size = 20;
	playerMagic01.motionCount = 7;
	playerMagic01.power = 10;
	playerMagic01.recastTime = FPS / 2;
	playerMagic01.useMp = 5;

	var playerMagic02 = new LongDistanceMagicInfo();
	playerMagic02.useMp = 10;
	playerMagic02.time = 5;
	playerMagic02.recastTime = FPS / 2;

	playerMagics = new Array(2);
	playerMagics[0] = playerMagic01;
	playerMagics[1] = playerMagic02;

	var bossMagic01 = new LongDistanceMagicInfo();
	var bossMagic02 = new Magic();
	bossMagic02.magicNo = 92;
	bossMagic02.position = new Position(0, 0);
	bossMagic02.width = 320;
	bossMagic02.height = 240;
	bossMagic02.size = 120;
	bossMagic02.motionCount = 12;
	bossMagic02.power = 20;
	
	bossMagics = new Array(2);
	bossMagics[0] = bossMagic01;
	bossMagics[1] = bossMagic02;
}

function drawPlayer() {
	var playerImgX = (player.attacking) ? 0 : player.width;
	var playerImgY = 0;

	switch (player.direction) {
	case 0:
		playerImgY = player.height;
		break;
	case 1:
		playerImgY = player.height * 3;
		break;
	case 2:
		playerImgY = player.height * 2;
		break;
	}

	ctx.drawImage(asset.images.player, playerImgX, playerImgY, player.width, player.height,
			player.position.x - player.width / 2, player.position.y - player.height / 2, player.width, player.height);

	// drawCollisionRange(player);
}

function drawBat() {
	for (var i = 0; i < bats.length; i++) {
		if (updCount % (FPS * 2) == 0) {
			if (!bats[i].alive && bats[i].hp > 0) {
				switch (i) {
				case 1:
					bats[i].position.x = CANVAS_WIDTH;
					break;
				case 2:
					bats[i].position.x = CANVAS_WIDTH;
					bats[i].position.y = CANVAS_HEIGHT;
				case 3:
					bats[i].position.y = CANVAS_HEIGHT;
				}

				bats[i].alive = true;
				break;
			}
		}

		if (bats[i].alive) {
			var distanceOfPlayer = bats[i].position.getDistance(player.position)

			bats[i].move(player, distanceOfPlayer);

			ctx.drawImage(asset.images.bat,
				bats[i].position.x - bats[i].width / 2, bats[i].position.y - bats[i].height / 2);

			// drawCollisionRange(bats[i]);

			if (distanceOfPlayer.getLength() < bats[i].size + player.size) {
				if (player.alive && !bats[i].attacking) {
					player.hp -= bats[i].power;
					if (player.hp < 0) player.hp = 0;
					bats[i].attacking = true;
				}
			}

			if (bats[i].attacking) {
				bats[i].attackUpdateCount++

				if (bats[i].attackUpdateCount <= EFFECT_02_TIME) {
					ctx.drawImage(asset.images.effect02, 0, 0, 120, 120,
						player.position.x - 60, player.position.y - 60, 120, 120);
				}

				if (bats[i].attackUpdateCount >= FPS) {
					bats[i].attacking = false;
					bats[i].attackUpdateCount = 0;
				}
			}

			drawEnemyHp(bats[i]);
		}
	}
}

function drawSkeleton() {
	var stoppingCount = 0;

	for (var i = 0; i < skeletons.length; i++) {
		if (skeletons[i].alive) {
			skeletons[i].move(player, skeletons, i, boss);

			var img = (skeletons[i].stopping) ? asset.images.skeletonOpacity : asset.images.skeleton;
			ctx.drawImage(img, skeletons[i].position.x - skeletons[i].width / 2, skeletons[i].position.y - skeletons[i].height / 2);

			// drawCollisionRange(skeletons[i]);

			if (skeletons[i].stopping) {
				stoppingCount++;

				if (boss.alive && updCount % (FPS / 2) == 0 && skeletons[i].hp < skeletons[i].maxHp) {
					skeletons[i].hp++;
				}
				if (boss.alive && skeletons[i].hp >= skeletons[i].maxHp) {
					skeletons[i].stopping = false;
				}
			} else {
				var length = skeletons[i].position.getDistance(player.position).getLength();
				if (length < skeletons[i].size + player.size + 3) {
					if (player.alive && !skeletons[i].attacking) {
						player.hp -= skeletons[i].power;
						if (player.hp < 0) player.hp = 0;
						skeletons[i].attacking = true;
					}
				}

				if (skeletons[i].attacking) {
					skeletons[i].attackUpdateCount++

					if (skeletons[i].attackUpdateCount <= EFFECT_02_TIME) {
						ctx.drawImage(asset.images.effect02, 0, 0, 120, 120,
							player.position.x - 60, player.position.y - 60, 120, 120);
					}

					if (skeletons[i].attackUpdateCount >= FPS) {
						skeletons[i].attacking = false;
						skeletons[i].attackUpdateCount = 0;
					}
				}
			}

			drawEnemyHp(skeletons[i]);
		}
	}

	if (stoppingCount == skeletons.length) {
		boss.alive = true;
	}
}

function drawBoss() {
	if (boss.alive) {
		boss.aliveUpdateCount++;

		boss.move(player, skeletons);

		var img = (boss.ready) ? asset.images.boss : asset.images.bossOpacity;
		ctx.drawImage(img, boss.position.x - boss.width / 2, boss.position.y - boss.height / 2);

		// drawCollisionRange(boss);

		if (boss.ready) {
			boss.attack(bossMagics, player, updCount);
		}

		drawEnemyHp(boss);
	}
}

function drawBossMagic() {
	for (var i = 0; i < bossMagics.length; i++) {
		var magic = bossMagics[i];

		if (i == 0) {
			for (var j = 0; j < magic.magicArray.length; j++) {
				var m = magic.magicArray[j];
				if (m.alive) {
					m.motion++;
					m.move();

					var imgX = 0;
					var imgY = 0;

					if (m.motion <= 5) {
						imgX = m.width * (m.motion - 1);
						imgY = 0;
					} else if (m.motion <= 10) {
						imgX = m.width * (m.motion - 6);
						imgY = m.height;
					} else {
						imgX = m.width * (m.motion - 11);
						imgY = m.height * 2;
					}

					ctx.drawImage(asset.images.effect06, imgX, imgY, m.width, m.height,
						m.position.x - m.width / 2 ,m.position.y - m.height / 2, m.width, m.height);

					// drawCollisionRange(m);

					judgeCollisionOfAttackForBoss(m);

					if (m.motion >= m.motionCount) {
						m.motion = 3;
					}
				}

				player.damaged = false;
			}

			for (var j = magic.magicArray.length - 1; j >= 0; j--) {
				if (!magic.magicArray[j].alive) {
					magic.magicArray.splice(j, 1);
				}
			}
		} else if (i == 1) {
			if (magic.alive) {
				magic.motion++;
				var imgY = magic.height * (magic.motion - 1);

				ctx.drawImage(asset.images.effect04, 0, imgY, magic.width, magic.height,
					magic.position.x - magic.width / 2, magic.position.y - magic.height / 2,
					magic.width, magic.height);

				// drawCollisionRange(magic);

				judgeCollisionOfAttackForBoss(magic);

				if (magic.motion >= magic.motionCount) {
					magic.motion = 0;
					magic.alive = false;
					player.damaged = false;
				}
			}
		}
	}
}

function drawPlayerMagic() {
	for (var i = 0; i < playerMagics.length; i++) {
		var magic = playerMagics[i];

		if (i == 0) {
			if (magic.alive) {
				magic.motion++;
				var magicImgX = magic.width * (magic.motion - 1);

				ctx.drawImage(asset.images.effect01, magicImgX, 0, magic.width, magic.height,
					magic.position.x - magic.width / 2 ,magic.position.y - magic.height / 2, magic.width, magic.height);

				// drawCollisionRange(magic);

				judgeCollisionOfAttack(magic);

				if (magic.motion >= magic.motionCount) {
					magic.motion = 0;
					magic.alive = false;
					player.attacking = false;

					for (var j = 0; j < bats.length; j++) {
						bats[j].damaged = false;
					}
					for (var j = 0; j < skeletons.length; j++) {
						skeletons[j].damaged = false;
					}

					boss.damaged = false;
				}
			}
		} else if (i == 1) {
			for (var j = 0; j < magic.magicArray.length; j++) {
				var m = magic.magicArray[j];

				if (m.alive) {
					m.motion++;
					m.move();

					var imgX = 0;
					var imgY = 0;

					if (m.motion <= 5) {
						imgX = m.width * (m.motion - 1);
						imgY = 0;
					} else if (m.motion <= 10) {
						imgX = m.width * (m.motion - 6);
						imgY = m.height;
					} else {
						imgX = m.width * (m.motion - 11);
						imgY = m.height * 2;
					}

					ctx.drawImage(asset.images.effect05, imgX, imgY, m.width, m.height,
						m.position.x - m.width / 2 ,m.position.y - m.height / 2, m.width, m.height);

					// drawCollisionRange(m);

					judgeCollisionOfAttack(m);

					if (m.motion >= m.motionCount) {
						m.motion = 3;
					}
				}

				for (var k = 0; k < skeletons.length; k++) {
					skeletons[k].damaged = false;
				}

				for (var k = 0; k < bats.length; k++) {
					bats[k].damaged = false;
				}

				boss.damaged = false;
			}

			if (player.attacking && player.attackMagicNo == 2 && updCount - magic.useTime >= magic.time) {
				player.attacking = false;
			}

			for (var j = magic.magicArray.length - 1; j >= 0; j--) {
				if (!magic.magicArray[j].alive) {
					magic.magicArray.splice(j, 1);
				}
			}
		}
	}
}

function drawEnemyHp(enemy) {
	var hpX = enemy.position.x - ENEMY_HP_WIDTH / 2;
	var hpY = enemy.position.y - (enemy.height / 2) - ENEMY_HP_HEIGHT / 2;

	ctx.strokeRect(hpX, hpY, ENEMY_HP_WIDTH, ENEMY_HP_HEIGHT);
	if (enemy.hp > 0) {
		ctx.fillStyle = '#FFC0CB';
		ctx.fillRect(hpX + ctx.lineWidth, hpY + ctx.lineWidth,
			enemy.hp * (ENEMY_HP_WIDTH / enemy.maxHp) - (ctx.lineWidth * 2), ENEMY_HP_HEIGHT - (ctx.lineWidth * 2));
	}
	ctx.fillStyle = '#000000';
}

function drawPlayerStatus() {
	ctx.font = '25px sans-serif';
	ctx.fillText('Player', 10, 30);
	ctx.fillText('HP', 10, 60);
	ctx.fillText('MP', 10, 90);

	ctx.strokeRect(PLAYER_HP_X, PLAYER_HP_Y, PLAYER_HP_WIDTH, PLAYER_HP_HEIGHT);
	ctx.strokeRect(PLAYER_MP_X, PLAYER_MP_Y, PLAYER_MP_WIDTH, PLAYER_MP_HEIGHT);

	if (player.hp > 0) {
		ctx.fillStyle = '#87CEFA';
		ctx.fillRect(PLAYER_HP_X + ctx.lineWidth, PLAYER_HP_Y + ctx.lineWidth,
			player.hp * (PLAYER_HP_WIDTH / player.maxHp) - (ctx.lineWidth * 2), PLAYER_HP_HEIGHT - (ctx.lineWidth * 2));
	}

	if (player.mp > 0) {
		ctx.fillStyle = '#90EE90';
		ctx.fillRect(PLAYER_MP_X + ctx.lineWidth, PLAYER_MP_Y + ctx.lineWidth,
			player.mp * (PLAYER_MP_WIDTH / player.maxMp) - (ctx.lineWidth * 2), PLAYER_MP_HEIGHT - (ctx.lineWidth * 2));
	}

	ctx.fillStyle = '#000000';
}

function judgeCollisionOfAttack(magic) {
	for (var i = 0; i < bats.length; i++) {
		if (bats[i].alive) {
			var distanceOfEnemy = magic.position.getDistance(bats[i].position);

			if (distanceOfEnemy.getLength() < magic.size + bats[i].size) {
				if (!bats[i].damaged) {
					bats[i].hp -= magic.power;
					if (bats[i].hp < 0) bats[i].hp = 0;
					bats[i].damaged = true;

					if (magic.magicNo == 2) {
						magic.alive = false;
					}

					if(bats[i].hp <= 0) {
						bats[i].alive = false;
						killBatCount++;

						if (killBatCount >= bats.length) {
							skeletons[0].alive = true;
							skeletons[1].alive = true;
						}
					}
				}
			}
		}
	}

	for (var i = 0; i < skeletons.length; i++) {
		if (skeletons[i].alive) {
			var distanceOfSkeleton = magic.position.getDistance(skeletons[i].position);

			if (distanceOfSkeleton.getLength() < magic.size + skeletons[i].size) {
				if (!skeletons[i].damaged && !skeletons[i].stopping) {
					skeletons[i].hp -= magic.power;
					if (skeletons[i].hp < 0) skeletons[i].hp = 0;

					skeletons[i].damaged = true;

					if (magic.magicNo == 2) {
						magic.alive = false;
					}

					if (skeletons[i].hp <= 0) {
						skeletons[i].stopping = true;
					}
				}
			}
		}
	}

	if (boss.alive) {
		var distanceOfBoss = magic.position.getDistance(boss.position);

		if (distanceOfBoss.getLength() < magic.size + boss.size) {
			if (!boss.damaged && boss.ready) {
				boss.hp -= magic.power;
				if (boss.hp < 0) boss.hp = 0;
				boss.damaged = true;

				if (magic.magicNo == 2) {
					magic.alive = false;
				}

				if (boss.hp <= 0) {
					boss.alive = false;
					isGameClear = true;
				}
			}
		}
	}
}

function judgeCollisionOfAttackForBoss(magic) {
	if (player.alive) {
		var distanceOfPlayer = magic.position.getDistance(player.position);

		if (distanceOfPlayer.getLength() < magic.size + player.size) {
			if (!player.damaged) {
				player.hp -= magic.power;
				if (player.hp < 0) player.hp = 0;
				player.damaged = true;

				if (magic.magicNo == 91) {
					magic.alive = false;
				}
			}
		}
	}
}

// - event --------------------------------------------------------------------
function keyDown(event) {
	var keyCode = event.keyCode;

	switch (screenNo) {
	case 0:
		switch (keyCode) {
		case 13: // enter
			screenNo = 1;
			init();
			break;
		}
		break;
	case 1:
		switch (keyCode) {
		case 27: // esc
			if (!run) {
				screenNo = 0;
				run = true;
				update();
			}
			break;
		case 37: // ←
		case 38: // ↑
		case 39: // →
		case 40: // ↓
			player.move(keyCode, skeletons, boss);
			break;
		case 65: // A
			player.attackA(playerMagics[0], updCount);
			break;
		case 83: // S
			player.attackS(playerMagics[1], updCount);
			break;
		}

		break;
	}
}