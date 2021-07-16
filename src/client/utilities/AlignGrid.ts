import { Game, GameObjects, Scene } from "phaser";

interface AlignGridConfig {
  scene: Scene;
  rows: number;
  cols: number;
  width: number;
  height: number;
}
//@ts-nocheck
export class AlignGrid {
  //@ts-ignore
  private config: AlignGridConfig = {};
  private scene;
  private cw: number;
  private ch: number;
  private graphics: GameObjects.Graphics;
  private anchor: any;

  constructor(config: AlignGridConfig) {
    this.config = config;
    this.scene = config.scene;
    this.cw = config.width / config.cols;
    this.ch = config.height / config.rows;
    this.anchor = this.scene.plugins.get("rexAnchor");
  }

  show() {
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(2, 0xff0000);

    for (var i = 0; i < this.config.width; i += this.cw) {
      this.graphics.moveTo(i, 0);
      this.graphics.lineTo(i, this.config.height);
    }

    for (var i = 0; i < this.config.height; i += this.ch) {
      this.graphics.moveTo(0, i);
      this.graphics.lineTo(this.config.width, i);
    }

    this.graphics.strokePath();
  }

  placeAtXY(xx: number, yy: number, obj: GameObjects.Components.Transform) {
    //calc position based upon the cellwidth and cellheight
    let x2 = this.cw * xx + this.cw / 2;
    let y2 = this.ch * yy + this.ch / 2;

    obj.x = x2;
    obj.y = y2;
  }

  placeItemAt(xx: number, yy: number, width: number, height: number, obj: any) {
    obj.width = width * this.cw;
    obj.height = height * this.ch;

    // obj.setDisplaySize(width * this.cw, height * this.ch);

    //calc position based upon the cellwidth and cellheight
    let x2 = this.cw * xx + this.cw / 2 - obj.width / 2;
    let y2 = this.ch * yy + this.ch / 2 - obj.height / 2;

    obj.x = x2;
    obj.y = y2;
  }

  placeAtIndex(index: number, obj: GameObjects.Components.Transform) {
    let yy = Math.floor(index / this.config.cols);
    let xx = index - yy * this.config.cols;

    this.placeAtXY(xx, yy, obj);
  }

  getBoundsFor(xx: number, yy: number, width: number, height: number) {
    let w = width * this.cw;
    let h = height * this.ch;
    return {
      width: w,
      height: h,
      x: this.cw * xx + this.cw / 2 - w / 2,
      y: this.ch * yy + this.ch / 2 - h / 2,
    };
  }

  alignedText(
    gameObj: GameObjects.Text,
    xx: number,
    yy: number,
    w: number,
    h: number
  ) {
    const { x, y, width, height } = this.getBoundsFor(xx, yy, w, h);
    gameObj.setPosition(x, y);
    gameObj.setFixedSize(width, height);
    return gameObj;
  }
  showNumbers() {
    this.show();
    let count = 0;
    for (let i = 0; i < this.config.rows; i++) {
      for (let j = 0; j < this.config.cols; j++) {
        var numText = this.scene.add.text(0, 0, count.toString(), {
          color: "#ff0000",
        });
        numText.setOrigin(0.5, 0.5);
        this.placeAtIndex(count, numText);
        count++;
      }
    }
  }

  placeAtTopRight(gameObj: any) {
    this.anchor.add(gameObj, {
      right: "100%-10%",
      top: "0%+10%",
    });
    return gameObj;
  }

  placeAtBottomCenter(gameObj: any) {
    this.anchor.add(gameObj, {
      centerX: "center",
      bottom: "100%-10%",
    });
    return gameObj;
  }
}
