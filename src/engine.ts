import { Board } from "./board";
import { LAYOUT_MAP, P_BLACK, P_WHITE, NOT_SHOOTING } from "./consts";
import {
  BoardPiecesObj,
  FEN,
  GameState,
  Move,
  PiecesObj,
  Player,
  Square,
} from "./types";

export class Engine {
  private _board: Board;
  private _turn: Player;
  private _shooting_sq: Square;
  private _move_num: number;
  readonly rows: number;
  readonly cols: number;

  private hist: Move[];

  constructor(fen: FEN);
  constructor(state: GameState);
  constructor(state: FEN | GameState) {
    if (typeof state === "string") {
      const fen = state;
      const [layout, turn, shooting_sq, move_num] = fen.split(/\s+/);
      this._turn = turn as Player;
      this._shooting_sq =
        shooting_sq === NOT_SHOOTING ? null : (shooting_sq as Square);
      this._move_num = Number(move_num);
      this._board = new Board(layout);
    } else {
      this._turn = state.turn;
      this._shooting_sq = state.shooting_sq;
      this._move_num = state.move_num ?? 1;
      this._board = new Board({
        size: state.size,
        pieces: this.swap_pieces_obj(state.pieces),
      });
    }
    this.rows = this._board.rows;
    this.cols = this._board.cols;

    this.hist = [];
  }

  fen(): FEN {
    return `${this._board.layout()} ${this._turn} ${
      this._shooting_sq ? this._shooting_sq : "-"
    } ${this._move_num}`;
  }

  save_state(): GameState {
    return {
      size: { rows: this.rows, cols: this.cols },
      pieces: this.swap_pieces_obj(this._board.get_pieces()),
      turn: this._turn,
      shooting_sq: this._shooting_sq,
      move_num: this._move_num,
    };
  }

  move(m: Move) {
    // move board
    this._board.move(...m);

    // update self
    let func_index = m.length - 1;

    [this.after_shooting, this.after_queen_move, this.after_full_move][
      func_index
    ](...m);
  }

  undo() {
    // TODO: changes player when starting from shooting pos, then shooting and undoing
    let m = this.hist.pop();
    if (typeof m === "undefined") return null;

    this._board.undo(...m);

    if (m.length > 1) {
      this.undo_move();
      return m;
    }

    // m.length === 1
    // this should only happen if starting position was shooting
    this.undo_shooting(m[0]);
    return m;
  }

  half_undo(): Move {
    // TODO: doesn't work when starting from shooting pos then shooting, then half_undoing
    let m = this.hist.pop();
    if (typeof m === "undefined") return null;

    if (m.length === 3) {
      this._board.undo(m[2]);
      this.undo_shooting(m[2]);
      this.hist.push([m[0], m[1]]);
      return [m[2]];
    }

    if (m.length === 2) {
      this._board.undo(m[0], m[1]);
      this.undo_move();
      return m;
    }

    // m.length === 1
    // this should only happen if starting position was shooting
    this.undo_shooting(m[0]);
    return m;
  }

  moves(): Move[] {
    if (this._shooting_sq) {
      let queen_vision = this._board.get_vision(this._shooting_sq);
      return queen_vision.map((s) => [s]);
    }

    let queens = this._board.get_positions(LAYOUT_MAP[this._turn]);
    let ans = [];

    for (let q of queens) {
      let queen_vision = this._board.get_vision(q);
      ans.push(...queen_vision.map((s) => [q, s]));
    }

    return ans;
  }

  ascii(flip = false) {
    return this._board.ascii(flip);
  }

  // put(piece: Piece, sq: Square) {
  //   this._board.put(piece, sq);
  //   this.hist = []; // clear history, otherwise will get errors
  // }

  get(sq: Square) {
    return this._board.get(sq);
  }

  get_pieces() {
    return this._board.get_pieces();
  }

  turn(other = false) {
    if (other) return this._turn === P_WHITE ? P_BLACK : P_WHITE;
    return this._turn;
  }

  get_turn_positions(other = false) {
    if (other)
      return this._board.get_positions(
        LAYOUT_MAP[this._turn === P_WHITE ? P_BLACK : P_WHITE]
      );

    return this._board.get_positions(LAYOUT_MAP[this._turn]);
  }
  // GETTERS

  get board() {
    return this._board.copy();
  }

  get move_num() {
    return this._move_num;
  }

  get shooting_sq() {
    return this._shooting_sq;
  }

  get history() {
    return this.hist.map((m) => Array.from(m)) as Move[];
  }
  // PRIVATE METHODS

  private switch_player() {
    this._turn = this._turn === P_WHITE ? P_BLACK : P_WHITE;
  }

  // notice that in these functions, arrow syntaxt is important for binding 'this'
  private after_queen_move = (sq1: Square, sq2: Square) => {
    // update state
    this._shooting_sq = sq2;

    // update history
    this.hist.push([sq1, sq2]);
  };

  private after_shooting = (sq3: Square) => {
    // update state
    this.switch_player();
    if (this._turn === P_WHITE) this._move_num++;
    this._shooting_sq = null;

    // update history
    let queen_move = this.hist.pop();
    if (typeof queen_move === "undefined") {
      this.hist.push([sq3]); // in case the board started with a half move
    } else {
      this.hist.push([queen_move[0], queen_move[1], sq3]);
    }
  };

  private after_full_move = (sq1: Square, sq2: Square, sq3: Square) => {
    // update state
    this.switch_player();
    if (this._turn === P_WHITE) this._move_num++;
    // shooting is already null

    // update history
    this.hist.push([sq1, sq2, sq3]);
  };

  private undo_shooting(sq3: Square) {
    this._shooting_sq = sq3;
  }

  private undo_move() {
    this.switch_player();
    if (this._turn === P_BLACK) this._move_num--;
    this._shooting_sq = null;
  }

  private swap_pieces_obj(pieces: PiecesObj): BoardPiecesObj;
  private swap_pieces_obj(pieces: BoardPiecesObj): PiecesObj;
  private swap_pieces_obj(pieces: PiecesObj | BoardPiecesObj) {
    const p = {};
    Object.entries(pieces).forEach(([key, arr]) => {
      p[LAYOUT_MAP[key]] = arr;
    });
    return p;
  }
}
