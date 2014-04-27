LDGame.Preload = function (game){
    this.ready = false;
};

LDGame.Preload.prototype = {

    preload: function ()
    {
        this.logo = this.add.sprite(this.game.world.centerX, 300, 'tanner');
        this.logo.anchor.setTo(0.5);
        this.progress = this.add.text(940, 580, 'Beneath the Surface...', {font: '20px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#1af', align: 'right'});
        this.progress.anchor.setTo(1);

        this.load.image('tiles', 'assets/tiles.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.image('lava', 'assets/lava.png');
        this.load.image('lava2', 'assets/lava2.png');
        this.load.image('wanna', 'assets/wanna.png');
        this.load.image('train', 'assets/train.png');
        this.load.audio('run-music', ['assets/audio/run.mp3', 'assets/audio/run.ogg']);
        this.load.audio('menu-music', ['assets/audio/menu.mp3', 'assets/audio/menu.ogg']);
        this.load.spritesheet('hero', 'assets/hero.png', 5, 12);
        this.load.spritesheet('items', 'assets/items.png', 20, 20);
        this.load.spritesheet('cols', 'assets/cols.png', 40, 80);
        this.load.spritesheet('particles', 'assets/particles.png', 5, 5);
        this.load.onFileComplete.add(function()
        {
            this.progress.setText(this.load.progress+'%');
        }, this);
    },

    create: function ()
    {
        this.add.tween(this.logo).to({alpha: 0}, 1000, Phaser.Easing.Linear.In, true, 1000);
        this.add.tween(this.progress).to({alpha: 0}, 500, Phaser.Easing.Linear.In, true, 100);
        this.timer = this.game.time.now;
    },

    update: function ()
    {
        delay = this.game.time.now - this.timer;
        if (this.cache.isSoundDecoded('menu-music') && this.ready == false)// && delay > 2000)
        {
            this.ready = true;
            this.state.start('Menu');
        }
    }

};