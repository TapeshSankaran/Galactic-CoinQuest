class Level1 extends Phaser.Scene {
    
    constructor() {
        super("level1");
        this.restart = false;   
    }

    init() {
        this.ACCELERATION = 800;
        this.DRAG = 1000;   
        this.physics.world.gravity.y = 1000;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.coinsCollected = 0;
    }

    create() {


        this.score = 0;
        this.isPaused = false;
        this.boomSound = this.sound.add('boom', {volume: 1});
        this.shrink = this.sound.add('shrink', {volume: 1});
        this.jump = this.sound.add('jump', {volume: 0.5});
        this.pickup = this.sound.add('pickup', {volume: 1});
        
        this.bg = this.add.image(0, 200, "cavebg")
        .setScale(0.5, 0.5)
        .setOrigin(0, 0)
        .setScrollFactor(0.1)
        this.winScreen = this.add.tileSprite(0, 0, 15000, 2000, 'winScreen');
		this.winScreen.alpha = 0.7;
		this.winScreen.visible = false;

        
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 90, 90);
        

        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        // Create a layer
        this.bg = this.map.createLayer("Parallax", this.tileset, 75, 100)
            .setScrollFactor(0.5)
            .setAlpha(0.8)
        //this.bg.scale *= 0.75
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0)
            .setOrigin(0, 0)

        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin", 
            key: "tilemap_sheet"
        });

        this.anims.play('coinAnim', this.coins);

        this.jBoost = this.map.createFromObjects("Objects", {
            name: "JumpBoost",
            key: "tilemap_sheet",
            frame: 67
        });

        this.jPad = this.map.createFromObjects("Objects", {
            name: "JumpPad",
            key: "tilemap_sheet",
            frame: 107
        });
        

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.jPad, Phaser.Physics.Arcade.STATIC_BODY);
        
        this.physics.world.enable(this.jBoost, Phaser.Physics.Arcade.STATIC_BODY);

        this.coinGroup = this.add.group(this.coins);
        this.jumpGroup = this.add.group(this.jPad);
        this.boosterGroup = this.add.group(this.jBoost);

        

        my.vfx.pickup = this.add.particles(0, 0, "kenny-particles", {
            frame: ['flare_01.png', 'light_01.png', 'light_02.png', 'light_03.png'],
            random: true,
            scale: {start: 0.03, end: 0.05},
            maxAliveParticles: 20,
            frequency: 100,
            lifespan: 1000,
            gravityY: -50,
            gravityX: Phaser.Math.Between(-10, 10), 
            alpha: {start: 1, end: 0.1}
        });

   
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        this.physics.world.debugGraphic.clear()

        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);


        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_01.png', 'star_02.png', 'star_03.png'],
            random: true,
            scale: {start: 0.03, end: 0.04},
            
            lifespan: 500,
            frequency: 50
        });

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['muzzle_01.png', 'muzzle_04.png'],
            random: true,
            scaleX: {start: 0.07, end: 0.1},
            scaleY: 0.07,
            
            lifespan: 300,

            alpha: {start: 1, end: 0.1}
        });

        my.vfx.walking.stop();
        
        //(this.map.heightInPixel);
        
        this.animatedTiles = [];

        let timer = this.time.addEvent({ delay: 600, callback: () => {
            this.map.replaceByIndex(34, 54, 0, 0, 3000, 1000, "Ground-n-Platforms");
            this.map.replaceByIndex(35, 36, 0, 0, 3000, 1000, "Ground-n-Platforms");
            this.map.replaceByIndex(55, 56, 0, 0, 3000, 1000, "Ground-n-Platforms");
            this.map.replaceByIndex(75, 76, 0, 0, 3000, 1000, "Ground-n-Platforms");
            this.map.replaceByIndex(34, 54, 0, 0, 3000, 1000, "Front");
            this.map.replaceByIndex(35, 36, 0, 0, 3000, 1000, "Front");
            this.map.replaceByIndex(55, 56, 0, 0, 3000, 1000, "Front");
            this.map.replaceByIndex(75, 76, 0, 0, 3000, 1000, "Front");
            this.map.replaceByIndex(34, 54, 0, 0, 3000, 1000, "Parallax");
            this.map.replaceByIndex(35, 36, 0, 0, 3000, 1000, "Parallax");
            this.map.replaceByIndex(55, 56, 0, 0, 3000, 1000, "Parallax");
            this.map.replaceByIndex(75, 76, 0, 0, 3000, 1000, "Parallax");
            this.map.replaceByIndex(34, 54, 0, 0, 3000, 1000, "FrontParallax");
            this.map.replaceByIndex(35, 36, 0, 0, 3000, 1000, "FrontParallax");
            this.map.replaceByIndex(55, 56, 0, 0, 3000, 1000, "FrontParallax");
            this.map.replaceByIndex(75, 76, 0, 0, 3000, 1000, "FrontParallax");

            this.time.delayedCall(300, () => {
                this.map.replaceByIndex(54, 34, 0, 0, 3000, 1000,  "Ground-n-Platforms");
                this.map.replaceByIndex(36, 35, 0, 0, 3000, 1000,  "Ground-n-Platforms");
                this.map.replaceByIndex(56, 55, 0, 0, 3000, 1000,  "Ground-n-Platforms");
                this.map.replaceByIndex(76, 75, 0, 0, 3000, 1000,  "Ground-n-Platforms");
                this.map.replaceByIndex(54, 34, 0, 0, 3000, 1000,  "Front");
                this.map.replaceByIndex(36, 35, 0, 0, 3000, 1000,  "Front");
                this.map.replaceByIndex(56, 55, 0, 0, 3000, 1000,  "Front");
                this.map.replaceByIndex(76, 75, 0, 0, 3000, 1000,  "Front");
                this.map.replaceByIndex(54, 34, 0, 0, 3000, 1000,  "Parallax");
                this.map.replaceByIndex(36, 35, 0, 0, 3000, 1000,  "Parallax");
                this.map.replaceByIndex(56, 55, 0, 0, 3000, 1000,  "Parallax");
                this.map.replaceByIndex(76, 75, 0, 0, 3000, 1000,  "Parallax");
                this.map.replaceByIndex(54, 34, 0, 0, 3000, 1000,  "FrontParallax");
                this.map.replaceByIndex(36, 35, 0, 0, 3000, 1000,  "FrontParallax");
                this.map.replaceByIndex(56, 55, 0, 0, 3000, 1000,  "FrontParallax");
                this.map.replaceByIndex(76, 75, 0, 0, 3000, 1000,  "FrontParallax");
            });
        }, callbackScope: this, loop: true });


        this.emerScreen = this.add.tileSprite(0, 0, 15000, 2000, 'red');
		this.emerScreen.alpha = 0;

        my.sprite.player = this.physics.add.sprite(300, 300, "platformer_characters", "tile_0003.png")
            .setScale(0.8)
        my.sprite.player.setCollideWorldBounds(true);

        

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        this.cameras.main.startFollow(my.sprite.player, true, 100, 100);
        
        this.cameras.main.setDeadzone(500, 400);
        this.cameras.main.setZoom(1.7);

        my.sprite.player.x = 50;
        my.sprite.player.y = 400;

        this.enemies = this.map.getObjectLayer("Enemies");
        this.ballGroup = this.add.group();
        this.doorGroup = this.add.group();
        this.boxGroup = this.physics.add.group({
            dragX: 10,
            dragY: 10,
            collideWorldBounds: true
        });
        this.buttonGroup = this.add.group();
        this.flagGroup = this.add.group();
        this.enemies.objects.forEach(element => {
            if (element.name == "ballV") {
                this.ball = this.add.sprite(element.x, element.y, 'ballSpin')
                    .setOrigin(0, 1)
                    .setScale(0.86)
                    .play('ballAnim')
                this.physics.world.enable(this.ball, Phaser.Physics.Arcade.DYNAMIC_BODY);
                //(this.ball);
                this.ball.body.allowDrag = false;
                this.ball.body.allowGravity = false;
                this.ball.body.allowRotation = false;
                
                this.tweens.add({
                    targets: this.ball,
                    y: {
                        from: element.y,
                        to: element.properties[0].value,
                    },
                    yoyo: true,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                    duration: 1000
                })
                this.ballGroup.add(this.ball);
            }

            if (element.name == "ballH") {
                this.ball = this.add.sprite(element.x, element.y, 'ballSpin')
                    .setOrigin(0, 1)
                    .setScale(0.86)
                    .play('ballAnim')
                this.physics.world.enable(this.ball, Phaser.Physics.Arcade.DYNAMIC_BODY);
                //(this.ball.x);
                this.ball.body.allowDrag = false;
                this.ball.body.allowGravity = false;
                this.ball.body.allowRotation = false;
                
                this.tweens.add({
                    targets: this.ball,
                    x: {
                        from: element.x,
                        to: element.properties[0].value,
                    },
                    yoyo: true,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                    duration: 1000
                })
                this.ballGroup.add(this.ball);
            }

            if (element.name == "door") {
                this.door = this.add.sprite(element.x, element.y, 'lockedDoor')
                    .setOrigin(0, 1)
                    .setScale(1.2)
                    .play('doorAnim')
                this.physics.world.enable(this.door, Phaser.Physics.Arcade.STATIC_BODY);
                //(this.door);
                this.physics.add.collider(my.sprite.player, this.door);

                this.doorGroup.add(this.door);
            }

            if (element.name == "box") {
                this.box = this.add.sprite(element.x, element.y, 'box')
                    .setOrigin(0, 1)
                this.boxGroup.add(this.box);
            }

            if (element.name == "button") {
                this.button = this.add.sprite(element.x, element.y, 'buttonPress')
                    .setOrigin(0, 1)
                this.physics.world.enable(this.button, Phaser.Physics.Arcade.STATIC_BODY);
                //(this.button);
                this.buttonGroup.add(this.button);
            }

            if (element.name == "flag") {
                this.flag = this.add.sprite(element.x, element.y, 'flagWave')
                    .setOrigin(0, 1)
                    .play('flagAnim')
                //(element);
                my.vfx.pickup.x = element.x+9;
                my.vfx.pickup.y = element.y-9;
                my.vfx.pickup.setParticleSpeed(this.PARTICLE_VELOCITY/3, 0);
                my.vfx.pickup.start();
                this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);
                this.flagGroup.add(this.flag);
                
            }
            
        });

        this.physics.add.collider(this.boxGroup);
        this.physics.add.collider(this.groundLayer, this.boxGroup);
        this.physics.add.collider(my.sprite.player, this.boxGroup);

        my.sprite.player.body.mass = 1;

        this.buttonA = false;
        this.physics.add.overlap(this.boxGroup, this.buttonGroup, (obj1, obj2) => {
            if (!this.buttonA) {
                //("hello");
                this.anims.play('buttonPress', this.button);
                this.buttonA = true;
                this.door.body.enable = false;
                this.tweens.add({
                    targets: this.door,
                    x: {from: this.door.x, to: this.door.x - 36},
                    alpha: {from: 1, to: 0},
                    ease: 'Sine.easeInOut',
                    duration: 1000
                });
            }
        });


        this.spikes = this.map.createFromObjects("Objects", {
            name: "spikes",
            key: "tilemap_sheet",
            frame: 68,
        });

        this.frontLayer = this.map.createLayer("Front", this.tileset, 0, 0);
        this.frontPara = this.map.createLayer("FrontParallax", this.tileset, 0, 0)
            .setScale(1.5, 1.5)
            .setScrollFactor(1.5)

        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);
        this.spikeGroup = this.add.group(this.spikes);

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.pickup.play();
            this.coinsCollected++;
            this.coinText.setText("Coins Collected: " + (this.coinsCollected + this.registry.get('score')));
            //(this.registry.get('score'));
            obj2.destroy(); 
        });

        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            this.registry.set('score', this.registry.get('score')+this.coinsCollected);
            this.load = this.add.image(0, 0, "loadscrn")
            .setOrigin(0, 0)
            .setScale(0.75)
            this.scene.start("level2");
        });
        
        this.physics.add.overlap(my.sprite.player, this.jumpGroup, (obj1, obj2) => {
            my.sprite.player.body.setVelocityY(-850);
            this.jump.play({rate: 0.7});
            this.anims.play('jumpExtend', this.jPad);
        });

        this.physics.add.overlap(my.sprite.player, this.boosterGroup, (obj1, obj2) => {
            my.sprite.player.scale *= 0.5;
            this.cameras.main.setZoom(this.SCALE * 2);
            this.ACCELERATION = 200;
            obj2.destroy();

            this.time.delayedCall(5000, () => {
                this.ACCELERATION = 400;
                this.cameras.main.setZoom(this.SCALE * 1.5);
                my.sprite.player.scale *= 2;
            });
        });

        if (this.restart) {
            this.tweens.add({
                targets: this.emerScreen,
                alpha: { from: 1, to: 0},
                ease: 'Sine.easeOut',
                duration: 500
            
            });
        }

        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (obj1, obj2) => {
            this.boomSound.play();
            this.emerScreen.alpha = 1;
            this.frontLayer.alpha = 0;
            this.frontPara.alpha = 0;
            //("dead");
            this.restart = true;
            this.tweens.add({
                targets: this.cameras.main,
                zoom: { from: 3, to: 5},
                ease: 'Sine.easeOut',
                duration: 50
            
            });
            this.scene.restart();
            this.isPaused = true;
        });

        this.physics.add.overlap(my.sprite.player, this.ballGroup, (obj1, obj2) => {
            this.boomSound.play();
            this.emerScreen.alpha = 1;
            this.frontLayer.alpha = 0;
            this.frontPara.alpha = 0;
            //("dead");
            this.restart = true;
            this.tweens.add({
                targets: this.cameras.main,
                zoom: { from: 3, to: 5},
                ease: 'Sine.easeOut',
                duration: 50
            
            });
            this.scene.restart();
            this.isPaused = true;
        });

        this.coinText = this.add.text(450, 200, 'Coins Collected: ' + (this.registry.get('score') + this.coinsCollected), {
			fontSize: 18, 
			//color: '#FFC03D', 
            strokeThickness: 2, 
			color: '#000000', 
			align: 'center'
		}).setOrigin(0.5, 0.5).setScrollFactor(0)
    }

    delayedRestart () {
        this.spikeText = this.add.text(this.cameras.main.worldView.x+500, this.cameras.main.worldView.y+500, 'Press R\nto Restart', {
			fontSize: 32,
            font: 'Arial',
			//color: '#F43E3F', 
			color: '#000000', 
			align: 'center'
		}).setScrollFactor(1.5);
    }

    update() {

        if(cursors.left.isDown && !this.isPaused) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.start();


        } else if(cursors.right.isDown && !this.isPaused) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-12, my.sprite.player.displayHeight/2-10, false);

            my.vfx.walking.start();

        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        if(!my.sprite.player.body.blocked.down) {
            
            my.sprite.player.anims.play('jump');
            
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-12, my.sprite.player.displayHeight/2-10, false);

            my.vfx.walking.start();

        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) && !this.isPaused) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.jump.play({rate: 1});
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-12, my.sprite.player.displayHeight/2-10, false);
            my.vfx.jumping.start();
            this.time.delayedCall(10, () => {
                my.vfx.jumping.stop();
            });
            
        }
        if(my.sprite.player.body.blocked.right && !my.sprite.player.body.blocked.up) {
            this.DRAG = 5000;
            if (Phaser.Input.Keyboard.JustDown(cursors.up) && !this.isPaused) {
                my.sprite.player.body.setVelocityY(2*this.JUMP_VELOCITY/3);
                my.sprite.player.body.setVelocityX(2*this.JUMP_VELOCITY/3);
                this.jump.play({rate: 1});
                my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-12, my.sprite.player.displayHeight/2-10, false);
            }
            
        } else if (my.sprite.player.body.blocked.left && !my.sprite.player.body.blocked.up) {
            this.DRAG = 5000;
            if (Phaser.Input.Keyboard.JustDown(cursors.up) && !this.isPaused) {
                my.sprite.player.body.setVelocityY(2*this.JUMP_VELOCITY/3);
                my.sprite.player.body.setVelocityX(-2*this.JUMP_VELOCITY/3);
                this.jump.play({rate: 1});
                my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-12, my.sprite.player.displayHeight/2-10, false);
            }
        } else {
            this.DRAG = 2000;
        }

        
        

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        if (150 - this.score <= 0) {
            this.cameras.main.setOrigin(0.5, 0.5);
            this.winScreen.visible = true;
            this.coinText.setText("You Won! Press R to Restart!");
            this.isPaused = true;
            this.coinText.x = this.cameras.main.worldView.x;
            this.coinText.y = this.cameras.main.worldView.y;

        }

        if (this.isPaused) {
            this.delayedRestart();
        }
    }
}