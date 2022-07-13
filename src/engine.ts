import { Board } from "./board";
import { LAYOUT_MAP, P_BLACK, P_WHITE } from "./consts";
import { FEN, Move, Piece, Player, Square } from "./types";
import { ascii } from "./misc";

export class Engine {
  private _board: Board;
  private _turn: Player;
  private _shooting_sq: Square;
  private _move_num: number;

  private hist: Move[];

  constructor(fen: FEN) {
    let [layout, turn, shooting, move_num] = fen.split(/\s+/);
    this._board = new Board(layout);
    this._turn = turn as Player;
    this._shooting_sq = shooting === "-" ? null : (shooting as Square);
    this._move_num = Number(move_num);

    this.hist = [];
  }

  public fen() {
    return `${this._board.layout()} ${this._turn} ${this._shooting_sq} ${
      this._move_num
    }`;
  }

  public move(m: Move) {
    // move board
    this._board.move(...m);

    // update self
    let func_index = m.length - 1;

    [this.after_shooting, this.after_queen_move, this.after_full_move][
      func_index
    ](...m);
  }

  public moves(): Move[] {
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
    return ascii(this._board.board);
  }

  // GETTERS

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

  // notice that in these functions, arrow syntaxt is important for binding 'this'
  private after_shooting = (sq3: Square) => {
    // update state
    this._move_num++;
    this.switch_player();
    this._shooting_sq = null;

    // update history
    let queen_move = this.hist.pop();
    if (typeof queen_move === undefined) {
      this.hist.push([sq3]); // in case the board started with a half move
    } else {
      this.hist.push([queen_move[0], queen_move[1], sq3]);
    }
  };

  private after_queen_move = (sq1: Square, sq2: Square) => {
    // update state
    this._shooting_sq = sq2;

    // update history
    this.hist.push([sq1, sq2]);
  };

  private after_full_move = (sq1: Square, sq2: Square, sq3: Square) => {
    // update state
    this._move_num++;
    this.switch_player();
    // shooting is already null

    // update history
    this.hist.push([sq1, sq2, sq3]);
  };

  private switch_player() {
    this._turn = this._turn === P_WHITE ? P_BLACK : P_WHITE;
  }
}
