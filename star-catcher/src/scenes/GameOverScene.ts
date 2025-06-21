import Phaser from 'phaser';
import { UITheme, createGradientBackground, createThemedButton } from '../utils/UITheme';

export default class GameOverScene extends Phaser.Scene {
  private gameOverContainer?: Phaser.GameObjects.Container;
  private restartButton?: Phaser.GameObjects.Container;
  private menuButton?: Phaser.GameObjects.Container;
  private finalScore: number = 0;
  private decorativeBubbles?: Phaser.GameObjects.Group;

  constructor() {
    super('GameOverScene');
  }

  init(data: { score?: number }) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create cartoon overlay background
    this.createCartoonOverlay(width, height);

    // Create floating bubbles
    this.createFloatingBubbles(width, height);

    // Create main game over card
    this.createGameOverCard(width, height);

    // Create cartoon buttons
    this.createCartoonButtons(width, height);

    // Play entrance animations
    this.playEntranceAnimations();
  }

  /**
   * Create enhanced overlay background with consistent theming
   */
  private createCartoonOverlay(width: number, height: number) {
    // Semi-transparent dark overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(UITheme.colors.overlay, 0.6);
    overlay.fillRect(0, 0, width, height);

    // Add themed gradient overlay for depth
    createGradientBackground(this, width, height, 'ocean');
    
    // Set alpha for transparency
    const lastCreated = this.children.list[this.children.list.length - 1];
    if (lastCreated) {
      (lastCreated as Phaser.GameObjects.Graphics).setAlpha(0.3);
    }
  }

  /**
   * Create floating decorative bubbles
   */
  private createFloatingBubbles(width: number, height: number) {
    this.decorativeBubbles = this.add.group();

    const bubbleColors = [
      0xFF6B9D, // Pink
      0x4ECDC4, // Teal
      0xFFE66D, // Yellow
      0xFF6B6B, // Red
      0x4DABF7, // Blue
      0x69DB7C, // Green
      0xDA77F2, // Purple
      0xFFB366  // Orange
    ];

    // Create bubbles floating up from bottom
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * width;
      const y = height + 50;
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      const size = 20 + Math.random() * 30;

      const bubble = this.createBubble(x, y, size, color);
      this.decorativeBubbles?.add(bubble);

      // Floating animation
      this.tweens.add({
        targets: bubble,
        y: -100,
        x: x + (Math.random() - 0.5) * 200,
        alpha: 0.3,
        duration: 4000 + Math.random() * 2000,
        ease: 'Sine.easeInOut',
        delay: i * 300,
        repeat: -1
      });

      // Rotation animation
      this.tweens.add({
        targets: bubble,
        rotation: Math.PI * 2,
        duration: 3000 + Math.random() * 2000,
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  /**
   * Create a bubble with shine effect
   */
  private createBubble(x: number, y: number, radius: number, color: number): Phaser.GameObjects.Container {
    const bubbleContainer = this.add.container(x, y);

    // Main bubble
    const bubble = this.add.graphics();
    bubble.fillStyle(color, 0.7);
    bubble.fillCircle(0, 0, radius);

    // Bubble outline
    bubble.lineStyle(2, 0xFFFFFF, 0.4);
    bubble.strokeCircle(0, 0, radius);

    // Shine effect
    const shine = this.add.graphics();
    shine.fillStyle(0xFFFFFF, 0.5);
    shine.fillCircle(-radius * 0.25, -radius * 0.25, radius * 0.25);

    bubbleContainer.add([bubble, shine]);
    return bubbleContainer;
  }

  /**
   * Create main game over card
   */
  private createGameOverCard(width: number, height: number) {
    this.gameOverContainer = this.add.container(width / 2, height / 2);

    // Card shadow
    const cardShadow = this.add.graphics();
    cardShadow.fillStyle(0x000000, 0.3);
    cardShadow.fillRoundedRect(-180, -120, 360, 240, 30);
    cardShadow.setPosition(8, 12);

    // Main card background
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0xFFFFFF, 0.95);
    cardBg.fillRoundedRect(-180, -120, 360, 240, 30);

    // Card border
    cardBg.lineStyle(6, 0x4ECDC4, 1);
    cardBg.strokeRoundedRect(-180, -120, 360, 240, 30);

    // Game Over title
    const titleText = this.add.text(0, -70, 'Game Over!', {
      fontSize: '42px',
      fontFamily: 'Arial, sans-serif',
      color: '#E74C3C',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Score bubble background
    const scoreBubble = this.add.graphics();
    scoreBubble.fillStyle(0x4ECDC4, 0.9);
    scoreBubble.fillCircle(0, -10, 50);
    scoreBubble.lineStyle(4, 0xFFFFFF, 1);
    scoreBubble.strokeCircle(0, -10, 50);

    // Score text
    const scoreText = this.add.text(0, -10, this.finalScore.toString(), {
      fontSize: '28px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Score label
    const scoreLabelText = this.add.text(0, 50, 'Final Score', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#7F8C8D',
      fontStyle: 'normal'
    }).setOrigin(0.5);

    // Motivational message
    const messageText = this.add.text(0, 80, this.getMotivationalMessage(), {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#34495E',
      fontStyle: 'normal',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);

    this.gameOverContainer.add([
      cardShadow, cardBg, titleText, scoreBubble, scoreText, scoreLabelText, messageText
    ]);
    this.gameOverContainer.setAlpha(0).setScale(0.5);
  }

  /**
   * Create cartoon-style buttons
   */
  private createCartoonButtons(width: number, height: number) {
    const buttonY = height * 0.8;

    // Play Again button
    this.restartButton = this.createCartoonButton(
      width / 2 - 80,
      buttonY,
      'PLAY AGAIN',
      0x69DB7C, // Green
      0x51CF66,
      () => this.scene.start('GameScene')
    );

    // Main Menu button
    this.menuButton = this.createCartoonButton(
      width / 2 + 80,
      buttonY,
      'MAIN MENU',
      0x4DABF7, // Blue
      0x339AF0,
      () => this.scene.start('MainMenuScene')
    );
  }

  /**
   * Create a cartoon-style button
   */
  private createCartoonButton(
    x: number,
    y: number,
    text: string,
    color: number,
    hoverColor: number,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    // Button shadow
    const buttonShadow = this.add.graphics();
    buttonShadow.fillStyle(0x000000, 0.3);
    buttonShadow.fillRoundedRect(-60, -25, 120, 50, 25);
    buttonShadow.setPosition(4, 6);

    // Button background
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(color, 1);
    buttonBg.fillRoundedRect(-60, -25, 120, 50, 25);

    // Button border
    buttonBg.lineStyle(4, 0xFFFFFF, 1);
    buttonBg.strokeRoundedRect(-60, -25, 120, 50, 25);

    // Button text
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    button.add([buttonShadow, buttonBg, buttonText]);
    button.setSize(120, 50);
    button.setInteractive();

    // Button interactions
    this.setupButtonInteractions(button, buttonBg, color, hoverColor, onClick);

    button.setAlpha(0).setScale(0.8);
    return button;
  }

  /**
   * Setup cartoon button interactions
   */
  private setupButtonInteractions(
    button: Phaser.GameObjects.Container,
    buttonBg: Phaser.GameObjects.Graphics,
    normalColor: number,
    hoverColor: number,
    onClick: () => void
  ) {
    // Hover effect
    button.on('pointerover', () => {
      this.tweens.add({
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Back.easeOut'
      });

      // Change color on hover
      buttonBg.clear();
      buttonBg.fillStyle(hoverColor, 1);
      buttonBg.fillRoundedRect(-60, -25, 120, 50, 25);
      buttonBg.lineStyle(4, 0xFFFFFF, 1);
      buttonBg.strokeRoundedRect(-60, -25, 120, 50, 25);
    });

    button.on('pointerout', () => {
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeOut'
      });

      // Reset color
      buttonBg.clear();
      buttonBg.fillStyle(normalColor, 1);
      buttonBg.fillRoundedRect(-60, -25, 120, 50, 25);
      buttonBg.lineStyle(4, 0xFFFFFF, 1);
      buttonBg.strokeRoundedRect(-60, -25, 120, 50, 25);
    });

    // Click effect
    button.on('pointerdown', () => {
      // Bounce animation
      this.tweens.add({
        targets: button,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        ease: 'Power2.easeInOut',
        onComplete: () => {
          this.createClickBurst(button.x, button.y);
          onClick();
        }
      });
    });
  }

  /**
   * Create click burst effect
   */
  private createClickBurst(x: number, y: number) {
    const burstColors = [0xFF6B9D, 0x4ECDC4, 0xFFE66D, 0xFF6B6B, 0x4DABF7];

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 60;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      const particle = this.add.graphics();
      particle.fillStyle(burstColors[i % burstColors.length], 1);
      particle.fillCircle(0, 0, 6);
      particle.setPosition(x, y);

      this.tweens.add({
        targets: particle,
        x: x + endX,
        y: y + endY,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 500,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Get motivational message based on score
   */
  private getMotivationalMessage(): string {
    if (this.finalScore >= 100) {
      return 'Amazing! You\'re a star catching champion!';
    } else if (this.finalScore >= 50) {
      return 'Great job! Keep reaching for the stars!';
    } else if (this.finalScore >= 20) {
      return 'Good effort! Practice makes perfect!';
    } else {
      return 'Keep trying! Every star counts!';
    }
  }

  /**
   * Play entrance animations
   */
  private playEntranceAnimations() {
    // Main card entrance
    this.tweens.add({
      targets: this.gameOverContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      delay: 200,
      ease: 'Back.easeOut'
    });

    // Buttons entrance
    this.tweens.add({
      targets: [this.restartButton, this.menuButton],
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 600,
      ease: 'Back.easeOut'
    });

    // Add gentle floating animation to main card
    this.tweens.add({
      targets: this.gameOverContainer,
      y: this.gameOverContainer?.y! - 10,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1000
    });
  }
} 