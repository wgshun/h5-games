import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    console.log('BootScene: Creating placeholder graphics...');
    
    // Create simple colored rectangles as placeholders
    this.createPlaceholderGraphics();
  }

  create() {
    console.log('BootScene: Assets loaded, starting MainMenuScene');
    this.scene.start('MainMenuScene');
  }

  /**
   * Create simple geometric shapes as placeholder graphics
   */
  private createPlaceholderGraphics() {
    // Sky - light blue gradient background
    const skyTexture = this.add.graphics();
    skyTexture.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4682B4, 0x4682B4);
    skyTexture.fillRect(0, 0, 800, 600);
    skyTexture.generateTexture('sky', 800, 600);
    skyTexture.destroy();

    // Ground - transparent rectangle (invisible physics body)
    const groundTexture = this.add.graphics();
    groundTexture.fillStyle(0x000000, 0); // Transparent
    groundTexture.fillRect(0, 0, 400, 32);
    groundTexture.generateTexture('ground', 400, 32);
    groundTexture.destroy();

    // Star - yellow star shape
    const starTexture = this.add.graphics();
    starTexture.fillStyle(0xFFD700);
    starTexture.beginPath();
    // Simple star shape (5 points)
    const centerX = 16, centerY = 16, radius = 12;
    for (let i = 0; i < 5; i++) {
      const angle1 = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const angle2 = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
      
      if (i === 0) {
        starTexture.moveTo(centerX + Math.cos(angle1) * radius, centerY + Math.sin(angle1) * radius);
      } else {
        starTexture.lineTo(centerX + Math.cos(angle1) * radius, centerY + Math.sin(angle1) * radius);
      }
      starTexture.lineTo(centerX + Math.cos(angle2) * radius * 0.5, centerY + Math.sin(angle2) * radius * 0.5);
    }
    starTexture.closePath();
    starTexture.fillPath();
    starTexture.generateTexture('star', 32, 32);
    starTexture.destroy();

    // Bomb - red circle with black outline
    const bombTexture = this.add.graphics();
    bombTexture.fillStyle(0xFF0000);
    bombTexture.fillCircle(16, 16, 14);
    bombTexture.lineStyle(2, 0x000000);
    bombTexture.strokeCircle(16, 16, 14);
    bombTexture.generateTexture('bomb', 32, 32);
    bombTexture.destroy();

    // Player (dude) - simple blue rectangle with face
    const dudeTexture = this.add.graphics();
    // Body
    dudeTexture.fillStyle(0x0066CC);
    dudeTexture.fillRect(4, 16, 24, 32);
    // Head
    dudeTexture.fillStyle(0xFFDBB3);
    dudeTexture.fillCircle(16, 12, 8);
    // Eyes
    dudeTexture.fillStyle(0x000000);
    dudeTexture.fillCircle(13, 10, 1);
    dudeTexture.fillCircle(19, 10, 1);
    // Mouth
    dudeTexture.lineStyle(1, 0x000000);
    dudeTexture.beginPath();
    dudeTexture.arc(16, 12, 3, 0, Math.PI);
    dudeTexture.strokePath();
    dudeTexture.generateTexture('dude', 32, 48);
    dudeTexture.destroy();

    console.log('BootScene: Placeholder graphics created successfully');
  }
} 