// Module Start
// Game
// JS imports
import 'phaser';

/**
 * @description Scene
 * @author Luca Cattide
 * @date 2019-07-02
 * @export
 * @class GameScene
 * @extends {Phaser.Scene}
 */
export default class GameScene extends Phaser.Scene {
  /**
   * Creates an instance of GameScene.
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof GameScene
   */
  constructor() {
    super('Game');
  }

  /**
   * @description Assets preloading
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof GameScene
   */
  preload() {
    // Images
    this.load.image('avatar', 'src/assets/img/gladiator.png');
    // Forms
    this.load
      .html('characterGenerator', 'src/assets/html/character-generator.html');
  }

  /**
   * @description Assets creation
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof GameScene
   */
  create() {
    // Sizes
    const baseWidth = this.game.canvas.width / this.game.canvas.width;
    const baseHeight = this.game.canvas.height / this.game.canvas.height;
    const scaleRatio = window.devicePixelRatio / 3;
    // Images
    const avatar = this.add.image(baseWidth + 200, baseHeight + 300, 'avatar');
    let characterGenerator = null;
    let characterName = null;

    avatar.setScale(scaleRatio + 0.5, scaleRatio + 0.5);

    // Texts
    this.add.text(baseWidth + 250, baseHeight + 10, 'Gladiator Generator', {
      fontSize: '32px',
      fill: '#000'
    });

    characterName = this.add.text(this.game.canvas.width / 2, baseHeight + 100, 'Name: ', {
      fontSize: '24px',
      fill: '#000'
    });
    // Forms
    characterGenerator = this.add.dom(this.game.canvas.width / 2,
      this.game.canvas.height / 2).createFromCache('characterGenerator');
  }

  /**
   * @description Scene updating
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof GameScene
   */
  update() {}
};
