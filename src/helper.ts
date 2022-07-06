import { Square, Player, FEN, Game, ErrorObj, Position } from "./types";
import * as cnst from "./consts";
import { is_turn, is_position, is_player } from "./validation";
import { Board } from "./board";

export function create_game(fen_or_size: FEN | number): Game | ErrorObj {
  let fen: FEN;
  if (typeof fen_or_size === "string") fen = fen_or_size;
  else if (typeof fen_or_size === "number") {
    fen = cnst.DEFAULT_POSITIONS[fen];
    if (typeof fen === "undefined")
      return {
        error: `size must be one of ${Object.keys(cnst.DEFAULT_POSITIONS)}`,
      };
  } else
    return {
      error:
        "parameter must be either a board size or a string representing a FEN.",
    };

  let parts = fen.split(" ");
  if (parts.length !== 4)
    return {
      error: "FEN must contain exactly 4 fields separated by a single space",
    };

  const [layout, moving, shooting, turn] = parts;
  const game: Game = {
    layout,
    moving: moving as Player,
    turn: Number(turn) as number,
    // assigned once layout is proven to be correct:
    board: null,
    shooting: null,
  };

  // start fen validation
  if (!is_player(moving)) return { error: "Invalid player color" };

  if (!is_turn(turn)) return { error: "Invalid turn number" };

  let dimensions = is_layout(layout);
  if (dimensions.error) return dimensions as ErrorObj;

  // it is now safe to make the board
  let { rows, cols } = dimensions;
  let board = layout_to_board(layout, cols);
  game["board"] = board;

  if (!is_position(shooting, rows, cols)) {
    return { error: "shooting field is not a valid position" };
  }
  // if shooting is '-', the FEN is correct
  if (shooting === "-") {
    game["shooting"] = null;
    return game;
  }
  // otherwise, check if shooting is the correct color
  if (board.get(shooting as Position) !== cnst.MAP_COLOR_SQUARE[moving])
    return { error: "shooting position does not point to moving player" };

  game["shooting"] = shooting as Position;
  return game;
}

export function layout_to_board(layout: string, cols: number) {
  const board: Square[][] = [];
  for (let row of layout.split("/")) {
    board.push(make_row(row, cols));
  }
  return new Board(board);
}

function make_row(row: string, cols: number) {
  let ans: Square[] = Array(cols).fill(0);
  let index = 0;
  let sub = "";
  for (let char of row) {
    let n = Number(char);
    if (Number.isNaN(n)) {
      ans[index] = cnst.MAP_COLOR_SQUARE[char];
      index++;
      if (sub) {
        index += Number(sub);
        sub = "";
      }
    } else {
      sub += char;
    }
  }
  return ans;
}

/** Checks the board-setup part of the FEN and returns the dimensions if valid */
export function is_layout(layout: string) {
  let rows: string[] = layout.split("/");
  if (rows.length > 20) return { error: "Board must have at most 20 rows" };

  let cols: number = check_row(rows[0]);
  if (cols > 20) return { error: "Board must have at most 20 columns" };

  for (let row of rows.slice(1)) {
    if (check_row(row) !== cols)
      return { error: "All rows must have the same ammount of columns" };
  }
  return { rows: rows.length, cols };
}

function check_row(row: string) {
  let count = 0;
  let sub = "";
  for (let char of row) {
    if (!cnst.VALID_CHARS.includes(char)) return 0; // invalid row
    let n = Number(char);
    if (Number.isNaN(n)) {
      count++;
      if (sub) {
        count += Number(sub);
        sub = "";
      }
    } else {
      sub += char;
    }
  }
  count += Number(sub);
  return count;
}
