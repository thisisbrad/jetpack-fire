angular.module('fireApp').factory("GameSvc", function($rootScope, $firebaseObject) {
  return { 
    create: function() {
      var ref = firebase.database().ref()
      var postRef = ref.child('users/' + $rootScope.currentUser.uid + "/game-collection/43243243242/gamedata" )
      var collection = $firebaseObject(postRef)
      this.collection = collection
      this.playerMinAngle = -20
      this.playerMaxAngle = 20
      this.score = 0
      this.collection.score = 0
      this.collection.player = {}
      this.collection.player.y = 0
      this.previousCoinType = null
      this.coinSpawnX = null
      this.coinSpacingX = 10
      this.coinSpacingY = 10
      this.playerMaxY = null
      this.spawnX = null

      console.log("Current Player ", $rootScope.currentUser)
      console.log("Current Collection ", collection)

      // set up the game world bounds
      this.game.world.bounds = new Phaser.Rectangle(0,0, this.game.width + 300, this.game.height)
      this.game.time.advancedTiming = true

      // start the physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE)
      this.game.physics.arcade.gravity.y = 400

      // initialize settings
      this.playerMaxY = this.game.height - 176
      this.spawnX = this.game.width + 64

      //setting up backgrounds
      this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background')
      this.background.autoScroll(-100,0)

      this.foreground = this.game.add.tileSprite(
        0, 470, this.game.width, this.game.height - 533, 'foreground'
      )
      this.foreground.autoScroll(-100,0)

      this.ground = this.game.add.tileSprite(0, this.game.height -73, this.game.width, 73, 'ground')
      this.ground.autoScroll(-400,0)

      //setting up player character
      this.player= this.add.sprite(200, this.game.height/2, 'player')
      this.player.anchor.setTo(0.5)
      this.player.scale.setTo(0.3)
      this.player.animations.add('fly', [0,1,2,3,2,1])
      this.player.animations.play('fly', 8, true)
      this.player.alive = true

      // create shadow for jetpack player
      this.shadow = this.game.add.sprite(this.player.x, this.game.world.height - 73, 'shadow');
      this.shadow.anchor.setTo(0.5, 0.5)

      this.game.physics.arcade.enableBody(this.ground)
      this.ground.body.allowGravity = false // turns off gravity on object
      this.ground.body.immovable = true // turns off effect of other objects moving ground with physics
      
      this.game.physics.arcade.enableBody(this.player)
      this.player.body.collideWorldBounds = true
      this.player.body.bounce.set(0.25, 0.25)

      //in game scoring 
      this.scoreText = this.game.add.bitmapText(10,10,'minecraftia', 'Score: 0', 24)
      
      //game item groups
      this.coins = this.game.add.group()
      this.enemies = this.game.add.group()

      //create an enemy spawn loop
      this.enemyGenerator = this.game.time.events.loop(
        Phaser.Timer.SECOND + 200, this.generateEnemy, this
      )
      this.enemyGenerator.timer.start()

      // create a coin spawn loop
      this.coinGenerator = this.game.time.events.loop(
        200, this.generateCoins, this
      )
      this.coinGenerator.timer.start()

      this.coinSpawnX = this.game.width + 64  

      //create scoreboard
      this.scoreboard = new Scoreboard(this.game)
      this.add.existing(this.scoreboard)

      this.jetpackSound = this.game.add.audio('rocket')
      this.coinSound = this.game.add.audio('coin')
      this.deathSound = this.game.add.audio('death')
      this.gameMusic = this.game.add.audio('gameMusic')
      this.gameMusic.play('', 0, true)
    },
    update: function() {
      this.game.debug.text(this.game.time.fps, 32, 100, "#00ff00")
      // this.game.debug.spriteCoords(this.player, 32, 128)
      if(this.player.alive) {
        // if touch isDown add velocity and sound
        if(this.game.input.activePointer.isDown) {
          this.player.body.velocity.y -= 25
          if(!this.jetpackSound.isPlaying) {
            this.jetpackSound.play('',0,true, 0.5)
          }
          this.player.animations.play('fly', 16)
        } else {
          this.jetpackSound.stop()
        }

        if( this.player.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
          if(this.player.angle > 0) {
            this.player.angle = 0;
          }
          if(this.player.angle > this.playerMinAngle) {
            this.player.angle -= 0.5;
          }
        } else if(this.player.body.velocity.y >=0 && !this.game.input.activePointer.idDown) {
          if(this.player.angle < this.playerMaxAngle) {
            this.player.angle += 0.5
          }
        }

        this.collection.player.y = this.player.y
        this.collection.$save()
        // .then(function(ref) {
        //   // console.log('Moving ', ref)
        // }, function(error) {
        //   console.log("Error:", error);
        // })

        this.shadow.scale.setTo(this.player.y / this.game.height);
        this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);

      } else {
        this.game.physics.arcade.collide(this.player, this.ground);
      }
    },
    shutdown: function() {
      console.log('shutting down')
      this.coins.destroy()
      this.enemies.destroy()
      this.score = 0
      this.scoreboard.destroy()
      this.coinGenerator.timer.destroy()
      this.enemyGenerator.timer.destroy()
    },
    createCoin: function() {
      var x = this.game.width
      var y = this.game.rnd.integerInRange(50, this.game.world.height - 192)

      var coin = this.coins.getFirstExists(false)
      if(!coin) {
        coin = new Coin(this.game, 0, 0)
        this.coins.add(coin)
      }

      coin.reset(x,y)
      coin.revive()

      return coin
    },
    generateCoins: function() {
      if(!this.previousCoinType || this.previousCoinType < 3) {
        var coinType = this.game.rnd.integer() % 5
        switch(coinType) {
          case 0:
            //do nothing. No coins generated
            break;
          case 1:
          case 2:
            // if the cointype is 1 or 2, create a single coin
            //this.createCoin();
            this.createCoin();
            break;
          case 3:
            // create a small group of coins
            this.createCoinGroup(2, 2)
            break;
          case 4:
            //create a large coin group
            this.createCoinGroup(6, 2)
            break;
          default:
            // if somehow we error on the cointype, set the previouscointype to zero and do nothing
            this.previousCoinType = 0
            break;
        }

        this.previousCoinType = coinType
      } else {
        if(this.previousCoinType === 4) {
          // the previous coin generated was a large group, 
          // skip the next generation as well
          this.previousCoinType = 3
        } else {
          this.previousCoinType = 0
        }
        
      }
    },
    createCoinGroup: function(columns, rows) {
      //create 4 coins in a group
      var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192)
      var coinRowCounter = 0
      var coinColumnCounter = 0
      var coin;
      for(var i = 0; i < columns * rows; i++) {
        coin = this.createCoin(this.spawnX, coinSpawnY)
        coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * this.coinSpacingX);
        coin.y = coinSpawnY + (coinRowCounter * coin.height) + (coinRowCounter * this.coinSpacingY);
        coinColumnCounter++
        if(i+1 >= columns && (i+1) % columns === 0) {
          coinRowCounter++
          coinColumnCounter = 0
        } 
      }
    },
    generateEnemy: function() {
      var enemy = this.enemies.getFirstExists(false)
      var x = this.spawnX
      var y = this.game.rnd.integerInRange(50, this.game.world.height - 192)
      
      if(!enemy) {
        enemy = new Enemy(this.game, 0, 0, 'missile')
        this.enemies.add(enemy);
      }

      enemy.reset(x, y);
      enemy.revive();
    },
    groundHit: function() {
      this.player.angle = 0;
      this.player.body.velocity.y = -200
    },
    coinHit: function(player, coin) {
      this.score++
      this.coinSound.play()
      this.collection.score = this.score
      this.collection.$save().then(function(ref) {
        //console.log('Got a Coin!', this.collection.score)
      }, function(error) {
        console.log("Error:", error);
      });
      coin.kill()
      var dummyCoin = new Coin(this.game, coin.x, coin.y)
      this.game.add.existing(dummyCoin)
      dummyCoin.animations.play('spin', 40, true)

      var scoreTween = this.game.add.tween(dummyCoin).to(
        {x: 50, y:50}, 300, Phaser.Easing.Linear.NONE, true
      )
      scoreTween.onComplete.add(function() {
        dummyCoin.destroy()
        this.scoreText.text = 'Score: ' + this.score
      }, this)
    },
    enemyHit: function(player, enemy) {
      this.player.alive = false
      this.player.animations.stop()
      this.shadow.destroy()
      this.deathSound.play()
      
      this.gameMusic.stop()
      enemy.kill()

      if(this.jetpackSound.isPlaying) {
        this.jetpackSound.stop()
      }

      this.ground.stopScroll()
      this.background.stopScroll()
      this.foreground.stopScroll()

      this.enemies.setAll('body.velocity.x', 0)
      this.coins.setAll('body.velocity.x', 0)
      
      this.enemyGenerator.timer.stop()
      this.coinGenerator.timer.stop()

      var deathTween = this.game.add.tween(this.player).to({angle:180}, 2000, Phaser.Easing.Bounce.Out, true);
      deathTween.onComplete.add(this.showScoreboard, this)
    },
    showScoreboard: function() {
      this.scoreboard.show(this.score)
    }
  }
})