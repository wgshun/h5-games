import Phaser from 'phaser';
import Player from '../prefabs/Player';
import Bomb from '../prefabs/Bomb';
import { UITheme, createGradientBackground, createThemedBubble } from '../utils/UITheme';

export default class GameScene extends Phaser.Scene {
  private player?: Player;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private stars?: Phaser.Physics.Arcade.Group;
  private bombs?: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private scoreCard?: Phaser.GameObjects.Container;
  private gameOverTriggered: boolean = false;
  private clouds?: Phaser.GameObjects.Group;
  private decorativeBubbles?: Phaser.GameObjects.Group;

  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Set world gravity - increased for faster falling
    this.physics.world.gravity.y = 600;

    // Create cartoon sky background
    this.createCartoonBackground(width, height);

    // Create floating clouds
    this.createFloatingClouds(width, height);

    // Decorative bubbles removed for cleaner look

    // Create platforms
    this.createPlatforms();

    // Create player
    this.createPlayer();

    // Create stars
    this.createStars();

    // Create bombs group
    this.createBombs();

    // Create cartoon UI
    this.createCartoonUI(width);

    // Setup physics collisions
    this.setupCollisions();

    // Setup input
    this.setupInput();

    console.log('Cartoon GameScene created successfully');
  }

  /**
   * Create enchanting night sky background
   */
  private createCartoonBackground(width: number, height: number) {
    // Use night sky themed gradient background
    createGradientBackground(this, width, height, 'sky');
    
    // Add enhanced star field effect for gameplay
    this.createStarField(width, height);
    
    // Add a subtle moon in the corner
    this.createGameMoon(width, height);
  }

  /**
   * Create twinkling star field
   */
  private createStarField(width: number, height: number) {
    for (let i = 0; i < 25; i++) {
      const star = this.add.graphics();
      star.fillStyle(UITheme.colors.starSilver, 0.6);
      star.fillCircle(0, 0, 1 + Math.random() * 2);
      star.x = Math.random() * width;
      star.y = Math.random() * height * 0.6; // Keep stars in upper part
      
      // Twinkling animation
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: 1500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000
      });
    }
  }

  /**
   * Create a subtle moon for the game scene
   */
  private createGameMoon(width: number, height: number) {
    // Small moon in top corner, less prominent than main menu
    const moonX = width * 0.9;
    const moonY = height * 0.1;
    
    // Moon glow
    const moonGlow = this.add.graphics();
    moonGlow.fillStyle(0xFFFF99, 0.15);
    moonGlow.fillCircle(moonX, moonY, 25);
    
    // Moon surface (smaller than main menu)
    const moon = this.add.graphics();
    moon.fillStyle(0xFFF8DC, 0.7);
    moon.fillCircle(moonX, moonY, 20);
    
    // Small crater detail
    const crater = this.add.graphics();
    crater.fillStyle(0xE6E6FA, 0.2);
    crater.fillCircle(moonX - 5, moonY, 4);
    
    // Very subtle pulsing
    this.tweens.add({
      targets: moonGlow,
      alpha: 0.1,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create floating clouds
   */
  private createFloatingClouds(_width: number, _height: number) {
    this.clouds = this.add.group();

    const cloudPositions = [
      { x: 100, y: 80 },
      { x: 600, y: 60 },
      { x: 350, y: 120 },
      { x: 150, y: 150 }
    ];

    cloudPositions.forEach((pos, index) => {
      const cloud = this.createCloud(pos.x, pos.y, 0.4 + Math.random() * 0.3);
      this.clouds?.add(cloud);

      // Add floating animation
      this.tweens.add({
        targets: cloud,
        x: pos.x + (Math.random() - 0.5) * 80,
        y: pos.y + (Math.random() - 0.5) * 20,
        duration: 6000 + Math.random() * 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: index * 800
      });
    });
  }

  /**
   * Create a cloud shape
   */
  private createCloud(x: number, y: number, scale: number): Phaser.GameObjects.Graphics {
    const cloud = this.add.graphics();
    cloud.fillStyle(0xFFFFFF, 0.7);

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
    cloud.setAlpha(0.6);

    return cloud;
  }

  /**
   * Create decorative bubbles
   */
  private createDecorativeBubbles(width: number, height: number) {
    this.decorativeBubbles = this.add.group();

    const bubbleColors = [
      0xFF6B9D, 0x4ECDC4, 0xFFE66D, 0xFF6B6B, 
      0x4DABF7, 0x69DB7C, 0xDA77F2, 0xFFB366
    ];

    // Create small floating bubbles
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width;
      const y = height * 0.3 + Math.random() * height * 0.4;
      const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      const size = 8 + Math.random() * 15;

      const bubble = this.createSmallBubble(x, y, size, color);
      this.decorativeBubbles?.add(bubble);

      // Floating animation
      this.tweens.add({
        targets: bubble,
        y: y - 30 - Math.random() * 50,
        alpha: 0.3,
        duration: 4000 + Math.random() * 2000,
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut',
        delay: Math.random() * 2000
      });
    }
  }

  /**
   * Create a small decorative bubble
   */
  private createSmallBubble(x: number, y: number, radius: number, color: number): Phaser.GameObjects.Container {
    const bubbleContainer = this.add.container(x, y);

    const bubble = this.add.graphics();
    bubble.fillStyle(color, 0.6);
    bubble.fillCircle(0, 0, radius);

    bubble.lineStyle(2, 0xFFFFFF, 0.3);
    bubble.strokeCircle(0, 0, radius);

    const shine = this.add.graphics();
    shine.fillStyle(0xFFFFFF, 0.4);
    shine.fillCircle(-radius * 0.3, -radius * 0.3, radius * 0.2);

    bubbleContainer.add([bubble, shine]);
    return bubbleContainer;
  }

  /**
   * Create only ground platform for simple gameplay
   */
  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    // Only create magical ground - no floating platforms
    this.createMagicalGround();
  }

  /**
   * Create magical ground with mystical forest theme
   */
  private createMagicalGround() {
    // Base ground with mystical dark green
    const ground = this.add.graphics();
    ground.fillStyle(0x2D5016, 1); // Dark forest green
    ground.fillRoundedRect(0, 568, 800, 32, 16);
    
    // Magical glow outline
    ground.lineStyle(3, 0x40E0D0, 0.8); // Turquoise glow
    ground.strokeRoundedRect(0, 568, 800, 32, 16);

    // Add mystical grass and sparkles
    for (let i = 0; i < 25; i++) {
      const grassX = i * 32 + 16;
      
      // Grass blades
      const grass = this.add.graphics();
      grass.lineStyle(2, 0x4CAF50, 0.8);
      grass.beginPath();
      grass.moveTo(grassX, 568);
      grass.lineTo(grassX - 2, 562);
      grass.moveTo(grassX, 568);
      grass.lineTo(grassX + 2, 562);
      grass.moveTo(grassX + 8, 568);
      grass.lineTo(grassX + 8, 560);
      grass.strokePath();

      // Small sparkles on grass
      if (i % 4 === 0) {
        const sparkle = this.add.graphics();
        sparkle.fillStyle(UITheme.colors.starGold, 0.6);
        sparkle.fillCircle(grassX + 4, 565, 1);
        
        // Twinkling effect
        this.tweens.add({
          targets: sparkle,
          alpha: 0.2,
          duration: 2000 + Math.random() * 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: Math.random() * 1000
        });
      }
    }

    if (this.platforms) {
      const groundBody = this.add.rectangle(400, 584, 800, 32);
      this.physics.add.existing(groundBody, true);
      this.platforms.add(groundBody);
    }
  }

  /**
   * Create player with magical aura
   */
  private createPlayer() {
    this.player = new Player(this, 100, 450, 'dude');
    // Player constructor already adds to scene and physics
    
    // Add magical aura around player
    this.createPlayerAura();
  }

  /**
   * Create magical aura effect around player
   */
  private createPlayerAura() {
    if (!this.player) return;

    // Create soft glow around player
    const aura = this.add.graphics();
    aura.fillStyle(0x40E0D0, 0.2); // Turquoise glow
    aura.fillCircle(this.player.x, this.player.y, 35);
    
    // Animated glow effect
    this.tweens.add({
      targets: aura,
      scaleX: 1.3,
      scaleY: 1.3,
      alpha: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Create sparkle trail
    this.time.addEvent({
      delay: 200,
      callback: () => {
        if (this.player) {
          const sparkle = this.add.graphics();
          sparkle.fillStyle(UITheme.colors.starGold, 0.8);
          sparkle.fillCircle(
            this.player.x + (Math.random() - 0.5) * 30,
            this.player.y + (Math.random() - 0.5) * 30,
            1 + Math.random() * 2
          );

          this.tweens.add({
            targets: sparkle,
            alpha: 0,
            y: sparkle.y - 20,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => sparkle.destroy()
          });
        }
      },
      loop: true
    });

    // Update aura position with player
    this.events.on('update', () => {
      if (this.player && aura) {
        aura.setPosition(this.player.x, this.player.y);
      }
    });
  }

  /**
   * Create stars on ground level for simple collection gameplay
   */
  private createStars() {
    this.stars = this.physics.add.group();
    const { width } = this.cameras.main;
    const numberOfStars = 12;
    const sectionWidth = width / numberOfStars;

    for (let i = 0; i < numberOfStars; i++) {
      // Position each star in the middle of its section, with a small random offset
      const x = (i * sectionWidth) + (sectionWidth / 2) + Phaser.Math.Between(-10, 10);
      const star = this.createBubbleStar(x, 0);
      this.stars.add(star);
    }
  }

  /**
   * Create a bubble-style star
   */
  private createBubbleStar(x: number, y: number): Phaser.Physics.Arcade.Sprite {
    const star = this.physics.add.sprite(x, y, 'star');
    
    star.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
    star.setCollideWorldBounds(true);
    
    // Add twinkling animation
    this.tweens.add({
      targets: star,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.7,
      duration: 1000 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: Math.random() * 1000
    });

    return star;
  }

  /**
   * Create bombs group
   */
  private createBombs() {
    this.bombs = this.physics.add.group();
  }

  /**
   * Create enhanced cartoon-style UI with consistent theming
   */
  private createCartoonUI(_width: number) {
    // Score card container with better positioning
    this.scoreCard = this.add.container(120, 60);

    // Enhanced card shadow
    const cardShadow = this.add.graphics();
    cardShadow.fillStyle(UITheme.colors.shadow, UITheme.shadows.card.alpha);
    cardShadow.fillRoundedRect(
      -70 + UITheme.shadows.card.offsetX, 
      -30 + UITheme.shadows.card.offsetY, 
      160, 
      60, 
      UITheme.components.card.borderRadius
    );

    // Enhanced card background
    const cardBg = this.add.graphics();
    cardBg.fillStyle(UITheme.colors.cardBackground, 0.95);
    cardBg.fillRoundedRect(-70, -30, 160, 60, UITheme.components.card.borderRadius);

    // Modern card border
    cardBg.lineStyle(UITheme.components.card.borderWidth, UITheme.colors.cardBorder, 1);
    cardBg.strokeRoundedRect(-70, -30, 160, 60, UITheme.components.card.borderRadius);

    // Enhanced score icon (modern star)
    const scoreIcon = this.add.graphics();
    scoreIcon.fillStyle(UITheme.colors.starGold, 1);
    
    // Create 5-pointed star
    const points = [];
    const outerRadius = 12;
    const innerRadius = 5;
    
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    
    scoreIcon.fillPoints(points, true);
    scoreIcon.setPosition(-45, 0);

    // Add star glow
    scoreIcon.lineStyle(2, UITheme.colors.shine, 0.6);
    scoreIcon.strokePoints(points, true);

    // Enhanced score text with better typography
    this.scoreText = this.add.text(-15, 0, 'Score: 0', {
      fontSize: UITheme.fontSizes.body,
      fontFamily: `${UITheme.fonts.body}, ${UITheme.fonts.fallback}`,
      color: '#2C3E50',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);

    this.scoreCard.add([cardShadow, cardBg, scoreIcon, this.scoreText]);

    // Enhanced floating animation
    this.tweens.add({
      targets: this.scoreCard,
      y: 55,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Add subtle pulsing glow to star
    this.tweens.add({
      targets: scoreIcon,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Setup physics collisions
   */
  private setupCollisions() {
    if (!this.player || !this.platforms || !this.stars || !this.bombs) return;

    // Player collides with platforms
    this.physics.add.collider(this.player, this.platforms);

    // Stars collide with platforms
    this.physics.add.collider(this.stars, this.platforms);

    // Bombs collide with platforms - simple physics
    this.physics.add.collider(this.bombs, this.platforms, (bomb) => {
      const bombSprite = bomb as Phaser.Physics.Arcade.Sprite;
      // Give it a strong upward boost when hitting the ground
      if (bombSprite.body && bombSprite.body.touching.down) {
        // Much higher bounce
        bombSprite.setVelocityY(-700);
        
        // Only add random horizontal velocity if the bomb doesn't already have significant horizontal movement
        // This prevents interfering with bomb-on-bomb collision results
        if (Math.abs(bombSprite.body.velocity.x) < 50) {
          const randomHorizontal = Phaser.Math.Between(-150, 150);
          bombSprite.setVelocityX(randomHorizontal);
        }
      }
    });

    // Player collects stars
    this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this);

    // Player hits bombs
    this.physics.add.collider(this.player, this.bombs, this.handleHitBomb, undefined, this);

    // Bombs collide with each other - add callback to ensure clean separation
    this.physics.add.collider(this.bombs, this.bombs, (bomb1, bomb2) => {
      const bombSprite1 = bomb1 as Phaser.Physics.Arcade.Sprite;
      const bombSprite2 = bomb2 as Phaser.Physics.Arcade.Sprite;
      
      if (!bombSprite1.body || !bombSprite2.body) return;
      
      // Calculate separation direction
      const dx = bombSprite2.x - bombSprite1.x;
      const dy = bombSprite2.y - bombSprite1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        // Normalize and apply separation force
        const separationForce = 100;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        // Push bombs apart
        bombSprite1.body.velocity.x -= normalizedDx * separationForce;
        bombSprite1.body.velocity.y -= normalizedDy * separationForce;
        bombSprite2.body.velocity.x += normalizedDx * separationForce;
        bombSprite2.body.velocity.y += normalizedDy * separationForce;
      }
    });
  }

  /**
   * Handle star collection with cartoon effects
   */
  private handleCollectStar(_player: any, star: any) {
    star.disableBody(true, true);

    // Update score
    this.score += 10;
    this.scoreText?.setText('Score: ' + this.score);

    // Create collection burst effect
    this.createCollectionBurst(star.x, star.y);

    // Animate score card
    this.tweens.add({
      targets: this.scoreCard,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    // Check if all stars collected
    if (this.stars?.countActive(true) === 0) {
      this.spawnNewStars();
      this.spawnBomb();
    }
  }

  /**
   * Create magical star collection burst effect
   */
  private createCollectionBurst(x: number, y: number) {
    // Create magical sparkle burst
    const sparkleColors = [
      UITheme.colors.starGold,
      UITheme.colors.starSilver,
      0xFFFFFF, // Pure white
      0xFFF8DC, // Cornsilk
      0xF0E68C  // Khaki
    ];

    // Main burst particles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      const particle = this.add.graphics();
      const color = sparkleColors[i % sparkleColors.length];
      particle.fillStyle(color, 0.9);
      
      // Create star-shaped particle
      const size = 3 + Math.random() * 4;
      particle.fillCircle(0, 0, size);
      particle.lineStyle(1, 0xFFFFFF, 0.8);
      particle.strokeCircle(0, 0, size);
      
      particle.setPosition(x, y);

      this.tweens.add({
        targets: particle,
        x: x + endX,
        y: y + endY,
        scaleX: 0.2,
        scaleY: 0.2,
        alpha: 0,
        rotation: Math.PI * 4,
        duration: 800 + Math.random() * 400,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }

    // Central magical flash
    const flash = this.add.graphics();
    flash.fillStyle(0xFFFFFF, 0.8);
    flash.fillCircle(x, y, 20);
    
    this.tweens.add({
      targets: flash,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      ease: 'Power2.easeOut',
      onComplete: () => flash.destroy()
    });

    // Ring wave effect
    const ring = this.add.graphics();
    ring.lineStyle(3, UITheme.colors.starGold, 0.6);
    ring.strokeCircle(x, y, 15);
    
    this.tweens.add({
      targets: ring,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 500,
      ease: 'Power2.easeOut',
      onComplete: () => ring.destroy()
    });
  }

  /**
   * Spawn new stars on ground level
   */
  private spawnNewStars() {
    if (!this.stars) return;

    const { width } = this.cameras.main;
    const numberOfStars = 12;
    const sectionWidth = width / numberOfStars;

    for (let i = 0; i < numberOfStars; i++) {
      // Position each star in the middle of its section, with a small random offset
      const x = (i * sectionWidth) + (sectionWidth / 2) + Phaser.Math.Between(-10, 10);
      const star = this.createBubbleStar(x, 0);
      this.stars.add(star);
    }
  }

  /**
   * Spawn bomb
   */
  private spawnBomb() {
    if (!this.bombs || !this.player) return;

    const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    const bomb = new Bomb(this, x, 16, 'bomb');
    
    // Set moderate bounce to prevent physics glitches
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    
    this.bombs.add(bomb);
  }

  /**
   * Handle bomb collision
   */
  private handleHitBomb(_player: any, _bomb: any) {
    if (this.gameOverTriggered) return;
    
    this.gameOverTriggered = true;
    this.physics.pause();
    
    if (this.player) {
      this.player.setTint(0xff0000);
    }

    // Create explosion effect
    this.createExplosionEffect(_bomb.x, _bomb.y);

    // Transition to game over scene
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  /**
   * Create explosion effect
   */
  private createExplosionEffect(x: number, y: number) {
    const explosionColors = [0xFF6B6B, 0xFF8E53, 0xFFE66D];

    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      const particle = this.add.graphics();
      particle.fillStyle(explosionColors[i % explosionColors.length], 1);
      particle.fillCircle(0, 0, 8 + Math.random() * 8);
      particle.setPosition(x, y);

      this.tweens.add({
        targets: particle,
        x: x + endX,
        y: y + endY,
        scaleX: 0.2,
        scaleY: 0.2,
        alpha: 0,
        duration: 800,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Setup input controls
   */
  private setupInput() {
    // Keyboard controls
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'g' || event.key === 'G') {
        console.log('Debug: Triggering game over');
        this.handleHitBomb(this.player as any, {} as any);
      }
    });
  }

  update() {
    if (this.player) {
      this.player.update();
    }

    // Manually handle bomb world boundaries to ensure they bounce off screen edges
    if (this.bombs) {
      this.bombs.getChildren().forEach(c => {
        const bomb = c as Phaser.Physics.Arcade.Sprite;
        const body = bomb.body as Phaser.Physics.Arcade.Body;

        if (!body) {
          return;
        }

        const worldBounds = this.physics.world.bounds;
        const bombRadius = bomb.width / 2;

        // Check left boundary
        if (body.x - bombRadius <= 0 && body.velocity.x < 0) {
          body.x = bombRadius;
          body.velocity.x *= -1; // Reverse horizontal direction
          bomb.setTint(0xff8888);
          this.time.delayedCall(100, () => bomb.clearTint());
        }
        // Check right boundary
        else if (body.x + bombRadius >= worldBounds.width && body.velocity.x > 0) {
          body.x = worldBounds.width - bombRadius;
          body.velocity.x *= -1; // Reverse horizontal direction
          bomb.setTint(0xff8888);
          this.time.delayedCall(100, () => bomb.clearTint());
        }
      });
    }
  }
} 