// Module Start
// Scene Configuration
// JS imports
import Phaser from 'phaser';

// Module Export
export default {
  type: Phaser.AUTO,
  parent: 'blood-sand',
  // Retina support
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  // Responsive
  scale: {
    parent: '.game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: '100%',
    height: '100%'
  },
  title: 'Blood & Sand',
  backgroundColor: '#ccc',
  transparent: false,
  url: 'https://www.develteam.com/Game/Blood-and-Sand',
  version: '0.1.0',
  fps: 60,
  dom: {
    createContainer: true
  }
};
