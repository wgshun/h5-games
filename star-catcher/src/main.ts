import Phaser from 'phaser';
import './style.css';
import BootScene from './scenes/BootScene';
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: false
    }
  },
  scene: [
    BootScene,
    MainMenuScene,
    GameScene,
    GameOverScene
  ]
};

const game = new Phaser.Game(config);

// Ensure the canvas is focusable and focused
game.canvas.setAttribute('tabindex', '0');
game.canvas.focus();

export default game;
