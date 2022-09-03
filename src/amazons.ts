import { DEFAULT_POSITIONS, LAYOUT_MAP } from "./consts";
import { Engine } from "./engine";
import {
  Coords,
  FEN,
  GameState,
  Move,
  PiecesObj,
  Size,
  SqColor,
  Square,
} from "./types";
import { assert, coords_to_square, square_to_coords } from "./util";
import {
  is_valid_fen,
  is_default_size,
  is_square_in_range,
} from "./validation";

// function Amazons(fen_or_size?: number | FEN, safe = true): any;
// function Amazons(fen: FEN, safe)
export class Amazons {
  private engine: Engine;
  readonly initial_fen: FEN;
  private _pieces: PiecesObj;
  private _moves: Move[];
  private _moves_dict: { [sq: Square]: Square[] };
  private _size: Size;

  // constructor(fen: FEN, safe?: boolean);
  constructor(size?: number);
  constructor(state: GameState);
  constructor(param?: number | GameState) {
    this.engine = try_load(param);
    this.initial_fen = this.engine.fen();

    this._size = { rows: this.engine.rows, cols: this.engine.cols };
    this._moves = [];
    this._moves_dict = {};
    this._pieces = { w: [], b: [], x: [] };
    this.update();
  }

  private update() {
    // update pieces
    for (let [k, v] of Object.entries(this.engine.get_pieces())) {
      this._pieces[LAYOUT_MAP[k]] = v;
    }

    // update list
    this._moves = this.engine.moves();

    // update dict
    this._moves_dict = Object.fromEntries(
      this.engine.get_turn_positions().map((sq) => [sq, []])
    );

    for (let m of this._moves) {
      // TODO: maybe change? its wierd when shooting
      let [start, end] = m;
      if (!this._moves_dict[start]) this._moves_dict[start] = []; // kept just for shooting moves_dict, which isn't very useful
      if (end) this._moves_dict[start].push(end);
    }
  }

  ascii = (flip = false) => {
    return this.engine.ascii(flip);
  };
  board = () => this.engine.board;
  // clear
  // delete_comment
  // delete_comments
  fen = () => this.engine.fen();
  game_over = () => this._moves.length === 0;
  get = (sq: Square) => {
    assert(is_square_in_range(sq, this._size));
    return this.engine.get(sq);
  };
  // get_comment
  // header
  history = () => this.engine.history;
  in_endgame = null; //TODO
  load = (fen_or_size: FEN | number) => {
    try {
      let eng = try_load(fen_or_size);
      this.engine = eng;
      this._size = { rows: this.engine.rows, cols: eng.cols };
      this.update();
      return true;
    } catch {
      return false;
    }
  };
  non_empty_squares = () => {
    let ans: { [sq: Square]: string } = {};
    for (let [piece, sqs] of Object.entries(this._pieces)) {
      for (let sq of sqs) ans[sq] = piece;
    }
    return ans;
  };
  // load_pgn
  can_move = (m: Move) => {
    return this._moves.some((v) => v[0] === m[0] && v[1] === m[1]); // TODO update to support 3 moves with shooting
  };
  move = (m: Move) => {
    if (this._moves.some((v) => v[0] === m[0] && v[1] === m[1])) {
      this.engine.move(m);
      this.update();
      // TODO return move object
      return true;
    }
    return false;
  };
  max_square = () =>
    coords_to_square({ col: this._size.cols - 1, row: 0 }, this._size);
  random_move = () => {
    if (this._moves.length === 0) return null;
    let move = this._moves[Math.floor(Math.random() * this._moves.length)];
    this.engine.move(move);
    this.update();
    return move;
  };
  move_num = () => this.engine.move_num;
  moves = () => {
    return this._moves;
  };
  moves_dict = () => this._moves_dict;
  pieces = () => this._pieces;
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
  reset = () => {
    this.engine = new Engine(this.initial_fen);
    this.update();
  };
  // set_comment
  size = () => this._size;
  shooting = () => this.engine.shooting_sq !== null;
  shooting_sq = () => this.engine.shooting_sq;
  square_color = (sq: Square) => {
    let coords = square_to_coords(sq, this._size);
    coords.row = this._size.rows - coords.row - 1; // change to top-left indexing
    let color = (coords.row + coords.col) % 2;
    return color === SqColor.DARK ? "dark" : "light";
  };
  square_to_coords = (sq: Square) => square_to_coords(sq, this._size);
  coords_to_square = (coords: Coords) => coords_to_square(coords, this._size);
  index_to_square = (index: number) => {
    return coords_to_square(
      {
        row: Math.floor(index / this._size.cols),
        col: index % this._size.cols,
      },
      this._size
    );
  };
  turn = (other = false) => this.engine.turn(other);
  half_undo = () => {
    this.engine.half_undo();
    this._moves = this.engine.moves();
  };
  undo = () => {
    this.engine.undo();
    this._moves = this.engine.moves();
  };
  validate_fen = (fen: string) => is_valid_fen(fen);
}

function try_load(param?: FEN | number | GameState) {
  let fen: FEN;
  let engine: Engine;

  switch (typeof param) {
    case "undefined":
      fen = DEFAULT_POSITIONS[10];
      break;

    case "number":
      fen = assert(is_default_size(param)).fen;
      break;

    case "string":
      // fen = param.toLowerCase() as FEN;
      engine = assert(is_valid_fen(fen)).engine;
      break;

    case "object":
      // assert(is_valid_state) //TODO assert is valid GameState
      engine = new Engine(param);
      break;

    default:
      throw new Error(
        "parameter must be either a board size, a string representing a FEN, or a valid GameState object"
      );
  }

  if (typeof engine === "undefined") engine = new Engine(fen);

  return engine;
}

let a = new Amazons();
a.index_to_square;
