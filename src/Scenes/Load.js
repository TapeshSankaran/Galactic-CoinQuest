class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        this.load.image("tilemap_tiles", "tilemap_packed.png");                      
        this.load.image("box", "box.png");                         
        this.load.image("cavebg", "cavebg.png");                   
        this.load.image("title", "title.png");                     
        this.load.image("endscrn", "endScreen.png");               
        this.load.image("background", "background.png");           
        this.load.image("loadscrn", "loading screen.png");         
        this.load.image("controlscrn", "controls.png");            
        this.load.image("winScreen", "winScreen.png");             
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");  
        this.load.tilemapTiledJSON("platformer-level-2", "platformer-level-2.tmj");  
        this.load.tilemapTiledJSON("platformer-level-3", "platformer-level-3.tmj");  
        this.load.tilemapTiledJSON("platformer-level-4", "platformer-level-4.tmj");  
      
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("buttonPress", "buttonPress.png", {
            frameWidth: 18,
            frameHeight: 6
        });

        this.load.spritesheet("lockedDoor", "lockedDoor.png", {
            frameWidth: 32,
            frameHeight: 8
        });

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });


        this.load.spritesheet("coinSpin", "coinSpin.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("ballSpin", "SpikeBall.png", {
            frameWidth: 21,
            frameHeight: 21
        });

        this.load.spritesheet("flagWave", "flagwave.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("jumpXtd", "JumpBounce.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.audio('boom', ['explosion.mp3']);
        this.load.audio('run', ['runningDirt.mp3']);
        this.load.audio('shrink', ['shrink.mp3']);
        this.load.audio('jump', ['jump.mp3']);
        this.load.audio('pickup', ['pickup.mp3']);
        this.load.image('red', 'red.png');
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 6,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'coinAnim',
            frames: this.anims.generateFrameNumbers('coinSpin', { start: 0, end: 1}),
            frameRate: 10, 
            repeat: -1 
        });

        this.anims.create({
            key: 'buttonPress',
            frames: this.anims.generateFrameNumbers('buttonPress', { start: 0, end: 1}), 
            frameRate: 10, 
    
        });

        this.anims.create({
            key: 'doorAnim',
            frames: this.anims.generateFrameNumbers('lockedDoor', { start: 0, end: 9}), 
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: 'flagAnim',
            frames: this.anims.generateFrameNumbers('flagWave', { start: 0, end: 1}),  
            frameRate: 3, 
            repeat: -1 
        });

        this.anims.create({
            key: 'ballAnim',
            frames: this.anims.generateFrameNumbers('ballSpin', { start: 0, end: 1}), 
            frameRate: 25, 
            repeat: -1 
        });

        this.anims.create({
            key: 'jumpExtend',
            frames: this.anims.generateFrameNumbers('jumpXtd', { start: 1, end: 0}), 
            frameRate: 1,
            
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0006.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0007.png" }
            ],
        });

        

         
         this.scene.start("startScreen");
    }

    
    update() {
    }
}

class StartScreen extends Phaser.Scene {
    constructor() {
        super("startScreen");
    }

    create() {
        this.registry.set('score', 0);

        this.bg = this.add.image(450, 450, 'title')
            .setScale(1.13)
        this.enterText = this.add.text(450, 800, 'Press R to enter.\nPress C to see controls', {
            fontSize: 32, 
            color: '#FFCD3D', 
            align: 'center'
        }).setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: this.enterText,
            alpha: {from: 1, to: 0.4},
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.control = this.add.image(450, 450, 'controlscrn')
                .setOrigin(0.5, 0.5)
                .setScale(0.75)
        this.control.visible = false;

        this.input.keyboard.on('keydown-R', () => {
            this.load = this.add.image(this.cameras.main.x, this.cameras.main.y, "loadscrn")
                .setOrigin(0, 0)
                .setScale(0.75)
            this.scene.start('level1');
        });

        this.input.keyboard.on('keydown-C', () => {
            if (this.control.visible == false)
                this.control.visible = true;
            else 
                this.control.visible = false;

        });
    }

    
}

class EndScreen extends Phaser.Scene {
    constructor() {
        super("endScreen");
    }

    create() {
        this.bg = this.add.image(450, 450, 'endscrn')
            .setScale(1.13)

        this.restartText = this.add.text(450, 800, 'Press R to return to start.\nPress C to see controls', {
            fontSize: 32,
            strokeThickness: 4, 
            color: '#000000', 
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.exitText = this.add.text(450, 450, 'You left the planet with\n' + this.registry.get('score') + ' coins', {
            fontSize: 32,
            strokeThickness: 2, 
            color: '#000000', 
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: this.restartText,
            alpha: {from: 1, to: 0.4},
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        this.control = this.add.image(450, 450, 'controlscrn')
                .setOrigin(0.5, 0.5)
                .setScale(0.75)
        this.control.visible = false;

        this.input.keyboard.on('keydown-R', () => {
            this.load = this.add.image(this.cameras.main.x, this.cameras.main.y, "loadscrn")
                .setOrigin(0, 0)
                .setScale(0.75)
            this.scene.start('loadScene');
        });

        this.input.keyboard.on('keydown-C', () => {
            if (this.control.visible == false)
                this.control.visible = true;
            else 
                this.control.visible = false;

        });
    }

    
}
