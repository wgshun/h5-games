import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    
    // Set up physics properties
    this.setBounce(0.2);
    this.setOrigin(0.5, 1);
    // Adjust the physics body to be more accurate to the sprite shape
    (this.body as Phaser.Physics.Arcade.Body).setSize(20, 32);
    // Don't set gravity here - let the world gravity handle it
    
    // Set up input controls
    this.setupControls();
  }

  /**
   * Setup keyboard controls for player movement
   */
  private setupControls() {
    if (this.scene.input.keyboard) {
      // Arrow keys
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      
      // WASD keys
      this.wasd = this.scene.input.keyboard.addKeys('W,S,A,D');
    }
  }

  /**
   * Update player movement based on input
   */
  update() {
    if (!this.cursors && !this.wasd) return;

    const speed = 160;
    const jumpVelocity = -330;

    // Left movement
    if (this.cursors?.left.isDown || this.wasd?.A.isDown) {
      this.setVelocityX(-speed);
    }
    // Right movement
    else if (this.cursors?.right.isDown || this.wasd?.D.isDown) {
      this.setVelocityX(speed);
    }
    // Stop horizontal movement when no keys pressed
    else {
      this.setVelocityX(0);
    }

    // Jump (only when on ground)
    if ((this.cursors?.up.isDown || this.cursors?.space.isDown || this.wasd?.W.isDown) && this.body?.touching.down) {
      this.setVelocityY(jumpVelocity);
    }
  }
} 