import { DEFAULT_POSITIONS } from "./consts";
import { Engine } from "./engine";
import { FEN, Move } from "./types";
import { is_valid_fen, is_move } from "./validation";

export const Amazons = (fen_or_size?: number | FEN) => {
  let fen;
  if (typeof fen_or_size === "undefined") {
    fen = DEFAULT_POSITIONS[10];
  } else if (typeof fen_or_size === "number") {
    fen = DEFAULT_POSITIONS[fen_or_size];
    if (!fen) throw new Error("fen must be a number or string");
  } else if (typeof fen_or_size === "string") {
    fen = fen_or_size;
    let ans = is_valid_fen(fen);
    if (ans.error) {
      throw new Error(ans.error);
    }
  } else throw new Error("fen must be a number or string");

  let engine = new Engine(fen);
  let { rows, cols } = engine;

  return {
    move: (m: Move) => {
      let ans = is_move(m, rows, cols);
      if (ans.error) {
        throw new Error(ans.error);
      }
      return engine.move(m);
    },
    moves: () => engine.moves(),
    ascii: () => engine.ascii(),
  };
};
