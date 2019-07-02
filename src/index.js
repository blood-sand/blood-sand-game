// Module Start
// JS imports
import Phaser from 'phaser';

// Scene configuration
const config = {
  type: Phaser.AUTO,
  parent: 'blood-sand',
  // Responsive
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
// Game State
const gameState = {};
// Scene initialization
const game = new Phaser.Game(config);

/**
 * @description Assets preloading
 * @author Luca Cattide
 * @date 2019-06-28
 */
function preload() {}

/**
 * @description Assets creation
 * @author Luca Cattide
 * @date 2019-06-28
 */
function create() {}

/**
 * @description Scene updating
 * @author Luca Cattide
 * @date 2019-07-02
 */
function update() {}
