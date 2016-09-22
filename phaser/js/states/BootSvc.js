angular.module('fireApp').factory("BootSvc", function() {

  return { 
    preload: function() {
      this.load.image('logo', 'assets/images/logo.png')
      this.load.image('preloadBar', 'assets/images/preloader-bar.png')
    },
    create: function() {
      this.game.stage.backgroundColor = '#fff'
      this.input.maxPointers = 1
      console.log("Using this version", this.scale)

      if (this.game.device.desktop) {
        this.scale.pageAlignHorizontally = true
      } else {
        console.log("SCALE: ", this.scale)
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
        this.scale.minWidth = 568
        this.scale.minHeight = 600
        this.scale.maxWidth = 2048
        this.scale.maxHeight = 1536
        this.scale.forceLandscape = true
        this.scale.pageAlignHorizontally = true
        this.scale.updateLayout(true)
      }
      this.state.start('Preloader')
    }
  }
})

// var JetPackFire = function() {};

// JetPackFire.Boot = function() {};

// JetPackFire.Boot.prototype =  {
	
// }