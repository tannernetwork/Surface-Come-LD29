LDGame = {
    intro: false,
    mute: false
};

LDGame.Boot = function (game){};

LDGame.Boot.prototype = {

    preload: function ()
    {
        this.load.image('tanner', 'assets/branding/tanner.png')
    },

    create: function ()
    {
        this.sound.mute = LDGame.mute;
        //physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.stage.backgroundColor = "#000";
        this.stage.disableVisibilityChange = true;
        this.state.start('Preload');
    }

};