angular.module('fireApp').factory("BootSvc", function() {

  return {
    resizeCanvasToContainerElement: function() {
      var canvas = this.game.canvas;

      var canvas          = this.game.canvas,
          containerWidth  = canvas.clientWidth,
          containerHeight = canvas.clientHeight;

      var xScale = containerWidth / this.width;
      var yScale = containerHeight / this.height;
      var newScale = Math.min( xScale, yScale );

      this.scale.width = newScale * this.game.width;
      this.scale.height = newScale * this.game.height;
      this.scale.reflowCanvas(containerWidth, containerHeight);

      // Game.width  = this.game.width;
      // Game.height = this.game.height;
    },
    init: function () {
      this.input.maxPointers = 1;
      this.stage.disableVisibilityChange = true;

      if (this.game.device.desktop) {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.setMinMax(480, 260, 2048, 1536);
        // this.scale.pageAlignHorizontally = true;
        // this.scale.pageAlignVertically = true;
      } else {
        this.game.stage.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.stage.scale.minWidth =  480;
        this.game.stage.scale.minHeight = 260;
        this.game.stage.scale.maxWidth = 640;
        this.game.stage.scale.maxHeight = 480;
        this.game.stage.scale.forceLandscape = true;
        this.game.stage.scale.pageAlignHorizontally = true;
      }

      this.scale.setResizeCallback(this.handleResizeEvent, this);

      this.scale.updateLayout(true);
      this.scale.refresh();
    },
    preload: function(){
      this.load.image('logo', 'assets/images/logo.png')
      this.load.image('preloadBar', 'assets/images/preloader-bar.png')
    },
    create: function(){
      if (this.game.device.desktop) {
       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //always show whole game
        this.game.stage.scale.pageAlignHorizontally = true;
      } else {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.forceLandscape = false;
        this.scale.pageAlignHorizontally = true;
      }
      this.resizeCanvasToContainerElement();
      this.game.initialized = true;
      this.state.start('Preloader');
    },
    handleResizeEvent: function() {
      this.resizeCanvasToContainerElement();
    }
  }
  //   preload: function() {
  //     this.load.image('logo', 'assets/images/logo.png')
  //     this.load.image('preloadBar', 'assets/images/preloader-bar.png')
  //   },
  //   create: function() {
  //     this.game.stage.backgroundColor = '#fff'
  //     this.input.maxPointers = 1
  //     console.log("Using this version", this.scale)

  //     if (this.game.device.desktop) {
  //       this.scale.pageAlignHorizontally = true
  //     } else {
  //       console.log("SCALE: ", this.scale)
  //       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  //       this.scale.minWidth = 568
  //       this.scale.minHeight = 600
  //       this.scale.maxWidth = 2048
  //       this.scale.maxHeight = 1536
  //       this.scale.forceLandscape = true
  //       this.scale.pageAlignHorizontally = true
  //       this.scale.updateLayout(true)
  //     }
  //     this.state.start('Preloader')
  //   }
  // }
})

// var JetPackFire = function() {};

// JetPackFire.Boot = function() {};

// JetPackFire.Boot.prototype =  {
	
// }