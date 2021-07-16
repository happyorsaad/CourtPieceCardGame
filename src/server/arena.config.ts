import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import { Response } from "express";
import { CourtPieceRoom } from "./rooms/CourtPieceRoom";

export default Arena({
  getId: () => "Court Piece",

  initializeGameServer: (gameServer) => {
    gameServer.define("CourtPiece", CourtPieceRoom);
    if (process.env.NODE_ENV !== "production") {
      gameServer.simulateLatency(500);
    }
  },

  initializeExpress: (app) => {
    app.get("/", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {},
});
