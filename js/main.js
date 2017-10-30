// - global -------------------------------------------------------------------
var canvas;
var ctx;
var screenNo = 0;
var updCount = 0;
var updCountForDamage = 0;
var updCountForGameClear = 0;
var updCountForGameOver = 0;
var updCountForBoss = 0;
var killEnemyCount = 0;
var player;
var playerMagic;
var enemy;
var boss;
var bossMagic;
var isGameClear = false;
var run = true;

// - const --------------------------------------------------------------------
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FPS = 30;
const ENEMY_MAX_COUNT = 4;

// - main ---------------------------------------------------------------------
window.onload = function() {
	canvas = document.getElementById('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	ctx = canvas.getContext('2d');

	window.addEventListener('keydown', keyDown, true);

	Asset.load(update);
}

function update() {
	updCount++;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	switch (screenNo) {
	case 0:
		ctx.drawImage(Asset.images.top, 0, 0);
		ctx.drawImage(Asset.images.title, 10, 400);
		ctx.font = '25px sans-serif';
		ctx.fillText('※ enterキーを押して下さい', 220, 560);
		break;
	case 1:
		ctx.drawImage(Asset.images.main, 0 ,0);

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

		ctx.drawImage(Asset.images.player, playerImgX, playerImgY, player.width, player.height,
				player.position.x - player.width / 2, player.position.y - player.height / 2, player.width, player.height);
		ctx.beginPath();
		ctx.arc(player.position.x, player.position.y, player.size, 0, Math.PI * 2, false);
		ctx.stroke();

		for (var i = 0; i < ENEMY_MAX_COUNT; i++) {
			if (updCount % (FPS * 2) == 0) {
				if (!enemy[i].alive && enemy[i].hp > 0) {
					enemy[i].alive = true;

					switch (i) {
					case 1:
						enemy[i].position.x = CANVAS_WIDTH;
						break;
					case 2:
						enemy[i].position.x = CANVAS_WIDTH;
						enemy[i].position.y = CANVAS_HEIGHT;
					case 3:
						enemy[i].position.y = CANVAS_HEIGHT;
					}

					break;
				}
			}
		}

		for (var i = 0; i < ENEMY_MAX_COUNT; i++) {
			if (enemy[i].alive) {
				var distance = enemy[i].position.getDistance(player.position);
				enemy[i].move(distance, player);

				if (distance.getLength() < player.size + enemy[i].size) {
					if (player.alive && !player.damaged) {
						player.hp -= enemy[i].power;
						player.damaged = true;
					}
				}

				ctx.drawImage(Asset.images.enemy01,
					enemy[i].position.x - enemy[i].width / 2, enemy[i].position.y - enemy[i].height / 2);
				ctx.beginPath();
				ctx.arc(enemy[i].position.x, enemy[i].position.y, enemy[i].size, 0, Math.PI * 2, false);
				ctx.stroke();
			}
		}

		if (boss.alive) {
			updCountForBoss++;

			if (FPS < updCountForBoss && updCountForBoss <= FPS + 10) {
				ctx.drawImage(Asset.images.effect03, 200 * (updCountForBoss - FPS - 1), 0, 200, 200,
					boss.position.x - 100, boss.position.y - 100, 200, 200);
			}

			if (updCountForBoss > FPS * 2) {
				boss.move(CANVAS_WIDTH, CANVAS_HEIGHT, player, updCountForBoss, FPS);
				ctx.drawImage(Asset.images.boss, boss.position.x - boss.width / 2, boss.position.y - boss.height / 2);
				ctx.beginPath();
				ctx.arc(boss.position.x, boss.position.y, boss.size, 0, Math.PI * 2, false);
				ctx.stroke();
				boss.attack(bossMagic, updCount);
			}

			if (boss.attacking) {
				bossMagic.motion++;
				var bossMagicImgY = bossMagic.height * (bossMagic.motion - 1);

				ctx.drawImage(Asset.images.effect04, 0, bossMagicImgY, bossMagic.width, bossMagic.height,
					bossMagic.position.x - bossMagic.width / 2, bossMagic.position.y - bossMagic.height / 2,
					bossMagic.width, bossMagic.height);
				ctx.beginPath();
				ctx.arc(bossMagic.position.x, bossMagic.position.y, bossMagic.size, 0, Math.PI * 2, false);
				ctx.stroke();

				if (player.alive) {
					var distance = bossMagic.position.getDistance(player.position);

					if (distance.getLength() < bossMagic.size + player.size) {
						if (!player.damaged) {
							player.hp -= bossMagic.power;
							if (player.hp < 0) player.hp = 0;
							player.damaged = true;
						}
					}
				}

				if (bossMagic.motion >= bossMagic.motionCount) {
					bossMagic.motion = 0;
					boss.attacking = false;
				}
			}
		}

		for (var i = 0; i < playerMagic.length; i++) {
			var magic = playerMagic[i];

			if (i == 0) {
				if (magic.alive) {
					magic.motion++;
					var magicImgX = magic.width * (magic.motion - 1);

					ctx.drawImage(Asset.images.effect01, magicImgX, 0, magic.width, magic.height,
						magic.position.x - magic.width / 2 ,magic.position.y - magic.height / 2, magic.width, magic.height);

					ctx.beginPath();
					ctx.arc(magic.position.x, magic.position.y, magic.size, 0, Math.PI * 2, false);
					ctx.stroke();

					judgeCollisionOfAttack(magic);

					if (magic.motion >= magic.motionCount) {
						magic.motion = 0;
						magic.alive = false;
						player.attacking = false;
						enemy.damaged = false;
						boss.damaged = false;
					}
				}
			} else if (i == 1) {
				for (var j = 0; j < magic.magicArray.length; j++) {
					// console.log('j:' + j);
					var m = magic.magicArray[j];

					if (m.alive) {
						m.motion++;
						m.move(CANVAS_WIDTH, CANVAS_HEIGHT);

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

						ctx.drawImage(Asset.images.effect05, imgX, imgY, m.width, m.height,
							m.position.x - m.width / 2 ,m.position.y - m.height / 2, m.width, m.height);

						ctx.beginPath();
						ctx.arc(m.position.x, m.position.y, m.size, 0, Math.PI * 2, false);
						ctx.stroke();

						judgeCollisionOfAttack(m);

						if (m.motion >= m.motionCount) {
							m.motion = 3;
							enemy.damaged = false;
							boss.damaged = false;
						}
					}
				}

				if (player.attacking && player.attackMagicNo == 2 && updCount - magic.useTime >= magic.time) {
					player.attacking = false;
				}

				for (var j = magic.magicArray.length - 1; j >= 0; j--) {
					if (!magic.magicArray[j].alive) {
						magic.magicArray.splice(j, 1);
					}
				}

				console.log(magic.magicArray.length);
			}
		}

		if (player.damaged) {
			updCountForDamage++;

			if (updCountForDamage <= 5) {
				ctx.drawImage(Asset.images.effect02, 0, 0, 128, 128,
					player.position.x - player.width, player.position.y - player.height, 128, 128);
			}

			if (updCountForDamage > FPS) {
				player.damaged = false;
				updCountForDamage = 0;
			}
		}

		if (killEnemyCount >= ENEMY_MAX_COUNT && boss.hp > 0) {
			boss.alive = true;
		}

		ctx.font = '25px sans-serif';
		ctx.fillText('Player: HP', 10, 30);
		ctx.fillText(player.hp, 140, 30);

		if (updCountForBoss > FPS * 2) {
			ctx.fillText('Boss: HP', 620, 30);
			ctx.fillText(boss.hp, 740, 30);
		}

		if (player.hp <= 0) {
			updCountForGameOver++;
			player.alive = false;

			if (updCountForGameOver >= 10) {
				ctx.drawImage(Asset.images.gameOver, 80, 200);
				ctx.font = '25px sans-serif';
				ctx.fillText('※ escキーを押して下さい', 250, 400);
				run = false;
			}
		}

		if (isGameClear) {
			updCountForGameClear++;
			
			if (updCountForGameClear >= FPS) {
				ctx.drawImage(Asset.images.gameClear, 80, 200);
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
	updCountForDamage = 0;
	updCountForGameClear = 0;
	updCountForGameOver = 0;
	updCountForBoss = 0;
	killEnemyCount = 0;
	isGameClear = false;

	player = new Player(new Position((CANVAS_WIDTH / 2), 400));
	playerMagic = new Array(2);
	playerMagic[0] = new Magic(1, new Position(0, 0), 128, 128, 20, 7, 10, FPS / 2);
	playerMagic[1] = new LongDistanceMagicInfo(FPS / 2);

	enemy = new Array(ENEMY_MAX_COUNT);
	for (var i = 0; i < ENEMY_MAX_COUNT; i++) {
		enemy[i] = new Enemy(new Position(0, 0));
	}

	boss = new Boss(new Position((CANVAS_WIDTH / 2), 150));
	bossMagic = new Magic(90, new Position(0, 0), 320, 240, 120, 12, 20, FPS * 3);
}

function judgeCollisionOfAttack(magic) {
	for (var i = 0; i < ENEMY_MAX_COUNT; i++) {
		if (enemy[i].alive) {
			var distanceOfEnemy = magic.position.getDistance(enemy[i].position);

			if (distanceOfEnemy.getLength() < magic.size + enemy[i].size) {
				if (!enemy[i].damaged) {
					enemy[i].hp -= magic.power;
					if (enemy[i].hp < 0) enemy[i].hp = 0;
					enemy[i].damaged = true;

					if (magic.magicNo == 2) {
						magic.alive = false;
					}

					if(enemy[i].hp <= 0) {
						enemy[i].alive = false;
						killEnemyCount++;
					}
				}
			}
		}
	}

	if (boss.alive) {
		var distanceOfBoss = magic.position.getDistance(boss.position);

		if (distanceOfBoss.getLength() < magic.size + boss.size) {
			if (!boss.damaged) {
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

// - load --------------------------------------------------------------------
var Asset = {};

Asset.assets = [
	{ type: 'image', name: 'top', src: 'img/background_01.jpg' },
	{ type: 'image', name: 'main', src: 'img/background_02.jpeg' },
	{ type: 'image', name: 'title', src: 'img/title.png'},
	{ type: 'image', name: 'gameOver', src: 'img/game_over.png'},
	{ type: 'image', name: 'gameClear', src: 'img/game_clear.png'},
	{ type: 'image', name: 'player', src: 'img/player.png'},
	{ type: 'image', name: 'enemy01', src: 'img/enemy_01.png'},
	{ type: 'image', name: 'boss', src: 'img/boss.png'},
	{ type: 'image', name: 'effect01', src: 'img/effect_01.png'},
	{ type: 'image', name: 'effect02', src: 'img/effect_02.png'},
	{ type: 'image', name: 'effect03', src: 'img/effect_03.png'},
	{ type: 'image', name: 'effect04', src: 'img/effect_04.png'},
	{ type: 'image', name: 'effect05', src: 'img/effect_05.png'}
];

Asset.images = {};

Asset.load = function(onLoadAll) {
	var total = Asset.assets.length;
	var loadCount = 0;

	var onLoad = function() {
		loadCount++;
		if (loadCount >= total) {
			onLoadAll();
		}
	};

	Asset.assets.forEach(function(asset) {
		switch (asset.type) {
		case 'image':
			Asset._loadImage(asset, onLoad);
			break;
		}
	});
};

Asset._loadImage = function(asset, onLoad) {
	var image = new Image();
	image.src = asset.src;
	image.onload = onLoad;
	Asset.images[asset.name] = image;
};

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
			player.move(keyCode, CANVAS_WIDTH, CANVAS_HEIGHT, boss);
			break;
		case 65: // A
			player.attackA(playerMagic[0], updCount);
			break;
		case 83: // S
			player.attackS(playerMagic[1], updCount);
			break;
		}

		break;
	}
}
