import { Engine } from "../engine";
import { GameState } from "../types";

const gameState: GameState = {
  size: { rows: 5, cols: 4 },
  pieces: {
    w: ["a2"],
    b: ["c3"],
    x: ["b1"],
  },
  shooting_sq: null,
  turn: "w",
};

const e = new Engine(gameState);

console.log(e.board);

console.log(e.save_state());
