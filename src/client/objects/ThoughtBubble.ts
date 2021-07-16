import { GameObjects, Scene } from "phaser";

export class ThoughtBubble extends GameObjects.Graphics
{
  x: number;
  y: number;
  width: number;
  height: number;

  private ARROW_WIDTH_FACTOR = 4;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene);

    this.setPosition(x, y);
    this.width = width;
    this.height = height;
    this.createBubble();
  }

  createBubble() {
    let arrowHeight = this.height / 4;

    //  Bubble shadow
    this.fillStyle(0x222222, 0.5);
    this.fillRoundedRect(6, 6, this.width, this.height, 16);

    //  Bubble color
    this.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    this.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    this.strokeRoundedRect(0, 0, this.width, this.height, 16);
    this.fillRoundedRect(0, 0, this.width, this.height, 16);

    //  Calculate arrow coordinates
    var point1X = Math.floor(this.width / this.ARROW_WIDTH_FACTOR);
    var point1Y = this.height;
    var point2X = Math.floor((this.width / this.ARROW_WIDTH_FACTOR) * 2);
    var point2Y = this.height;
    var point3X = Math.floor(this.width / this.ARROW_WIDTH_FACTOR);
    var point3Y = Math.floor(this.height + arrowHeight);

    //  Bubble arrow shadow
    this.lineStyle(4, 0x222222, 0.5);
    this.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    this.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    this.lineStyle(2, 0x565656, 1);
    this.lineBetween(point2X, point2Y, point3X, point3Y);
    this.lineBetween(point1X, point1Y, point3X, point3Y);
  }
}
