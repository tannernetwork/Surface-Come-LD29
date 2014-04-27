LDGame.Game = function (game){
    this.levels = [
        ["Level: 1", "Tanner"],
        ["Level: 2", "Ludum Dare 29"],
        ["Level: 3", "I don't have clothes"],
        ["Level: 4", "Vote for better text"],
        ["Level: Beneath the Surface", "What doesn\'t kill you harm you longer"]
    ];
};

LDGame.Game.prototype = {

    create: function () {
        this.loadSave();
        //init
        this.lives = 3;
        this.maxLives = (LDGame.saveData.upLives-1)*6+3;
        this.speed = 0;
        this.distance = 0;
        this.diamonds = 0;

        this.stage.visibilityChange = this.visibilityChange.bind(this);

        var bg = this.add.sprite(480, 270, 'background');
        this.soundx = this.add.sound('run-music', 1, true);
        this.soundx.play();
        bg.anchor.setTo(0.5);

        this.hero = this.add.sprite(160, 420, 'hero');
        this.hero.scale.setTo(8);
        this.hero.anchor.setTo(0.5, 1);
        this.hero.animations.add('run');
        this.hero.animations.play('run', 12, true);
        this.hero.smoothed = false;
        this.physics.enable(this.hero, Phaser.Physics.ARCADE);

        this.livesGui = this.add.group();
        this.renderLives();

        this.full = this.add.group();
        this.full.add(bg);
        this.full.y = 100;
        this.full.angle = -10;

        this.add.tween(this.full).to({angle: -10.4}, 50, Phaser.Easing.Linear.In, true, 0, Number.MAX_VALUE, true);

        this.obstacles = this.add.group();
        this.obstacles.enableBody = true;
        this.obstacles.physicsBodyType = Phaser.Physics.ARCADE;

        this.items = this.add.group();
        this.items.enableBody = true;
        this.items.physicsBodyType = Phaser.Physics.ARCADE;

        this.full.add(this.obstacles);
        this.full.add(this.items);

        //jump
        this.input.onDown.add(function()
        {
            this.heroJump();
        }, this);

        //hero over
        this.full.add(this.hero);

        //gui
        this.pausedGui = this.add.text(this.game.world.centerX, this.game.world.centerY, 'PAUSED', {font: '32px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: 'red'});
        this.pausedGui.anchor.setTo(0.5);
        this.pausedGui.visible = false;

        this.distanceGui = this.add.text(940, 580, 'Beneath the Surface...', {font: '20px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#1af', align: 'right'});
        this.distanceGui.anchor.setTo(1, 1);

        this.levelGui = this.add.text(this.game.world.centerX, 180, '', {font: '32px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: 'red'});
        this.levelGui.anchor.setTo(0.5);
        this.quoteGui = this.add.text(this.game.world.centerX, 520, '', {font: '24px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#333'});
        this.quoteGui.anchor.setTo(0.5);

        //generate obstacles
        this.time.events.add(1000, function(){
            this.addDistance();
            this.genObstacle();
        }, this);

        this.nextLevel();
    },

    update: function () {
        this.sound.mute = LDGame.mute;
        this.hero.x = this.input.x * Math.cos(Math.PI/18) - 40;

        this.physics.arcade.overlap(this.hero, this.obstacles, this.heroDie, null, this);
        this.physics.arcade.overlap(this.hero, this.items, this.collect, null, this);

    },

    renderLives: function ()
    {
        for(var i = 0; i < this.lives; i++)
        {
            var lines = Math.floor(i / 10);
            var life = this.add.sprite(40*i+20-10*40*lines, 40*lines+20, 'items');
            life.frame = 1;
            this.livesGui.add(life);
        }
    },

    collect: function (hero, item)
    {
        if(item.diamond)
        {
            this.diamonds++;
            item.kill();
        }
        else
        if(this.lives < this.maxLives)
        {
            this.livesGui.removeAll();
            item.kill();
            this.lives++;
            this.renderLives();
        }
    },

    heroDie: function (hero, obstacle)
    {
        if(!obstacle.collided && this.lives > 0)
        {
            var hurt = this.add.emitter(hero.x, hero.y - 60, 4);
            hurt.makeParticles('particles');
            hurt.start(true, 500, null, 4);
            hurt.frame = 1;
            this.full.add(hurt);
            obstacle.collided = true;
            this.time.events.add(500, function(){obstacle.collided = false;});
            this.livesGui.removeAll();
            this.lives--;
            this.renderLives();
            if(this.lives == 0)
            {
                LDGame.saveData.diamonds += this.diamonds;
                if(LDGame.saveData.distance < this.distance)
                    LDGame.saveData.distance = this.distance;
                this.save();
                var collectedText = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Diamonds: '+this.diamonds+'\n\nDistance: '+this.distance+'M', {font: '32px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#555', align: 'center'});
                collectedText.anchor.setTo(0.5);
                var fadeSound = this.add.tween(this.soundx).to({volume: 0}, 5000, Phaser.Easing.Linear.In, true)
                fadeSound.onComplete.add(function()
                {
                    this.soundx.stop();
                    this.state.start('Menu');
                }, this);
                hero.kill();
                this.obstacles.setAll('body.velocity.x', 0);
                this.items.setAll('body.velocity.x', 0);
            }
        }
    },

    heroJump: function ()
    {
        if(!this.hero.jumping)
        {
            var fallTween = this.add.tween(this.hero).to( { y: 420 }, 250, Phaser.Easing.Quadratic.In);
            var jumpTween = this.add.tween(this.hero).to( { y: 240 }, 300, Phaser.Easing.Quadratic.Out).chain(fallTween).start();
            fallTween.onComplete.add(function()
            {
                this.hero.jumping = false;
            }, this);
            this.hero.jumping = true;
        }
    },

    genObstacle: function ()
    {
        if(this.lives == 0)
        {
            return false;
        }
        var delay = 1000;
        switch(this.rnd.integerInRange(0, 5))
        {
            case 0:
                var lava = this.add.sprite(960, 405, 'lava');
                this.physics.enable(lava, Phaser.Physics.ARCADE);
                lava.body.velocity.x = -250*this.speed;
                this.obstacles.add(lava);
                delay = 1200;
            break;
            case 1:
                var cols = this.add.sprite(960, 350, 'cols');
                this.physics.enable(cols, Phaser.Physics.ARCADE);
                cols.body.velocity.x = -250*this.speed;
                this.obstacles.add(cols);
                delay = 1500;
            break;
            case 2:
                var cols = this.add.sprite(960, 110, 'cols');
                this.physics.enable(cols, Phaser.Physics.ARCADE);
                cols.body.velocity.x = -250*this.speed;
                cols.frame = 1;
                this.obstacles.add(cols);
                delay = 1500;

            break;
            case 3:
                var lava = this.add.sprite(960, 405, 'lava2');
                this.physics.enable(lava, Phaser.Physics.ARCADE);
                lava.body.velocity.x = -250*this.speed;
                this.obstacles.add(lava);
                delay = 2500;

            break;
            case 4:
                var obstacle = this.add.sprite(960, 350, 'obstacle');
                this.physics.enable(obstacle, Phaser.Physics.ARCADE);
                obstacle.body.velocity.x = -250*this.speed;
                this.obstacles.add(obstacle);
                delay = 3000;
            break;
        }
        if(this.speed == 0)
            this.time.events.add(100, this.genObstacle, this);
        else
            this.time.events.add(delay / this.speed, this.genObstacle, this);

        var rand = this.rnd.integerInRange(0, 100 - LDGame.saveData.upItems * 15);
        if(rand < 5)
        {
            var item = this.add.sprite(960+40*this.rnd.integerInRange(0, 10), this.rnd.integerInRange(0, 4)*40+160, 'items');
            this.physics.enable(item, Phaser.Physics.ARCADE);
            item.body.velocity.x = -250*this.speed;
            item.frame = 1;
            this.items.add(item);
        }
        if(rand >= 5 && rand < 15)
        {
            var item = this.add.sprite(960+40*this.rnd.integerInRange(0, 10), this.rnd.integerInRange(0, 4)*40+160, 'items');
            this.physics.enable(item, Phaser.Physics.ARCADE);
            item.body.velocity.x = -250*this.speed;
            item.frame = 2;
            item.diamond = true;
            this.items.add(item);
        }
    },

    addDistance: function ()
    {
        if(this.lives == 0)
            return false;
        this.distance = this.distance + this.speed+1;
        this.distanceGui.setText(this.distance+'M');
        this.time.events.add(50, this.addDistance, this);
    },

    nextLevel: function ()
    {
        if(this.speed < 5)
        {
            this.levelGui.visible = true;
            this.quoteGui.visible = true;
            this.speed++;
            this.levelGui.setText(this.levels[this.speed-1][0]);
            this.quoteGui.setText('"'+this.levels[this.speed-1][1]+'"');
            this.time.events.add(5000, function()
            {
                this.levelGui.visible = false;
                this.quoteGui.visible = false;
            }, this);
            this.time.events.add(40000+this.speed*10, function(){ this.nextLevel(); }, this);
            this.obstacles.setAll('body.velocity.x', -250*this.speed);
            this.items.setAll('body.velocity.x', -250*this.speed);
        }
        else
        {
            LDGame.saveData.achievement = true;
            this.save();
        }
    },

    visibilityChange: function(e)
    {
        if(e.type == 'blur')
        {
            this.game.paused = true;
            this.pausedGui.visible = true;
        }
        if(e.type == 'focus')
        {
            this.game.paused = false;
            this.pausedGui.visible = false;
        }
    },

    loadSave: function ()
    {
        LDGame.saveData = JSON.parse(localStorage.save);
    },

    save: function ()
    {
        localStorage.save = JSON.stringify(LDGame.saveData);
    }

};