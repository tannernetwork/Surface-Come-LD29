LDGame.Menu = function (game){};

LDGame.Menu.prototype = {
    create: function ()
    {
        if(!localStorage.save)
        {
        	LDGame.saveData = {
        		distance: 0,
        		achievement: false,
        		diamonds: 0,
        		upLives: 1,
        		upItems: 1
        	}
        	this.save();
        }

        this.loadSave();

        this.stage.visibilityChange = this.visibilityChange.bind(this);
        this.soundx = this.add.sound('menu-music', 0.2, true);
        this.soundx.play();

        var bg = this.add.sprite(480, 270, 'background');
        bg.anchor.setTo(0.5);

        this.full = this.add.group();
        this.full.add(bg);
        this.full.y = 100;
        this.full.angle = -10;

       	logo = this.add.text(this.game.world.centerX, 180, 'Surface Come', {font: '40px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: 'red'});
       	logo.anchor.setTo(0.5);

       	info = this.add.text(this.game.world.centerX, 220, 'Developed by Tanner for LD29', {font: '20px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#333'});
       	info.anchor.setTo(0.5);

       	inst = this.add.text(940, 580, 'Click to jump\nAvoid obstacles\nCollect lives and diamonds', {font: '18px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#333', align: 'right'});
       	inst.anchor.setTo(1);

       	click = this.add.text(this.game.world.centerX, 520, 'Click to begin...', {font: '20px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#555'});
       	click.anchor.setTo(0.5);

   	   	if(LDGame.intro)
   	   	{
	       	var hs = this.add.text(20, 580, 'Top Distance: '+LDGame.saveData.distance+'M', {font: '18px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#333', align: 'left'});
	       	hs.anchor.setTo(0, 1);

	       	var diamonds = this.add.sprite(20, 20, 'items');
	       	diamonds.frame = 2;
	       	var diamondsText = this.add.text(50, 30, LDGame.saveData.diamonds, {font: '20px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#555', align: 'left'});
	       	diamondsText.anchor.setTo(0, 0.5);

	       	var music = this.add.text(940, 30, 'MUSIC', {font: '18px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: LDGame.mute?'#333':'red', align: 'left'});
	       	music.anchor.setTo(1, 0.5);
	       	music.inputEnabled = true;

          //upgrades
          this.add.text(20, 50, 'Achievements:', {font: '20px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: '#333'});
          var achievement = this.add.text(20, 80, 'What doesn\'t kill you\nharm you longer', {font: '20px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: LDGame.saveData.achievement?'red':'#333'});

          var uplives = this.add.sprite(400, 300, 'items');
          uplives.frame = 1;
          var upitems = this.add.sprite(400, 340, 'items');
          upitems.frame = 2;
          this.uplivesText = this.add.text(425, 310, 'x'+LDGame.saveData.upLives+' '+LDGame.saveData.upLives*10+' diamonds', {font: '18px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: LDGame.saveData.upLives*10<=LDGame.saveData.diamonds?'red':'#333'})
          this.uplivesText.anchor.setTo(0, 0.5);
          this.upitemsText = this.add.text(425, 350, 'x'+LDGame.saveData.upItems+' '+LDGame.saveData.upItems*10+' diamonds', {font: '18px "Trebuchet MS", Helvetica, sans-serif, Arial', fill: LDGame.saveData.upItems*10<=LDGame.saveData.diamonds?'red':'#333'})
          this.upitemsText.anchor.setTo(0, 0.5);
          this.uplivesText.inputEnabled = true;
          this.upitemsText.inputEnabled = true;

          this.uplivesText.events.onInputDown.add(function()
          {
            if(LDGame.saveData.upLives*10 > LDGame.saveData.diamonds)
              return false;
            if(LDGame.saveData.upLives == 5)
            {
              return false;
              this.uplivesText.setText('x5');
              this.uplivesText.fill = '#333';
            }
            LDGame.saveData.diamonds -= 10*LDGame.saveData.upLives;
            LDGame.saveData.upLives++;
            this.uplivesText.setText('x'+LDGame.saveData.upLives+' '+LDGame.saveData.upLives*10+' diamonds');
            if(LDGame.saveData.upLives*10 > LDGame.saveData.diamonds)
              this.uplivesText.fill = '#333';
            if(LDGame.saveData.upItems*10 > LDGame.saveData.diamonds)
              this.upitemsText.fill = '#333';
            diamondsText.setText(LDGame.saveData.diamonds);
            this.save();
          }, this);
          this.upitemsText.events.onInputDown.add(function()
          {
            if(LDGame.saveData.upItems*10 > LDGame.saveData.diamonds)
              return false;
            if(LDGame.saveData.upItems == 5)
            {
              return false;
              this.upitemsText.setText('x5');
              this.upitemsText.fill = '#333';
            }
            LDGame.saveData.diamonds -= 10*LDGame.saveData.upItems;
            LDGame.saveData.upItems++;
            this.upitemsText.setText('x'+LDGame.saveData.upItems+' '+LDGame.saveData.upItems*10+' diamonds');
            if(LDGame.saveData.upLives*10 > LDGame.saveData.diamonds)
              this.uplivesText.fill = '#333';
            if(LDGame.saveData.upItems*10 > LDGame.saveData.diamonds)
              this.upitemsText.fill = '#333';
            diamondsText.setText(LDGame.saveData.diamonds);
            this.save();
          }, this);

	       	music.events.onInputDown.add(function()
       		{
       			music.fill = music.fill == 'red' ? '#333' : 'red';
       			LDGame.mute = !LDGame.mute;
       		}, this);

   	   		click.setText('Click here to begin...');
   	   		click.inputEnabled = true;
   	   		click.events.onInputDown.add(function()
   	   		{
              this.soundx.stop();
        		  this.state.start('Game');
        	}, this);

   	   	}
   	   	else
   	   	{
	        this.input.onDown.add(function()
	        {
              LDGame.intro = true;
	        	  this.soundx.stop();
            	this.state.start('Game');
	        }, this);
   	   	}

       	this.time.events.loop(500, function()
       	{
			var wag = this.add.sprite(960, 120, 'train');
			this.physics.enable(wag, Phaser.Physics.ARCADE);
			wag.body.velocity.x = -1600;
			this.full.add(wag);
       	}, this);

    },

    update: function ()
    {
        this.sound.mute = LDGame.mute;
        if(LDGame.intro)
        {
          if(LDGame.saveData.upLives == 5)
          {
            this.uplivesText.setText('x5');
            this.uplivesText.fill = '#333';
          }
          if(LDGame.saveData.upItems == 5)
          {
            this.upitemsText.setText('x5');
            this.upitemsText.fill = '#333';
          }
        }
    },

    visibilityChange: function(e)
    {
        if(e.type == 'blur')
        {
            this.game.paused = true;
        }
        if(e.type == 'focus')
        {
            this.game.paused = false;
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
