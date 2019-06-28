// Module Start
// JS imports
import Phaser from 'phaser';
import logoImg from './assets/logo.png';

// Scene configuration
const config = {
  type: Phaser.AUTO,
  parent: 'blood-sand',
  // Responsive
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create
  }
};
// Scene initialization
const game = new Phaser.Game(config);

/**
 * @description Assets preloading
 * @author Luca Cattide
 * @date 2019-06-28
 */
function preload() {
  this.load.image('logo', logoImg);
}

/**
 * @description Assets creation
 * @author Luca Cattide
 * @date 2019-06-28
 */
function create() {
  const logo = this.add.image(400, 150, 'logo');

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: 'Power2',
    yoyo: true,
    loop: -1
  });
}
