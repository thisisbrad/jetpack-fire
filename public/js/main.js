var game = new Phaser.Game(window.innerWidth,window.innerHeight, Phaser.AUTO, '')

game.state.add('Boot', JetPackFire.Boot)
game.state.add('Preloader', JetPackFire.Preload)
game.state.add('MainMenu', JetPackFire.MainMenu)
game.state.add('Game', JetPackFire.Game)

game.state.start('Boot')