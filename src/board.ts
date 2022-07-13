import { LAYOUT_MAP, RANKS, RANK_MAP } from "./consts";
import { Piece, Square } from "./types";

export class Board {
  private board: Piece[][];

  constructor(layout: string) {
    let [rows, cols] = get_layout_shape(layout);
    rows = rows;
    cols = cols;
    this.board = layout_to_board(layout, cols);
  }

  static from_size(rows: number, cols: number) {
    return new Board(Array(rows).fill(cols).join("/"));
  }

  /**
   * TODO: documentation
   */
  move(sq1: Square, sq2?: Square, sq3?: Square) {
    if (typeof sq2 === "undefined") {
      // place an arrow at specified square
      this.put(sq1, Piece.ARROW);
      return;
    }
    // move queen at sq1 to sq2
    this.put(sq2, this.get(sq1));
    this.put(sq1, Piece.EMPTY);
    if (sq3) {
      // place an arrow at specified square
      this.put(sq3, Piece.ARROW);
    }
  }

  undo(sq1: Square, sq2?: Square, sq3?: Square) {
    if (typeof sq2 === "undefined") {
      // undo placement of an arrow
      this.put(sq1, Piece.EMPTY);
      return;
    }
    if (sq3) {
      // remove arrow
      this.put(sq3, Piece.EMPTY);
    }
    // undo movement of a queen
    this.put(sq1, this.get(sq2));
    this.put(sq2, Piece.EMPTY);
  }

  private put(sq: Square, piece: Piece) {
    // square to coords
    let [r, c] = sq_to_coords(sq);

    this.board[r][c] = piece;
  }

  private get(sq: Square) {
    let [r, c] = sq_to_coords(sq);
    return this.board[r][c];
  }
}

function sq_to_coords(sq: Square) {
  return [Number(sq.substring(1)) - 1, RANK_MAP[sq[0]]];
}

/**
 * given a layout field of a FEN (check README for details), will return a Piece[][]
 * WARNING: only use when **certain** that the layout is valid,
 *   otherwise could lead to errors
 */
function layout_to_board(layout: string, cols: number) {
  let rows = layout.split("/");

  const board: Piece[][] = [];
  for (let row of rows) {
    board.push(make_row(row, cols));
  }
  return board;
}

/**
 * given a row from the layout field of a FEN (check README for details)
 * will return a Piece[] corresponding to the actual positions of the pieces
 */
function make_row(row: string, cols: number) {
  let ans: Piece[] = Array(cols).fill(Piece.EMPTY);
  let index = 0;
  let sub = "";
  for (let char of row) {
    let n = Number(char);
    if (Number.isNaN(n)) {
      index += Number(sub);
      sub = "";
      ans[index] = LAYOUT_MAP[char];
      index++;
    } else {
      sub += char;
    }
  }
  return ans;
}

/**
 * given a row from the layout field of a FEN (check README for details)
 * will return its length
 */
function get_row_length(row: string) {
  let count = 0;
  let num_empty = ""; // acumulates chars that represent a number
  for (let char of row) {
    let n = Number(char);
    // when char represents an arrow, or a queen
    if (Number.isNaN(n)) {
      count++;
      count += Number(num_empty); // will be zero if empty string
      num_empty = "";
      // when char represents empty space
    } else {
      num_empty += char;
    }
  }
  count += Number(num_empty);
  return count;
}

function get_layout_shape(layout: string) {
  let rows = layout.split("/");
  let cols = get_row_length(rows[0]);
  return [rows.length, cols];
}
