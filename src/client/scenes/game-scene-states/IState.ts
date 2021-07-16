export interface IState {
  name: number;
  onEnter: () => void;
  onExit: () => void;
  onUpdate: (dt: number) => void;
}

