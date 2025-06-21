import Phaser from 'phaser';

export default class Bomb extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set a circular physics body for more accurate collision
    const radius = this.width / 2;
    this.setCircle(radius);
  }
} 