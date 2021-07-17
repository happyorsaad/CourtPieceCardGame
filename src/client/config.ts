import { LoadScene } from "./scenes/load-scene";
import { GameScene } from "./scenes/game-scene";
//@ts-ignore
import TextEditPlugin from "phaser3-rex-plugins/plugins/textedit-plugin.js";
//@ts-ignore
import FSMPlugin from "phaser3-rex-plugins/plugins/fsm-plugin.js";

import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
//@ts-ignore
import CircularProgressCanvasPlugin from "phaser3-rex-plugins/plugins/circularprogresscanvas-plugin.js";

import { MenuScene } from "./scenes/menu-scene";
import { JoinRoomScene } from "./scenes/join-room-scene";
import SpinnerPlugin from "phaser3-rex-plugins/templates/spinner/spinner-plugin.js";
import { ColyseusPlugin } from "./network/ColyseusPlugin";
import { NetworkConfig } from "./network/NetworkConfig";
import { WaitingForPlayersScene } from "./scenes/waiting-for-players-scene";
//@ts-ignore
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js";
import { ChatScene } from "./scenes/chat-scene";
import { QuitDialogScene } from "./scenes/quit-dialog-scene";
import GlowFilterPipelinePlugin from "phaser3-rex-plugins/plugins/glowfilterpipeline-plugin.js";
//@ts-ignore
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js";
import { Theme } from "./theme/GameTheme";
import GrayScalePipelinePlugin from "phaser3-rex-plugins/plugins/grayscalepipeline-plugin.js";
import { ServerDisconnectedScene } from "./scenes/server-disconnected";
import { SceneBase } from "./scenes/scene-base";
//@ts-ignore
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin.js";
//@ts-ignore
import AnchorPlugin from "phaser3-rex-plugins/plugins/anchor-plugin.js";
import SceneWatcherPlugin from "./utilities/debug/sceneWatcher";

const protocol = window.location.protocol.replace("http", "ws");
const endpoint =
  process.env.NODE_ENV === "production"
    ? `wss://${process.env.SERVER_ENDPOINT}`
    : `${protocol}//${window.location.hostname}:${process.env.SERVER_PORT}`;

const networkConfig: NetworkConfig = {
  url: endpoint,
  roomName: "CourtPiece",
};

const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: "Court Piece",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "1.0",
  backgroundColor: Theme.Colors.BACKGROUND,
  type: Phaser.AUTO,
  scene: [
    LoadScene,
    ChatScene,
    GameScene,
    MenuScene,
    JoinRoomScene,
    WaitingForPlayersScene,
    QuitDialogScene,
    ServerDisconnectedScene,
    SceneBase,
  ],
  parent: "game",
  dom: {
    createContainer: true,
  },
  scale: {
    parent: "game",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  plugins: {
    scene: [
      {
        key: "rexUI",
        plugin: UIPlugin,
        mapping: "rexUI",
      },
      {
        key: "rexSpinner",
        plugin: SpinnerPlugin,
        mapping: "rSpinner",
      },
      {
        key: "rexGestures",
        plugin: GesturesPlugin,
        mapping: "rexGestures",
      },
    ],
    global: [
      { key: "SceneWatcher", plugin: SceneWatcherPlugin, start: true },
      {
        key: "rexAnchor",
        plugin: AnchorPlugin,
        start: true,
        mapping: "anchor",
      },
      {
        key: "rexInputTextPlugin",
        plugin: InputTextPlugin,
        start: true,
      },
      {
        key: "rexCircularProgressCanvasPlugin",
        plugin: CircularProgressCanvasPlugin,
        start: true,
      },
      {
        key: "rexTextEdit",
        plugin: TextEditPlugin,
        start: true,
      },
      {
        key: "rexFSM",
        plugin: FSMPlugin,
        start: true,
      },
      {
        key: "network",
        plugin: ColyseusPlugin,
        start: true,
        mapping: "network",
        data: networkConfig,
      },
      {
        key: "rexGlowFilterPipeline",
        plugin: GlowFilterPipelinePlugin,
        start: true,
        mapping: "rexGlow",
      },
      {
        key: "rexOutlinePipeline",
        plugin: OutlinePipelinePlugin,
        start: true,
        mapping: "outline",
      },
      {
        key: "rexGrayScalePipeline",
        plugin: GrayScalePipelinePlugin,
        start: true,
        mapping: "greyscale",
      },
    ],
  },
};
