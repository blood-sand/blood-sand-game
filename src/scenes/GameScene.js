// Module Start
// Game
// JS imports
import 'phaser';
import setForm from '../assets/js/character-generator';

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
    // Fonts
    const fontsConfig = {
      custom: {
        families: ['weiss_initialenalternates'],
        urls: ['/src/css/fonts.css']
      }
    };

    this.load.rexWebFont(fontsConfig);
    // Images
    this.load.image('background', __dirname +
      'src/assets/img/character-generator-background.jpg');
    this.load.image('laurel', __dirname + 'src/assets/img/laurel.png');
    this.load.image('avatar', __dirname + 'src/assets/img/gladiator.png');
    // Audio
    this.load.audio('combat', [
      __dirname + 'src/assets/audio/combat.ogg',
      __dirname + 'src/assets/audio/combat.mp3'
    ]);
    // Forms
    this.load
      .html('characterGenerator', __dirname +
        'src/assets/html/character-generator.html');
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
    const backgrounds = this.add.group();
    const gladiators = this.add.group();
    const template = this.add.group();
    const laurel = this.add.image(baseWidth + 196, baseHeight + 148, 'laurel');
    const avatar = this.add.image(baseWidth + 232, baseHeight + 600, 'avatar');
    let background = this.add.image(0, 0, 'background');
    // Graphics
    const graphics = this.add.graphics();
    // Audio
    const music = this.sound.add('combat', {
      loop: true,
    });
    // Texts
    const texts = this.add.group();
    const title = this.add.text((this.game.canvas.width / 2) - 172, baseHeight + 16,
      'Gladiator Generator', {
        fontFamily: 'weiss_initialenalternates',
        fontSize: '32px',
        fill: '#fff'
      });
    // Forms
    const forms = this.add.group();
    let characterGenerator = null;

    characterGenerator = this.add.dom(this.game.canvas.width / 2,
      this.game.canvas.height / 2).createFromCache('characterGenerator');

    setForm();

    // Fullscreen background
    background.displayHeight = this.game.canvas.height;
    background.scaleX = background.scaleY;
    background.y = this.game.canvas.height / 2;
    background.x = this.game.canvas.width / 2;
    background.x = background.displayWidth * .5;

    // Overlay
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    // Laurel settings
    laurel.setScale(scaleRatio - 0.2, scaleRatio - 0.2);
    laurel.setDepth(2);
    // Avatar settings
    avatar.setScale(scaleRatio + 0.5, scaleRatio + 0.5);
    avatar.setDepth(2);
    // Music settings
    music.play();
    // Grouping
    backgrounds.add(background);
    gladiators.add(avatar);
    template.add(laurel);
    texts.add(title);
    forms.add(characterGenerator);
  }

  /**
   * @description Scene updating
   * @author Luca Cattide
   * @date 2019-07-02
   * @memberof GameScene
   */
  update() {}
};
