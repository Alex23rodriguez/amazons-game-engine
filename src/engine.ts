import { COLS, MAP_COLOR_SQUARE } from "./consts";
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

  public move(m: HalfMove) {
    //TODO
  }
  public full_move(m: Move) {
    //TODO
  }
  public get_moves() {
    // TODO
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

  private shooting_is_valid() {
    if (this.state.shooting === null) return { error: null };

    if (!is_square(this.state.shooting, this.rows, this.cols))
      return { error: "Shooting field is not a valid Square" };

    // otherwise, check if shooting is the correct color
    if (this.get(this.state.shooting) !== MAP_COLOR_SQUARE[this.state.moving])
      return { error: "shooting position does not point to moving player" };

    return { error: null };
  }
}
