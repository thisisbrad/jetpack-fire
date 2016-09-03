JetPackFire.Game = function() {
	this.playerMinAngle = -20
	this.playerMaxAngle = 20
	this.coinRate = 1000
	this.coinTimer = 0
}

JetPackFire.Game.prototype = {
	create: function() {
		this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background')
		this.background.autoScroll(-100,0)

		this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground')
		this.foreground.autoScroll(-100,0)

		this.ground = this.game.add.tileSprite(0, this.game.height -73, this.game.width, 73, 'ground')
		this.ground.autoScroll(-400,0)

		this.player= this.add.sprite(200, this.game.height/2, 'player')
		this.player.anchor.setTo(0.5)
		this.player.scale.setTo(0.3)

		this.player.animations.add('fly', [0,1,2,3,2,1])
		this.player.animations.play('fly', 8, true)

		this.game.physics.startSystem(Phaser.Physics.ARCADE)
		this.game.physics.arcade.gravity.y = 400

		this.game.physics.arcade.enableBody(this.ground)
		this.ground.body.allowGravity = false // turns off gravity on object
		this.ground.body.immovable = true // turns off effect of other objects moving ground with physics
		
		this.game.physics.arcade.enableBody(this.player);
		this.player.body.collideWorldBounds = true
		this.player.body.bounce.set(0.25)

		this.coins = this.game.add.group()

		this.coins
	},
	update: function() {
		this.game.input.activePointer.isDown ? this.player.body.velocity.y -= 24 : this.player.body.velocity.y
		
		if( this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
      if(this.player.angle > 0) {
        this.player.angle = 0;
      }
      if(this.player.angle > this.playerMinAngle) {
        this.player.angle -= 0.5;
      }
    } else if(this.player.body.velocity.y >=0 && !this.game.input.activePointer.idDown) {
      if(this.player.angle < this.playerMaxAngle) {
        this.player.angle += 0.5;
      }
    }

    if(this.coinTimer < this.game.time.now){
    	this.createCoins()
    	this.coinTimer = this.game.time.now + this.coinRate
    }

    this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
	},
	shutdown: function() {

	},
	createCoins: function() {
		var x = this.game.width
		var y = this.game.rnd.integerInRange(50, this.game.world.height - 192)

		var coin = this.coins.getFirstExists(false)
		if(!coin){
			coin = new Coin(this.game, 0, 0)
			this.coins.add(coin)
			coin.reset(x,y)
			coin.revive()

		}
	},
  groundHit: function(player, ground) {
    player.body.velocity.y = -200;
  }
}