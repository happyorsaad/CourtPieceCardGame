import { IState } from "./IState";

export default class StateMachine {
  private states = new Map<number, IState>();
  private currentState?: IState;
  private isChangingState: boolean;
  private changeStateQueue: number[];

  constructor() {
    this.isChangingState = false;
    this.changeStateQueue = [];
  }

  addState(name: number, state: IState) {
    this.states.set(name, state);
    return this;
  }

  setState(name: number) {
    if (!this.states.has(name)) {
      console.warn(`Tried to change to unknown state: ${name}`);
      return;
    }

    if (this.isCurrentState(name)) {
      return;
    }

    if (this.isChangingState) {
      this.changeStateQueue.push(name);
      return;
    }

    this.isChangingState = true;

    if (this.currentState && this.currentState.onExit) {
      this.currentState.onExit();
    }

    this.currentState = this.states.get(name)!;

    if (this.currentState.onEnter) {
      this.currentState.onEnter();
    }

    this.isChangingState = false;
  }

  update(dt: number) {
    if (this.changeStateQueue.length > 0) {
      this.setState(this.changeStateQueue.shift()!);
      return;
    }

    if (this.currentState && this.currentState.onUpdate) {
      this.currentState.onUpdate(dt);
    }
  }

  private isCurrentState(name: number) {
    if (!this.currentState) {
      return false;
    }

    return this.currentState.name === name;
  }
}
