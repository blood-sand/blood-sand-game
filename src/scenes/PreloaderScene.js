// Module Start
// Preload
// JS imports
import 'phaser';

/**
 * @description Preload screen
 * @author Luca Cattide
 * @date 2019-07-02
 * @export
 * @class PreloaderScene
 * @extends {Phaser.Scene}
 */
export default class PreloaderScene extends Phaser.Scene {
  /**
   * Creates an instance of PreloaderScene.
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof PreloaderScene
   */
  constructor () {
    super('Preloader');
  }

  /**
   * @description Assets preloading
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof BootScene
   */
  preload () {}

  /**
   * @description Assets creation
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof BootScene
   */
  create () {}
};
