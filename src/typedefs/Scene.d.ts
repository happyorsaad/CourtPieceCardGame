//@ts-ignore
import CircularProgressCanvasPlugin from "phaser3-rex-plugins/plugins/circularprogresscanvas-plugin.js";
//@ts-ignore
import FSMPlugin from "phaser3-rex-plugins/plugins/fsm-plugin.js";
import GlowFilterPipelinePlugin from "phaser3-rex-plugins/plugins/glowfilterpipeline-plugin";
import GrayScalePipelinePlugin from "phaser3-rex-plugins/plugins/grayscalepipeline-plugin";
//@ts-ignore
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js";
import SpinnerPlugin from "phaser3-rex-plugins/templates/spinner/spinner-plugin.js";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";
import { ColyseusPlugin } from "../client/network/ColyseusPlugin";

declare global {
  namespace Phaser {
    interface Scene {
      network: ColyseusPlugin;
      rSpinner: SpinnerPlugin;
      rexFSM: FSMPlugin;
      rexUI: UIPlugin;
      rexGlow: GlowFilterPipelinePlugin;
      outline: OutlinePipelinePlugin;
      greyscale: GrayScalePipelinePlugin;
    }
  }
}
