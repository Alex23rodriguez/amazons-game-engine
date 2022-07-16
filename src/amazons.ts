import { DEFAULT_POSITIONS } from "./consts";
import { Engine } from "./engine";
import { FEN, Move, Piece, SqColor, Square, Validation } from "./types";
import {
  is_valid_fen,
  is_default_size,
  is_square_in_range,
} from "./validation";

export const Amazons = (fen_or_size?: number | FEN) => {
  // INITIAL SETUP
  let engine = try_load(fen_or_size);

  // VARIABLES
  let { rows, cols } = engine;

  let moves = engine.moves();

  // RETURN OBJECT
  return {
    ascii: () => engine.ascii(),
    board: () => engine.board,
    // clear
    // delete_comment
    // delete_comments
    fen: () => engine.fen(),
    game_over: () => moves.length === 0,
    get: (sq: Square) => {
      assert(is_square_in_range(sq, rows, cols));
      return engine.get(sq);
    },
    // get_comment
    // header
    history: () => engine.history,
    in_endgame: null, //TODO
    load: (fen_or_size) => {
      try {
        let eng = try_load(fen_or_size);
        engine = eng;
        ({ rows, cols } = eng);
        moves = eng.moves();
        return true;
      } catch {
        return false;
      }
    },
    // load_pgn
    move: (m: Move) => {
      if (moves.some((v) => v[0] === m[0] && v[1] === m[1] && v[2] === m[2])) {
        engine.move(m);
        moves = engine.moves();
        // TODO return move object
        return true;
      }
      return false;
    },
    moves: () => engine.moves(),
    // pgn
    put: (piece: Piece, sq: Square) => {
      // TODO
    },
    remove: (sq: Square) => {
      assert(is_square_in_range(sq, rows, cols));
      let p = engine.get(sq);
      engine.put(Piece.EMPTY, sq);
      return p;
    },
    // reset
    // set_comment
    square_color: (sq: Square) => {
      assert(is_square_in_range(sq, rows, cols));
      // TODO square to coords
      // let color = engine.sq_color(sq)
      let color;
      return color === SqColor.LIGHT ? "light" : "dark";
    },
    turn: () => engine.turn,
    // undo
    validate_fen: (fen) => is_valid_fen(fen),
  };
};

function assert(condition: Validation) {
  if (condition.error) throw new Error(condition.error);
  return condition.byprod;
}

function try_load(fen_or_size) {
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

  if (typeof engine === "undefined") engine = new Engine(fen);

  return engine;
}
