import { BLACK, COLS, PLAYER_TO_PIECE, WHITE } from "./consts";
import { FEN, HalfMove, Move, Piece, Player, Square, State } from "./types";
import {
  board_to_layout,
  get_layout_shape_unsafe,
  layout_to_board,
} from "./util";
import { is_fen, is_square } from "./validation";

export class Engine {
  private state: State;
  private rows: number;
  private cols: number;
  /**
   *  Creates a game engine, which handles and manipulates game state.
   *  @param state: either a State object (board, moving, shooting, turn) or a FEN string
   **/
  constructor(state: State | FEN) {
    if (typeof state === "string") this.make_state_from_fen(state);
    else if (typeof state === "object") this.make_state(state);
    else
      throw new Error(
        "Engine must be initialized with either a State object or a FEN string"
      );

    if (this.state.shooting) {
      let temp = this.shooting_is_valid();
      if (temp.error) throw new Error(temp.error);
    }
  }

  /**
   * Update state by preforming half move m.
   * DOES NOT validate. Blindly trusts that m is part of available moves
   */
  public move(m: HalfMove | Square) {
    if (this.state.shooting) {
      this.put(m as Square, Piece.ARROW);
      this.state.turn++;
      this.change_moving_player();
      this.state.shooting = null;
    } else {
      let [from, to] = m.split("-");
      this.put(from as Square, Piece.EMPTY);
      this.put(to as Square, PLAYER_TO_PIECE[this.state.moving]);
      this.state.shooting = to as Square;
    }
  }

  /**
   * Update state by preforming full move m.
   * DOES NOT validate. Blindly trusts that m is part of available moves
   */
  public full_move(m: Move) {}
  public get_moves() {
    if (this.state.shooting) {
      return this.get_vision(this.state.shooting);
    }

    let ans: HalfMove[] = [];
    for (let queen of this.get_location_of(this.state.moving)) {
      for (let sq of this.get_vision(queen)) {
        ans.push(`${queen}-${sq}`);
      }
    }
    return ans;
  }

  public undo(m: HalfMove) {
    //TODO
  }
  public full_undo(m: Move) {
    //TODO
  }
  public get_board() {
    //TODO
  }

  public get(sq: Square): Piece {
    let [row, col] = this.get_index(sq);
    return this.state.board[row][col];
  }
  public fen() {
    return `${board_to_layout(this.state.board)} ${this.state.moving} ${
      this.state.shooting
    } ${this.state.turn}`;
  }

  /**************** PRIVATE METHODS *******************/
  private get_location_of(p: Player) {
    let piece = PLAYER_TO_PIECE[p];
    let squares: Square[] = [];
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        if (this.state.board[r][c] === piece)
          squares.push(this.from_index(r, c));
    return squares;
  }

  private get_vision(sq: Square) {
    let squares: Square[] = [];
    for (let i of [-1, 0, 1]) {
      for (let j of [-1, 0, 1]) {
        if (i === 0 && j === 0) continue;

        let [r, c] = this.get_index(sq);
        r += i;
        c += j;
        while (this.state.board[r] && this.state.board[r][c] === Piece.EMPTY) {
          squares.push(this.from_index(r, c));
          r += i;
          c += j;
        }
      }
    }
    return squares;
  }

  private change_moving_player() {
    this.state.moving = this.state.moving === BLACK ? WHITE : BLACK;
  }

  private put(sq: Square, p: Piece) {
    let [r, c] = this.get_index(sq);
    this.state.board[r][c] = p;
  }

  private make_state_from_fen(fen: FEN) {
    let temp = is_fen(fen, true);
    if (temp.error) throw new Error(temp.error);
    let [layout, moving, shooting, turn] = fen.split(/\s+/);

    let [rows, cols] = get_layout_shape_unsafe(layout);
    this.rows = rows;

    this.state = {
      board: layout_to_board(layout, cols),
      moving: moving as Player,
      shooting: shooting === "-" ? null : (shooting as Square),
      turn: Number(turn),
    };
  }

  private make_state(state: any) {
    for (let property of ["board", "moving", "shooting", "turn"]) {
      if (typeof state[property] === "undefined")
        throw new Error(`State must contain a '${property}' property`);
    }

    this.state = {
      board: state.board,
      moving: state.moving,
      shooting: state.shooting,
      turn: state.turn,
    };
    this.rows = state.board.length;
    this.cols = state.board[0].length;
  }

  private get_index(sq: Square) {
    let indexes: [number, number] = [
      this.rows - Number(sq.substring(1)),
      COLS.substring(0, this.cols).indexOf(sq[0]),
    ];
    return indexes;
  }

  private from_index(row: number, col: number): Square {
    return `${COLS[col]}${row + 1}` as Square;
  }

  private shooting_is_valid() {
    if (this.state.shooting === null) return { error: null };

    if (!is_square(this.state.shooting, this.rows, this.cols))
      return { error: "Shooting field is not a valid Square" };

    // otherwise, check if shooting is the correct color
    if (this.get(this.state.shooting) !== PLAYER_TO_PIECE[this.state.moving])
      return { error: "shooting position does not point to moving player" };

    return { error: null };
  }
}
