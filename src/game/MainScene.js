import Phaser from 'phaser';
import { onEnterZoneEvent } from './events';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super();

    this.onEnterZoneEvent = onEnterZoneEvent;

    this.speed = 150;

    this.player = null;
    this.cursors = null;

    this.zones = [];

    this.floorLayer = null;
    this.wallsLayer = null;
    this.treesLayer = null;
  }

  preload() {
    this.load.path = '/assets/';

    // map
    this.load.image('tiles', 'tiles.png');
    this.load.tilemapTiledJSON('map', 'tiles.json');

    // main character
    this.load.atlas('main_character', 'main_character.png', 'main_character_atlas.json');
  }

  create() {
    this.game.scale.setGameSize(800, 600);
    // map
    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('tiles', 'tiles');

    this.floorLayer = this.map.createLayer('floor', tiles, 0, 0);
    this.wallsLayer = this.map.createLayer('walls', tiles, 0, 0);
    this.treesLayer = this.map.createLayer('trees', tiles, 0, 0);

    this.wallsLayer.setCollisionByProperty({ collides: true });
    this.treesLayer.setCollisionByProperty({ collides: true });

    const spawnPoint = this.getSpawnPoint();

    this.player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, 'main_character')
      .setScale(2)
      .setSize(10, 20)
      .setOffset(10, 12)
      .setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, this.wallsLayer);
    this.physics.add.collider(this.player, this.treesLayer);

    const zonesLayer = this.map.getObjectLayer('Zones');
    zonesLayer.objects.forEach((zone) => {
      const activeFrom = zone.properties.find((prop) => prop.name === 'activeFrom');
      const zoneName = zone.properties.find((prop) => prop.name === 'zoneName');
      const width =
        activeFrom.value === 'right' || activeFrom.value === 'left' ? zone.width || 1 : zone.width;
      const height =
        activeFrom.value === 'up' || activeFrom.value === 'down' ? zone.height || 1 : zone.height;
      const y =
        activeFrom.value === 'right' || activeFrom.value === 'left' ? zone.y + height / 2 : zone.y;
      const x =
        activeFrom.value === 'up' || activeFrom.value === 'down' ? zone.x + width / 2 : zone.x;
      const zoneObj = this.add
        .zone(x, y)
        .setSize(width, height)
        .setData('activeFrom', activeFrom.value)
        .setData('zoneName', zoneName.value)
        .setName(zone.name);
      this.physics.world.enable(zoneObj);
      zoneObj.body.setAllowGravity(false);
      zoneObj.body.moves = false;
      this.physics.add.overlap(this.player, zoneObj);

      this.zones.push(zoneObj);
    });

    // player animtaions
    this.anims.create({
      key: 'left-walk',
      frames: this.anims.generateFrameNames('main_character', {
        prefix: 'left-walk.',
        start: 0,
        end: 2,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'right-walk',
      frames: this.anims.generateFrameNames('main_character', {
        prefix: 'right-walk.',
        start: 0,
        end: 2,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'front-walk',
      frames: this.anims.generateFrameNames('main_character', {
        prefix: 'front-walk.',
        start: 0,
        end: 2,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'back-walk',
      frames: this.anims.generateFrameNames('main_character', {
        prefix: 'back-walk.',
        start: 0,
        end: 2,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.cameras.main
      .startFollow(this.player)
      .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.onEnterZoneEvent.callback = () => {
      this.scene.resume();
    };

    setInterval(() => this.storeSpawnPoint(), 1000);
  }

  getSpawnPoint() {
    const storedSpawnPoint = localStorage.getItem('spawnPoint');
    const spawnPoint =
      JSON.parse(storedSpawnPoint) ??
      this.map.findObject('Objects', (obj) => obj.name === 'Spawn Point');
    return {
      x: spawnPoint.x,
      y: spawnPoint.y,
    };
  }

  storeSpawnPoint() {
    localStorage.setItem('spawnPoint', JSON.stringify({ x: this.player.x, y: this.player.y }));
  }

  update() {
    const prevVelocity = this.player.body.velocity.clone();

    this.zones.forEach((zone) => {
      if (
        zone.data.get('activeFrom') === 'right' &&
        prevVelocity.x < 0 &&
        !zone.body.touching.none
      ) {
        this.player.body.x -= 40;
        this.onEnterZoneEvent.zoneName = zone.data.get('zoneName');
        this.scene.pause();
        dispatchEvent(this.onEnterZoneEvent);
      } else if (
        zone.data.get('activeFrom') === 'left' &&
        prevVelocity.x > 0 &&
        !zone.body.touching.none
      ) {
        this.player.body.x += 40;
        this.onEnterZoneEvent.zoneName = zone.data.get('zoneName');
        this.scene.pause();
        dispatchEvent(this.onEnterZoneEvent);
      } else if (
        zone.data.get('activeFrom') === 'up' &&
        prevVelocity.y > 0 &&
        !zone.body.touching.none
      ) {
        this.player.body.y += 80;
        this.onEnterZoneEvent.zoneName = zone.data.get('zoneName');
        this.scene.pause();
        dispatchEvent(this.onEnterZoneEvent);
      } else if (
        zone.data.get('activeFrom') === 'down' &&
        prevVelocity.y < 0 &&
        !zone.body.touching.none
      ) {
        this.player.body.y -= 80;
        this.onEnterZoneEvent.zoneName = zone.data.get('zoneName');
        this.scene.pause();
        dispatchEvent(this.onEnterZoneEvent);
      }
    });

    this.player.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-this.speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(this.speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(this.speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player.body.velocity.normalize().scale(this.speed);

    if (this.cursors.left.isDown) {
      this.player.anims.play('left-walk', true);
    } else if (this.cursors.right.isDown) {
      this.player.anims.play('right-walk', true);
    } else if (this.cursors.up.isDown) {
      this.player.anims.play('back-walk', true);
    } else if (this.cursors.down.isDown) {
      this.player.anims.play('front-walk', true);
    } else {
      this.player.anims.stop();

      // // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) this.player.setTexture('main_character', 'left');
      else if (prevVelocity.x > 0) this.player.setTexture('main_character', 'right');
      else if (prevVelocity.y < 0) this.player.setTexture('main_character', 'back');
      else if (prevVelocity.y > 0) this.player.setTexture('main_character', 'front');
    }
  }
}
