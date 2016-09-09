function PhaserGameConstructor() {
	this.init = function() {
		var game = new Phaser.Game(
			window.innerWidth,window.innerHeight-70, Phaser.AUTO, 'jetpackFire'
		)

		game.state.add('Boot', JetPackFire.Boot)
		game.state.add('Preloader', JetPackFire.Preload)
		game.state.add('MainMenu', JetPackFire.MainMenu)
		game.state.add('Game', JetPackFire.Game)

		game.state.start('Boot')
	}
	this.log = function() {
		console.log('WOOOT WOOOOT!!')
	}

}