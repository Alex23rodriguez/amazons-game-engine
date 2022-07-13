import { Board } from "./board";
import { LAYOUT_MAP, P_BLACK, P_WHITE } from "./consts";
import { FEN, Move, Player, Square } from "./types";

export class Engine {
  private board: Board;
  private moving: Player;
  private shooting: Square;
  private turn: number;

  private hist: Move[];

  constructor(fen: FEN) {
    let [layout, moving, shooting, turn] = fen.split(/\s+/);
    this.board = new Board(layout);
    this.moving = moving as Player;
    this.shooting = shooting === "-" ? null : (shooting as Square);
    this.turn = Number(turn);

    this.hist = [];
  }

  public fen() {
    return `${this.board.layout()} ${this.moving} ${this.shooting} ${
      this.turn
    }`;
  }

  public move(m: Move) {
    // move board
    this.board.move(...m);

    // update self
    let func_index = m.length - 1;

    [(this.after_shooting, this.after_queen_move, this.after_full_move)][
      func_index
    ](...m);
  }

  public moves(): Move[] {
    if (this.shooting) {
      let queen_vision = this.board.get_vision(this.shooting);
      return queen_vision.map((s) => [s]);
    }

    let queens = this.board.get_positions(LAYOUT_MAP[this.shooting]);
    let ans = [];

    for (let q of queens) {
      let queen_vision = this.board.get_vision(q);
      ans.push(...queen_vision.map((s) => [q, s]));
    }

    return ans;
  }

  // PRIVATE METHODS

  private after_shooting(sq3: Square) {
    // update state
    this.turn++;
    this.switch_player();
    this.shooting = null;

    // update history
    let queen_move = this.hist.pop();
    if (typeof queen_move === undefined) {
      this.hist.push([sq3]); // in case the board started with a half move
    } else {
      this.hist.push([queen_move[0], queen_move[1], sq3]);
    }
  }

  private after_queen_move(sq1: Square, sq2: Square) {
    // update state
    this.shooting = sq2;

    // update history
    this.hist.push([sq1, sq2]);
  }

  private after_full_move(sq1: Square, sq2: Square, sq3: Square) {
    // update state
    this.turn++;
    this.switch_player();
    // shooting is already null

    // update history
    this.hist.push([sq1, sq2, sq3]);
  }

  private switch_player() {
    this.moving = this.moving === P_WHITE ? P_BLACK : P_WHITE;
  }
}
