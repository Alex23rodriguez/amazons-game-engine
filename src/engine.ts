import { Board } from "./board";
import { LAYOUT_MAP, P_BLACK, P_WHITE, NOT_SHOOTING } from "./consts";
import { FEN, Move, Piece, Player, Square } from "./types";

export class Engine {
  private _board: Board;
  private _turn: Player;
  private _shooting_sq: Square;
  private _move_num: number;
  readonly rows;
  readonly cols;

  private hist: Move[];

  constructor(fen: FEN) {
    let [layout, turn, shooting_sq, move_num] = fen.split(/\s+/);
    this._turn = turn as Player;
    this._shooting_sq =
      shooting_sq === NOT_SHOOTING ? null : (shooting_sq as Square);
    this._move_num = Number(move_num);
    this._board = new Board(layout);
    this.rows = this._board.rows;
    this.cols = this._board.cols;

    this.hist = [];
  }

  fen(): FEN {
    return `${this._board.layout()} ${this._turn} ${this._shooting_sq} ${
      this._move_num
    }`;
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
    let m = this.hist.pop();
    if (typeof m === "undefined") return null;

    if (m.length === 3) {
      this._board.undo(m[2]);
      this.undo_shooting(m[2]);
      this.hist.push([m[0], m[1]]);
      return [m[2]];
    }

    if (m.length === 2) {
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

    let queens = this._board.get_positions(
      LAYOUT_MAP[this._turn] as Piece.BLACK | Piece.WHITE
    );
    let ans = [];

    for (let q of queens) {
      let queen_vision = this._board.get_vision(q);
      ans.push(...queen_vision.map((s) => [q, s]));
    }

    return ans;
  }

  ascii() {
    return this._board.ascii();
  }

  put(piece: Piece, sq: Square) {
    this._board.put(piece, sq);
    this.hist = []; // clear history, otherwise will get errors
  }

  get(sq: Square) {
    return this._board.get(sq);
  }

  // GETTERS

  get board() {
    return this._board.copy();
  }

  get turn() {
    return this._turn;
  }

  get move_num() {
    return this._move_num;
  }

  get shooting_sq() {
    return this._shooting_sq;
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
    if (typeof queen_move === undefined) {
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
}
