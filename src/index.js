// Module Start
// Main
// SASS Imports
import './sass/index.scss';
// JS imports
import 'phaser';
import config from './config/config';
import GameScene from './scenes/GameScene';
import BootScene from './scenes/BootScene';
import PreloaderScene from './scenes/PreloaderScene';
import TitleScene from './scenes/TitleScene';
import OptionsScene from './scenes/OptionsScene';
import CreditsScene from './scenes/CreditsScene';

/**
 * @description Main Game
 * @author Luca Cattide
 * @date 2019-07-02
 * @class Game
 * @extends {Phaser.Game}
 */
class Game extends Phaser.Game {
  /**
   * Creates an instance of Game.
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof Game
   */
  constructor() {
    super(config);

    // Scenes initialization
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    // Game initialization
    this.scene.start('Game');
  }
}

window.game = new Game();
