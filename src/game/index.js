import Phaser from 'phaser';
import MainScene from './MainScene';

export const initGame = (parent) => {
  if (document.getElementById(parent).children.length === 0) {
    return new Phaser.Game({
      width: 2560,
      height: 1280,
      type: Phaser.AUTO,
      parent,
      backgroundColor: '#282820',
      pixelArt: true,
      scene: [MainScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 }, // Top down game, so no gravity
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    });
  }

  return null;
};
