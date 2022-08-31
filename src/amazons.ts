import { DEFAULT_POSITIONS, LAYOUT_MAP } from "./consts";
import { Engine } from "./engine";
import { FEN, Move, Piece, Size, SqColor, Square } from "./types";
import { assert, coords_to_square, square_to_coords } from "./util";
import {
  is_valid_fen,
  is_default_size,
  is_square_in_range,
} from "./validation";

export const Amazons = (fen_or_size?: number | FEN) => {
  // INITIAL SETUP
  let engine = try_load(fen_or_size);
  let initial_fen = engine.fen();

  // VARIABLES
  let size: Size = { rows: engine.rows, cols: engine.cols };

  let moves: Move[];
  let moves_dict: { [sq: Square]: Square[] };
  let pieces: { w: Square[]; b: Square[]; x: Square[] };

  let update = () => {
    // update list
    moves = engine.moves();

    // update dict
    moves_dict = {};
    for (let m of moves) {
      // TODO: maybe change? its wierd when shooting
      let [start, end] = m;
      if (!moves_dict[start]) moves_dict[start] = [];
      if (end) moves_dict[start].push(end);
    }

    // update pieces
    let new_pieces = engine.get_pieces();
    pieces = { w: [], b: [], x: [] };
    for (let [k, v] of Object.entries(new_pieces)) {
      pieces[LAYOUT_MAP[k]] = v;
    }
  };

  // initial values
  update();

  // RETURN OBJECT
  return {
    ascii: (flip = false) => engine.ascii(flip),
    board: () => engine.board,
    // clear
    // delete_comment
    // delete_comments
    fen: () => engine.fen(),
    game_over: () => moves.length === 0,
    get: (sq: Square) => {
      assert(is_square_in_range(sq, size));
      return engine.get(sq);
    },
    // get_comment
    // header
    history: () => engine.history,
    in_endgame: null, //TODO
    load: (fen_or_size: any) => {
      try {
        let eng = try_load(fen_or_size);
        engine = eng;
        size = { rows: engine.rows, cols: eng.cols };
        update();
        return true;
      } catch {
        return false;
      }
    },
    non_empty_squares: () => {
      let ans: { [sq: Square]: string } = {};
      for (let [piece, sqs] of Object.entries(pieces)) {
        for (let sq of sqs) ans[sq] = piece;
      }
      return ans;
    },
    // load_pgn
    can_move: (m: Move) => {
      return moves.some((v) => v[0] === m[0] && v[1] === m[1]); // TODO update to support 3 moves with shooting
    },
    move: (m: Move) => {
      if (moves.some((v) => v[0] === m[0] && v[1] === m[1])) {
        engine.move(m);
        update();
        // TODO return move object
        return true;
      }
      return false;
    },
    max_square: () => coords_to_square({ col: size.cols - 1, row: 0 }, size),
    random_move: () => {
      if (moves.length === 0) return null;
      let move = moves[Math.floor(Math.random() * moves.length)];
      engine.move(move);
      update();
      return move;
    },
    move_num: () => engine.move_num,
    moves: () => {
      return moves;
    },
    moves_dict: () => moves_dict,
    pieces: () => pieces,
    // pgn
    // put: (piece: Piece, sq: Square) => {
    //   assert(is_square_in_range(sq, size));
    //   engine.put(piece, sq);
    //   update();
    // },
    // remove: (sq: Square) => {
    //   assert(is_square_in_range(sq, size));
    //   let p = engine.get(sq);
    //   engine.put(Piece.EMPTY, sq);
    //   update();
    //   return p;
    // },
    // reset
    reset: () => {
      engine = new Engine(initial_fen);
      update();
    },
    // set_comment
    size: () => size,
    shooting: () => engine.shooting_sq !== null,
    shooting_sq: () => engine.shooting_sq,
    square_color: (sq: Square) => {
      let coords = square_to_coords(sq, size);
      coords.row = size.rows - coords.row - 1; // change to top-left indexing
      let color = (coords.row + coords.col) % 2;
      return color === SqColor.DARK ? "dark" : "light";
    },
    turn: (other = false) => engine.turn(other),
    half_undo: () => {
      engine.half_undo();
      moves = engine.moves();
    },
    undo: () => {
      engine.undo();
      moves = engine.moves();
    },
    update: () => update(),
    validate_fen: (fen: string) => is_valid_fen(fen),
  };
};

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
