import Phaser from 'phaser';
import { UITheme, createGradientBackground, createThemedBubble } from '../utils/UITheme';

export default class MainMenuScene extends Phaser.Scene {
  private titleContainer?: Phaser.GameObjects.Container;
  private playButton?: Phaser.GameObjects.Container;
  private decorativeBubbles?: Phaser.GameObjects.Group;
  private clouds?: Phaser.GameObjects.Group;
  private particleSystem?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create cartoon sky background
    this.createSkyBackground(width, height);

    // Create floating clouds
    this.createFloatingClouds(width, height);

    // Decorative bubbles removed for cleaner look

    // Create title with bubble style
    this.createBubbleTitle(width, height);

    // Create cartoon play button
    this.createCartoonPlayButton(width, height);

    // Add entrance animations
    this.playEntranceAnimations();

    // Setup input handlers
    this.setupInputHandlers();
  }

  /**
   * Create enchanting night sky background with stars
   */
  private createSkyBackground(width: number, height: number) {
    // Use night sky themed gradient background
    createGradientBackground(this, width, height, 'sky');
    
    // Add twinkling stars and magical particles
    this.createTwinklingStars(width, height);
    this.createMagicalParticles(width, height);
  }

  /**
   * Create magical floating particles
   */
  private createMagicalParticles(width: number, height: number) {
    // Since we don't have a sparkle texture, create simple graphics particles
    this.createSimpleParticles(width, height);
  }

  /**
   * Create beautiful twinkling stars across the night sky
   */
  private createTwinklingStars(width: number, height: number) {
    // Create large scattered stars
    for (let i = 0; i < 25; i++) {
      const star = this.add.graphics();
      const size = 1 + Math.random() * 3;
      const brightness = 0.6 + Math.random() * 0.4;
      
      // Create star shape
      star.fillStyle(UITheme.colors.starSilver, brightness);
      star.fillCircle(0, 0, size);
      
      // Add sparkle effect
      star.lineStyle(1, UITheme.colors.starGold, brightness * 0.8);
      star.strokeCircle(0, 0, size + 1);
      
      star.x = Math.random() * width;
      star.y = Math.random() * height * 0.7; // Keep stars in upper sky
      
      // Twinkling animation with varying speeds
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        scale: 0.8,
        duration: 1500 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 1000
      });
    }
    
    // Create constellation patterns
    this.createConstellations(width, height);
  }

  /**
   * Create small constellation patterns
   */
  private createConstellations(width: number, height: number) {
    const constellations = [
      { x: width * 0.2, y: height * 0.15, stars: 4 },
      { x: width * 0.7, y: height * 0.25, stars: 3 },
      { x: width * 0.4, y: height * 0.1, stars: 5 },
      { x: width * 0.8, y: height * 0.4, stars: 3 }
    ];

    constellations.forEach((constellation, constellationIndex) => {
      const stars: Phaser.GameObjects.Graphics[] = [];
      
      for (let i = 0; i < constellation.stars; i++) {
        const star = this.add.graphics();
        star.fillStyle(UITheme.colors.starGold, 0.8);
        star.fillCircle(0, 0, 2);
        
        const angle = (i / constellation.stars) * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        star.x = constellation.x + Math.cos(angle) * distance;
        star.y = constellation.y + Math.sin(angle) * distance;
        
        stars.push(star);
        
        // Synchronized twinkling for constellation effect
        this.tweens.add({
          targets: star,
          alpha: 0.4,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: constellationIndex * 500
        });
      }
      
      // Draw constellation lines
      const lines = this.add.graphics();
      lines.lineStyle(1, UITheme.colors.starSilver, 0.3);
      for (let i = 0; i < stars.length; i++) {
        const currentStar = stars[i];
        const nextStar = stars[(i + 1) % stars.length];
        lines.moveTo(currentStar.x, currentStar.y);
        lines.lineTo(nextStar.x, nextStar.y);
      }
      lines.strokePath();
    });
  }

  /**
   * Fallback method for simple particles
   */
  private createSimpleParticles(width: number, height: number) {
    for (let i = 0; i < 8; i++) {
      const sparkle = this.add.graphics();
      sparkle.fillStyle(UITheme.colors.starGold, 0.6);
      sparkle.fillCircle(0, 0, 2);
      sparkle.x = Math.random() * width;
      sparkle.y = Math.random() * height;
      
      // Gentle floating animation
      this.tweens.add({
        targets: sparkle,
        alpha: 0.3,
        duration: 1000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /**
   * Create moon and mystical night elements
   */
  private createFloatingClouds(width: number, _height: number) {
    this.clouds = this.add.group();

    // Create a beautiful moon
    this.createMoon(width * 0.85, 80);

    // Create some wispy night clouds (fewer and darker)
    const cloudPositions = [
      { x: 150, y: 120 },
      { x: 500, y: 90 },
      { x: 300, y: 160 }
    ];

    cloudPositions.forEach((pos, index) => {
      const cloud = this.createNightCloud(pos.x, pos.y, 0.5 + Math.random() * 0.3);
      this.clouds?.add(cloud);

      // Add gentle floating animation
      this.tweens.add({
        targets: cloud,
        x: pos.x + (Math.random() - 0.5) * 60,
        y: pos.y + (Math.random() - 0.5) * 20,
        alpha: 0.3,
        duration: 10000 + Math.random() * 5000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: index * 1500
      });
    });
  }

  /**
   * Create a beautiful glowing moon
   */
  private createMoon(x: number, y: number) {
    // Moon glow (outer effect)
    const moonGlow = this.add.graphics();
    moonGlow.fillStyle(0xFFFF99, 0.2);
    moonGlow.fillCircle(x, y, 45);
    
    // Moon surface
    const moon = this.add.graphics();
    moon.fillStyle(0xFFF8DC, 0.9); // Cream color
    moon.fillCircle(x, y, 35);
    
    // Moon craters/details
    const craters = this.add.graphics();
    craters.fillStyle(0xE6E6FA, 0.3); // Lighter lavender
    craters.fillCircle(x - 10, y - 5, 8);
    craters.fillCircle(x + 8, y + 10, 5);
    craters.fillCircle(x - 5, y + 15, 4);
    
    // Gentle pulsing glow animation
    this.tweens.add({
      targets: moonGlow,
      alpha: 0.1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create a wispy night cloud
   */
  private createNightCloud(x: number, y: number, scale: number): Phaser.GameObjects.Graphics {
    const cloud = this.add.graphics();
    cloud.fillStyle(0x483D8B, 0.4); // Dark slate blue, semi-transparent

    // Create cloud shape with multiple circles (smaller than day clouds)
    const circles = [
      { x: 0, y: 0, radius: 20 },
      { x: 15, y: -3, radius: 25 },
      { x: 30, y: 0, radius: 20 },
      { x: 10, y: -15, radius: 15 },
      { x: -10, y: -8, radius: 18 }
    ];

    circles.forEach(circle => {
      cloud.fillCircle(circle.x, circle.y, circle.radius);
    });

    cloud.setPosition(x, y);
    cloud.setScale(scale);
    cloud.setAlpha(0.4);

    return cloud;
  }

  /**
   * Create a single cloud shape (legacy, kept for compatibility)
   */
  private createCloud(x: number, y: number, scale: number): Phaser.GameObjects.Graphics {
    const cloud = this.add.graphics();
    cloud.fillStyle(0xFFFFFF, 0.9);

    // Create cloud shape with multiple circles
    const circles = [
      { x: 0, y: 0, radius: 25 },
      { x: 20, y: -5, radius: 30 },
      { x: 40, y: 0, radius: 25 },
      { x: 15, y: -20, radius: 20 },
      { x: -15, y: -10, radius: 22 }
    ];

    circles.forEach(circle => {
      cloud.fillCircle(circle.x, circle.y, circle.radius);
    });

    cloud.setPosition(x, y);
    cloud.setScale(scale);
    cloud.setAlpha(0.8);

    return cloud;
  }

  /**
   * Create colorful decorative bubbles
   */
  private createDecorativeBubbles(width: number, height: number) {
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

    // Create floating bubbles around the screen
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      const size = 15 + Math.random() * 25;

      const bubble = this.createBubble(x, y, size, color);
      this.decorativeBubbles.add(bubble);

      // Add floating animation
      this.tweens.add({
        targets: bubble,
        y: y - 50 - Math.random() * 100,
        alpha: 0.3,
        duration: 3000 + Math.random() * 2000,
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000
      });

      // Add gentle rotation
      this.tweens.add({
        targets: bubble,
        rotation: Math.PI * 2,
        duration: 5000 + Math.random() * 3000,
        repeat: -1,
        ease: 'Linear'
      });
    }
  }

  /**
   * Create a single bubble with shine effect
   */
  private createBubble(x: number, y: number, radius: number, color: number): Phaser.GameObjects.Container {
    const bubbleContainer = this.add.container(x, y);

    // Main bubble
    const bubble = this.add.graphics();
    bubble.fillStyle(color, 0.8);
    bubble.fillCircle(0, 0, radius);

    // Bubble outline
    bubble.lineStyle(3, 0xFFFFFF, 0.3);
    bubble.strokeCircle(0, 0, radius);

    // Shine effect
    const shine = this.add.graphics();
    shine.fillStyle(0xFFFFFF, 0.6);
    shine.fillCircle(-radius * 0.3, -radius * 0.3, radius * 0.3);

    bubbleContainer.add([bubble, shine]);
    return bubbleContainer;
  }

  /**
   * Create enhanced bubble-style title with modern design
   */
  private createBubbleTitle(width: number, height: number) {
    this.titleContainer = this.add.container(width / 2, height * 0.25);

    // Title card shadow
    const titleShadow = this.add.graphics();
    titleShadow.fillStyle(UITheme.colors.shadow, UITheme.shadows.card.alpha);
    titleShadow.fillRoundedRect(
      -210 + UITheme.shadows.card.offsetX, 
      -60 + UITheme.shadows.card.offsetY, 
      420, 
      120, 
      UITheme.components.card.borderRadius
    );

    // Main title card background
    const titleBg = this.add.graphics();
    titleBg.fillStyle(UITheme.colors.cardBackground, 0.95);
    titleBg.fillRoundedRect(-210, -60, 420, 120, UITheme.components.card.borderRadius);

    // Enhanced border with glow effect
    titleBg.lineStyle(UITheme.components.card.borderWidth, UITheme.colors.cardBorder, 1);
    titleBg.strokeRoundedRect(-210, -60, 420, 120, UITheme.components.card.borderRadius);

    // Enhanced title text
    const titleText = this.add.text(0, -15, '✨ Star Catcher ✨', {
      fontSize: UITheme.fontSizes.title,
      fontFamily: `${UITheme.fonts.title}, ${UITheme.fonts.fallback}`,
      color: '#4ECDC4',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtitle with better typography
    const subtitleText = this.add.text(0, 25, 'Catch falling stars and avoid the bombs!', {
      fontSize: UITheme.fontSizes.body,
      fontFamily: `${UITheme.fonts.body}, ${UITheme.fonts.fallback}`,
      color: '#7F8C8D',
      fontStyle: '600'
    }).setOrigin(0.5);

    // Create floating star decorations
    this.createFloatingStarDecorations();

    this.titleContainer.add([titleShadow, titleBg, titleText, subtitleText]);
    this.titleContainer.setAlpha(0).setScale(0.8);
  }

  /**
   * Create floating star decorations around title
   */
  private createFloatingStarDecorations() {
    if (!this.titleContainer) return;

    const starPositions = [
      { x: -180, y: -40, size: 0.7, color: UITheme.colors.starGold },
      { x: 180, y: -40, size: 0.8, color: UITheme.colors.starSilver },
      { x: -160, y: 40, size: 0.6, color: UITheme.colors.bubbleYellow },
      { x: 160, y: 40, size: 0.7, color: UITheme.colors.bubbleTeal }
    ];

    starPositions.forEach((pos, index) => {
      const star = this.add.graphics();
      star.fillStyle(pos.color, 0.9);
      
      // Create 5-pointed star
      const points = [];
      const outerRadius = 15 * pos.size;
      const innerRadius = 6 * pos.size;
      
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      
      star.fillPoints(points, true);
      star.setPosition(pos.x, pos.y);

      // Add sparkle animation
      this.tweens.add({
        targets: star,
        alpha: 0.5,
        scale: pos.size * 0.8,
        duration: 2000 + index * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.titleContainer?.add(star);
    });
  }

  /**
   * Create cartoon-style play button
   */
  private createCartoonPlayButton(width: number, height: number) {
    this.playButton = this.add.container(width / 2, height * 0.7);

    // Button shadow
    const buttonShadow = this.add.graphics();
    buttonShadow.fillStyle(0x000000, 0.2);
    buttonShadow.fillCircle(5, 8, 60);

    // Main button background
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x69DB7C, 1); // Green
    buttonBg.fillCircle(0, 0, 60);

    // Button border
    buttonBg.lineStyle(6, 0xFFFFFF, 1);
    buttonBg.strokeCircle(0, 0, 60);

    // Play icon (triangle)
    const playIcon = this.add.graphics();
    playIcon.fillStyle(0xFFFFFF, 1);
    playIcon.beginPath();
    playIcon.moveTo(-15, -20);
    playIcon.lineTo(-15, 20);
    playIcon.lineTo(20, 0);
    playIcon.closePath();
    playIcon.fillPath();

    // Button text
    const buttonText = this.add.text(0, 85, 'PLAY', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#2C3E50',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.playButton.add([buttonShadow, buttonBg, playIcon, buttonText]);
    this.playButton.setSize(120, 120);
    this.playButton.setInteractive();
    this.playButton.setAlpha(0).setScale(0.8);

    // Button interactions
    this.setupButtonInteractions(buttonBg);
  }

  /**
   * Setup button interactions with cartoon effects
   */
  private setupButtonInteractions(buttonBg: Phaser.GameObjects.Graphics) {
    if (!this.playButton) return;

    // Hover effect
    this.playButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.playButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Back.easeOut'
      });

      // Change button color on hover
      buttonBg.clear();
      buttonBg.fillStyle(0x51CF66, 1); // Lighter green
      buttonBg.fillCircle(0, 0, 60);
      buttonBg.lineStyle(6, 0xFFFFFF, 1);
      buttonBg.strokeCircle(0, 0, 60);
    });

    this.playButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.playButton,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Back.easeOut'
      });

      // Reset button color
      buttonBg.clear();
      buttonBg.fillStyle(0x69DB7C, 1); // Original green
      buttonBg.fillCircle(0, 0, 60);
      buttonBg.lineStyle(6, 0xFFFFFF, 1);
      buttonBg.strokeCircle(0, 0, 60);
    });

    // Click effect
    this.playButton.on('pointerdown', () => {
      // Bounce animation
      this.tweens.add({
        targets: this.playButton,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        yoyo: true,
        ease: 'Power2.easeInOut',
        onComplete: () => {
          this.startGameTransition();
        }
      });

      // Create burst effect
      this.createBurstEffect();
    });
  }

  /**
   * Create burst effect when button is clicked
   */
  private createBurstEffect() {
    if (!this.playButton) return;

    const burstColors = [0xFF6B9D, 0x4ECDC4, 0xFFE66D, 0xFF6B6B, 0x4DABF7];

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 80;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      const particle = this.add.graphics();
      particle.fillStyle(burstColors[i % burstColors.length], 1);
      particle.fillCircle(0, 0, 8);
      particle.setPosition(this.playButton.x, this.playButton.y);

      this.tweens.add({
        targets: particle,
        x: this.playButton.x + endX,
        y: this.playButton.y + endY,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        duration: 600,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Play entrance animations
   */
  private playEntranceAnimations() {
    // Title entrance
    this.tweens.add({
      targets: this.titleContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      y: this.titleContainer?.y! - 30,
      duration: 800,
      delay: 300,
      ease: 'Back.easeOut'
    });

    // Button entrance
    this.tweens.add({
      targets: this.playButton,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      delay: 800,
      ease: 'Back.easeOut'
    });

    // Add gentle floating animation to button
    this.tweens.add({
      targets: this.playButton,
      y: this.playButton?.y! - 15,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1500
    });
  }

  /**
   * Setup input handlers
   */
  private setupInputHandlers() {
    // Keyboard shortcuts
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        this.startGameTransition();
      }
    });
  }

  /**
   * Start game with cartoon transition
   */
  private startGameTransition() {
    console.log('Starting cartoon game transition...');

    // Create bubble transition effect
    const bubbleColors = [0xFF6B9D, 0x4ECDC4, 0xFFE66D, 0xFF6B6B, 0x4DABF7, 0x69DB7C];
    
    for (let i = 0; i < 20; i++) {
      const bubble = this.add.graphics();
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      bubble.fillStyle(color, 0.8);
      bubble.fillCircle(0, 0, 20 + Math.random() * 30);
      
      bubble.setPosition(
        Math.random() * this.cameras.main.width,
        this.cameras.main.height + 50
      );

      this.tweens.add({
        targets: bubble,
        y: -100,
        scaleX: 0.5,
        scaleY: 0.5,
        alpha: 0,
        duration: 1000 + Math.random() * 500,
        ease: 'Power2.easeOut',
        delay: i * 50,
        onComplete: () => bubble.destroy()
      });
    }

    // Fade out scene
    this.tweens.add({
      targets: [this.titleContainer, this.playButton],
      alpha: 0,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 600,
      ease: 'Power2.easeIn'
    });

    // Transition to game
    this.time.delayedCall(800, () => {
      this.scene.start('GameScene');
    });
  }
} 