class Asset {
	constructor() {
		this.assets = [
			{ type: 'image', name: 'top', src: 'img/background_01.jpg' },
			{ type: 'image', name: 'main', src: 'img/background_02.jpeg' },
			{ type: 'image', name: 'title', src: 'img/title.png'},
			{ type: 'image', name: 'gameOver', src: 'img/game_over.png'},
			{ type: 'image', name: 'gameClear', src: 'img/game_clear.png'},
			{ type: 'image', name: 'player', src: 'img/player.png'},
			{ type: 'image', name: 'bat', src: 'img/enemy_01.png'},
			{ type: 'image', name: 'skeleton', src: 'img/enemy_02.png'},
			{ type: 'image', name: 'skeletonOpacity', src: 'img/enemy_02_opacity.png'},
			{ type: 'image', name: 'boss', src: 'img/boss.png'},
			{ type: 'image', name: 'bossOpacity', src: 'img/boss_opacity.png'},
			{ type: 'image', name: 'effect01', src: 'img/effect_01.png'},
			{ type: 'image', name: 'effect02', src: 'img/effect_02.png'},
			{ type: 'image', name: 'effect04', src: 'img/effect_04.png'},
			{ type: 'image', name: 'effect05', src: 'img/effect_05.png'},
			{ type: 'image', name: 'effect06', src: 'img/effect_06.png'}
		];

		this.images = {};
	}

	load(onLoadAll) {
		var total = this.assets.length;
		var loadCount = 0;

		var onLoad = function() {
			loadCount++;
			if (loadCount >= total) {
				onLoadAll();
			}
		};

		this.assets.forEach(function(asset) {
			switch (asset.type) {
			case 'image':
				var image = new Image();
				image.src = asset.src;
				image.onload = onLoad;
				this.images[asset.name] = image;
				break;
			}
		}, this);
	}
}