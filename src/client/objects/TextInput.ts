import { GameObjects, Scene } from "phaser";
// @ts-ignore
import TextEdit from "phaser3-rex-plugins/plugins/textedit";
import { StringValidator } from "../utilities/TextValidators";

export type OnTextInput = (text: string) => void;
export type OnValidationError = (error: string) => void;

export class TextInput extends Phaser.GameObjects.Text {
  private editor: TextEdit;
  private onTextInput: OnTextInput;
  private inputText: string;
  private validators: StringValidator[];
  private onValidationError: OnValidationError = (error: string) => {};
  private defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    align: "center",
    backgroundColor: "#fff",
    color: "#000",
    fontSize : "25px",
    padding: {
      x: 2,
      y: 2,
    },
  };

  constructor(
    scene: Scene,
    x: number,
    y: number,
    w: number,
    h: number,
    initText: string,
    onTextInput: OnTextInput,
    validators: StringValidator[],
    onValidationError: OnValidationError,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, initText, style);
    this.setStyle(style || this.defaultStyle);

    this.editor = new TextEdit(this);

    this.width = w;
    this.height = h;

    this.onTextInput = onTextInput;
    this.inputText = initText;

    this.validators = validators;

    this.onValidationError = onValidationError || function () {};
    this.setFixedSize(this.width, this.height);

    this.setInteractive().on("pointerdown", () => {
      this.openTextEditor();
    });
  }

  onInput(textObj: GameObjects.Text) {
    let value = textObj.text;
    if (this.validateInput(value)) {
      this.inputText = value;
      this.onTextInput(this.inputText);
    }
  }

  openTextEditor() {
    this.editor.open({ text: this.inputText }, this.onInput.bind(this));
  }

  closeIfOpened() {
    if (this.editor.isOpened) {
      this.editor.close();
    }
  }

  validateInput(text: string): boolean {
    for (const validator of this.validators) {
      let res = validator(text);
      if (!res.valid) {
        this.text = this.inputText;
        this.openTextEditor();
        this.onValidationError(res.error);
        return false;
      }
    }
    return true;
  }

  clear() {
    this.text = "";
    this.inputText = "";
  }

  focus() {
    this.openTextEditor();
  }
}
