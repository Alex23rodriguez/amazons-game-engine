import { DEFAULT_POSITIONS } from "./consts";
import { Engine } from "./engine";
import { FEN, Move, Validation } from "./types";
import { is_valid_fen, is_move, is_default_size } from "./validation";

export const Amazons = (fen_or_size?: number | FEN) => {
  let fen: FEN;
  let engine: Engine;

  switch (typeof fen_or_size) {
    case "undefined":
      fen = DEFAULT_POSITIONS[10];
      break;

    case "number":
      fen = assert(is_default_size(fen_or_size)).fen;
      break;

    case "string":
      fen = fen_or_size.toLowerCase() as FEN;
      engine = assert(is_valid_fen(fen)).engine;
      break;

    default:
      throw new Error(
        "parameter must be either a board size or a string representing a FEN."
      );
  }

  engine = new Engine(fen);
  let { rows, cols } = engine;

  return {
    move: (m: Move) => {
      assert(is_move(m, rows, cols));
      return engine.move(m);
    },
    moves: () => engine.moves(),
    ascii: () => engine.ascii(),
  };
};

function assert(condition: Validation) {
  if (condition.error) throw new Error(condition.error);
  return condition.byprod;
}
