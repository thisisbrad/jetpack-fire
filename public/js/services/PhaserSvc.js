angular.module('fireApp').service("PhaserSvc", ["BootSvc", "GameSvc", function(BootSvc, GameSvc) {
	this.init = function() {
		var game = new Phaser.Game(
			window.innerWidth,window.innerHeight - 54, Phaser.CANVS, 'jetpackFire'
		)

		console.log("THIS IS RUNNING")

		game.state.add('Boot', BootSvc)
		game.state.add('Preloader', JetPackFire.Preload)
		game.state.add('MainMenu', JetPackFire.MainMenu)
		game.state.add('Game', GameSvc)

		game.state.start('Boot')

		return game;
	}
}])