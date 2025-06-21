/**
 * UI Theme Configuration for Star Catcher Game
 * Provides consistent visual style across all scenes
 */

export const UITheme = {
  // Primary Color Palette - Dreamy Sky Theme
  colors: {
    // Night sky colors
    skyLight: 0x191970,      // Midnight blue
    skyDeep: 0x000428,       // Deep night blue
    skyDark: 0x000000,       // Pure black
    
    // Accent colors
    starGold: 0xFFD700,      // Gold
    starSilver: 0xC0C0C0,    // Silver
    
    // Interactive elements
    buttonPrimary: 0x4ECDC4,  // Teal
    buttonSecondary: 0x45B7D1, // Light blue
    buttonDanger: 0xE74C3C,   // Red
    buttonSuccess: 0x2ECC71,  // Green
    
    // UI Elements
    cardBackground: 0xFFFFFF, // White
    cardBorder: 0x4ECDC4,     // Teal
    textPrimary: 0x2C3E50,    // Dark gray
    textSecondary: 0x7F8C8D,  // Medium gray
    textLight: 0xFFFFFF,      // White
    
    // Bubble colors
    bubblePink: 0xFF6B9D,
    bubbleTeal: 0x4ECDC4,
    bubbleYellow: 0xFFE66D,
    bubbleRed: 0xFF6B6B,
    bubbleBlue: 0x4DABF7,
    bubbleGreen: 0x69DB7C,
    bubblePurple: 0xDA77F2,
    bubbleOrange: 0xFFB366,
    
    // Platform and ground
    platformGreen: 0x69DB7C,
    platformBorder: 0x4ECDC4,
    
    // Effects
    shadow: 0x000000,
    shine: 0xFFFFFF,
    overlay: 0x000000
  },

  // Typography
  fonts: {
    title: 'Fredoka One',
    body: 'Nunito',
    fallback: 'Arial, sans-serif'
  },

  // Font sizes
  fontSizes: {
    title: '48px',
    subtitle: '32px',
    heading: '24px',
    body: '16px',
    small: '14px',
    caption: '12px'
  },

  // Spacing and layout
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },

  // Border radius
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
    circle: 50
  },

  // Shadows and effects
  shadows: {
    card: { offsetX: 0, offsetY: 8, blur: 24, color: 0x000000, alpha: 0.15 },
    button: { offsetX: 0, offsetY: 4, blur: 12, color: 0x000000, alpha: 0.2 },
    text: { offsetX: 2, offsetY: 2, blur: 4, color: 0x000000, alpha: 0.3 }
  },

  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
    fadeIn: 800,
    bounce: 1200
  },

  // Gradients
  gradients: {
    sky: [
      { color: 0x191970, position: 0 },  // Midnight blue
      { color: 0x000428, position: 1 }   // Deep night blue
    ],
    starryNight: [
      { color: 0x2C1810, position: 0 },  // Dark brown night
      { color: 0x191970, position: 1 }   // Midnight blue
    ],
    sunset: [
      { color: 0xFF6B9D, position: 0 },
      { color: 0xFFE66D, position: 1 }
    ],
    ocean: [
      { color: 0x4ECDC4, position: 0 },
      { color: 0x45B7D1, position: 1 }
    ]
  },

  // UI Component styles
  components: {
    card: {
      backgroundColor: 0xFFFFFF,
      borderColor: 0x4ECDC4,
      borderWidth: 4,
      borderRadius: 20,
      shadowOffset: { x: 0, y: 8 },
      shadowBlur: 24,
      shadowColor: 0x000000,
      shadowAlpha: 0.15
    },
    
    button: {
      borderRadius: 25,
      padding: { x: 24, y: 12 },
      fontSize: '18px',
      fontWeight: 'bold',
      shadowOffset: { x: 0, y: 4 },
      shadowBlur: 12,
      shadowColor: 0x000000,
      shadowAlpha: 0.2
    },
    
    bubble: {
      borderWidth: 2,
      borderColor: 0xFFFFFF,
      borderAlpha: 0.3,
      shineSize: 0.25,
      shineColor: 0xFFFFFF,
      shineAlpha: 0.6
    }
  },

  // Particle effects
  particles: {
    starCollect: {
      colors: [0xFFD700, 0xFFA500, 0xFFFFFF],
      count: 8,
      speed: { min: 50, max: 150 },
      scale: { min: 0.3, max: 0.8 },
      lifespan: 800
    },
    
    explosion: {
      colors: [0xFF6B6B, 0xFF8E53, 0xFFD93D],
      count: 12,
      speed: { min: 100, max: 200 },
      scale: { min: 0.4, max: 1.0 },
      lifespan: 1000
    }
  }
};

/**
 * Helper function to create gradient background
 */
export function createGradientBackground(
  scene: Phaser.Scene, 
  width: number, 
  height: number, 
  gradientType: 'sky' | 'sunset' | 'ocean' = 'sky'
): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  const gradient = UITheme.gradients[gradientType];
  const steps = 40;
  
  for (let i = 0; i < steps; i++) {
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(gradient[0].color),
      Phaser.Display.Color.ValueToColor(gradient[1].color),
      steps,
      i
    );
    
    graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
    graphics.fillRect(0, (height / steps) * i, width, height / steps + 1);
  }
  
  return graphics;
}

/**
 * Helper function to create consistent bubble
 */
export function createThemedBubble(
  scene: Phaser.Scene,
  x: number,
  y: number,
  radius: number,
  colorIndex: number = 0
): Phaser.GameObjects.Container {
  const bubbleContainer = scene.add.container(x, y);
  
  const bubbleColors = [
    UITheme.colors.bubblePink,
    UITheme.colors.bubbleTeal,
    UITheme.colors.bubbleYellow,
    UITheme.colors.bubbleRed,
    UITheme.colors.bubbleBlue,
    UITheme.colors.bubbleGreen,
    UITheme.colors.bubblePurple,
    UITheme.colors.bubbleOrange
  ];
  
  const color = bubbleColors[colorIndex % bubbleColors.length];
  const bubble = scene.add.graphics();
  
  // Main bubble
  bubble.fillStyle(color, 0.8);
  bubble.fillCircle(0, 0, radius);
  
  // Border
  bubble.lineStyle(UITheme.components.bubble.borderWidth, UITheme.components.bubble.borderColor, UITheme.components.bubble.borderAlpha);
  bubble.strokeCircle(0, 0, radius);
  
  // Shine effect
  const shine = scene.add.graphics();
  shine.fillStyle(UITheme.components.bubble.shineColor, UITheme.components.bubble.shineAlpha);
  shine.fillCircle(
    -radius * UITheme.components.bubble.shineSize,
    -radius * UITheme.components.bubble.shineSize,
    radius * UITheme.components.bubble.shineSize
  );
  
  bubbleContainer.add([bubble, shine]);
  return bubbleContainer;
}

/**
 * Helper function to create consistent button
 */
export function createThemedButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  color: number,
  onClick: () => void
): Phaser.GameObjects.Container {
  const buttonContainer = scene.add.container(x, y);
  
  // Button shadow
  const shadow = scene.add.graphics();
  shadow.fillStyle(UITheme.colors.shadow, UITheme.shadows.button.alpha);
  shadow.fillRoundedRect(
    -80 + UITheme.shadows.button.offsetX,
    -25 + UITheme.shadows.button.offsetY,
    160,
    50,
    UITheme.components.button.borderRadius
  );
  
  // Button background
  const buttonBg = scene.add.graphics();
  buttonBg.fillStyle(color, 1);
  buttonBg.fillRoundedRect(-80, -25, 160, 50, UITheme.components.button.borderRadius);
  
  // Button text
  const buttonText = scene.add.text(0, 0, text, {
    fontSize: UITheme.components.button.fontSize,
    fontFamily: `${UITheme.fonts.body}, ${UITheme.fonts.fallback}`,
    color: '#FFFFFF',
    fontStyle: 'bold'
  }).setOrigin(0.5);
  
  buttonContainer.add([shadow, buttonBg, buttonText]);
  
  // Make interactive
  buttonContainer.setSize(160, 50);
  buttonContainer.setInteractive();
  buttonContainer.on('pointerdown', onClick);
  
  return buttonContainer;
} 