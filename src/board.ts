import { LAYOUT_MAP, RANKS } from "./consts";
import { ascii } from "./misc";
import { Piece, Square } from "./types";

export class Board {
  public board: Piece[][];
  readonly rows: number;
  readonly cols: number;
  private pieces: {
    [Piece.WHITE]: Square[];
    [Piece.BLACK]: Square[];
    [Piece.ARROW]: Square[];
  };

  /**
   * Class that handles movement of the pieces.
   * DOES NOT verify that the arguments it is given are correct, so should not be used directly (instead, use the API)
   * this is made for performance at the cost of soundness
   */
  constructor(layout: string) {
    let [rows, cols] = get_layout_shape(layout);
    rows = rows;
    cols = cols;
    this.rows = rows;
    this.cols = cols;
    this.board = layout_to_board(layout, cols);
    this.pieces = this.get_initial_pieces();
  }

  /**
   * creates and returns an empty Board of the given size
   */
  static from_size(rows: number, cols: number) {
    return new Board(Array(rows).fill(cols).join("/"));
  }

  /**
   * make a move on the board. different behavior depending of number of args:
   * 1 arg: assumes second part of move: places an arrow at sq1
   * 2 args: assumes first part of move: moves piece at sq1 to sq2 and clears sq1
   * 3 args: assumes full move: moves piece at sq1 to sq2 and clears sq1, then places an arrow at sq3
   */
  move(sq1: Square, sq2?: Square, sq3?: Square) {
    if (typeof sq2 === "undefined") {
      // place an arrow at specified square
      this.put(Piece.ARROW, sq1);
      this.pieces[Piece.ARROW].push(sq1);
      return;
    }

    this.move_queen(sq1, sq2);

    if (sq3) {
      // place an arrow at specified square
      this.put(Piece.ARROW, sq3);
      this.pieces[Piece.ARROW].push(sq3);
    }
  }

  /**
   * undo a move on the board. different behavior depending of number of args:
   * WARNING: assumes you are undoing the last move! otherwise the pieces get messed up.
   * 1 arg: assumes second part of move: clears sq1 (hopefully from an arrow)
   * 2 args: assumes first part of move: moves piece at sq2 to sq1 and clears sq2
   * 3 args: assumes full move: clears sq3, then moves piece at sq2 to sq1 and clears sq2
   */
  undo(sq1: Square, sq2?: Square, sq3?: Square) {
    if (typeof sq2 === "undefined") {
      // undo placement of an arrow
      this.remove(sq1);
      this.pieces[Piece.ARROW].pop();
      return;
    }
    if (sq3) {
      // remove arrow
      this.remove(sq3);
      this.pieces[Piece.ARROW].pop();
    }
    this.move_queen(sq2, sq1);
  }

  /**
   * returns the board represented as a layout field of a FEN (check README for details)
   */
  layout() {
    return board_to_layout(this.board);
  }

  /**
   * return a copy of the board as an array of arrays of pieces
   */
  copy() {
    let copy: Piece[][] = [];
    for (let row of this.board) {
      copy.push(Array.from(row));
    }
    return copy;
  }

  get_positions(piece: Piece.WHITE | Piece.BLACK | Piece.EMPTY) {
    return this.pieces[piece] as Square[];
  }

  get_pieces() {
    return this.pieces;
  }

  get_vision(sq: Square) {
    let squares: Square[] = [];
    for (let i of [-1, 0, 1]) {
      for (let j of [-1, 0, 1]) {
        if (i === 0 && j === 0) continue;

        let [r, c] = this.to_coords(sq);
        r += i;
        c += j;
        while (this.board[r] && this.board[r][c] === Piece.EMPTY) {
          squares.push(this.from_coords(r, c));
          r += i;
          c += j;
        }
      }
    }
    return squares;
  }

  ascii(flip = false) {
    return ascii(this.board, flip);
  }

  /**
   * returns the piece at the specified square
   */
  get(sq: Square) {
    let [r, c] = this.to_coords(sq);
    return this.board[r][c];
  }

  // PRIVATE METHODS

  /**
   * puts the specified non empty piece in the specified square
   * DOESN'T handle the updating of this.pieces
   */
  private put(piece: Piece.WHITE | Piece.BLACK | Piece.ARROW, sq: Square) {
    // square to coords
    let [r, c] = this.to_coords(sq);
    this.board[r][c] = piece;
  }

  /**
   * clears the specified square.
   * DOESN'T handle the updating of this.pieces
   */
  private remove(sq: Square) {
    // square to coords
    let [r, c] = this.to_coords(sq);
    this.board[r][c] = Piece.EMPTY;
  }

  /**
   * moves (without checking) the piece on sq1 to sq2 and clears sq2
   * DOES handle the updating of this.pieces
   */
  private move_queen(sq1: Square, sq2: Square) {
    // move queen at sq1 to sq2. Assumes sq1 !== sq2
    const prev = this.get(sq1) as Piece.WHITE | Piece.BLACK;
    this.put(prev, sq2);
    this.remove(sq1);

    // update pieces, but keep order
    this.pieces[prev][this.pieces[prev].indexOf(sq1)] = sq2;
  }

  /**
   * given a square, returns the row and col to index Piece[][]
   */
  private to_coords(sq: Square) {
    let coords: [number, number] = [
      this.rows - Number(sq.substring(1)),
      RANKS.indexOf(sq[0]),
    ];
    return coords;
  }

  private from_coords(row: number, col: number) {
    let sq: Square = `${RANKS[col]}${this.rows - row}` as Square;
    return sq;
  }

  private get_initial_pieces() {
    let pieces = {
      [Piece.WHITE]: [],
      [Piece.BLACK]: [],
      [Piece.ARROW]: [],
    };

    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++) {
        let p = this.board[r][c];
        if (p !== Piece.EMPTY) pieces[p].push(this.from_coords(r, c));
      }
    return pieces;
  }
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
    board.push(make_board_row(row, cols));
  }
  return board;
}

/**
 * given a row from the layout field of a FEN (check README for details)
 * will return a Piece[] corresponding to the actual positions of the pieces
 */
function make_board_row(layout_row: string, cols: number) {
  // TODO: change to regex parsing
  let ans: Piece[] = Array(cols).fill(Piece.EMPTY);
  let index = 0;
  let sub = "";
  for (let char of layout_row) {
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

function board_to_layout(board: Piece[][]) {
  return board.map(make_layout_row).join("/");
}

function make_layout_row(row: Piece[]) {
  let ans = "";
  let cnt_empty = 0;
  for (let p of row) {
    if (p === Piece.EMPTY) {
      cnt_empty++;
      continue;
    }
    ans += cnt_empty ? cnt_empty : "";
    ans += LAYOUT_MAP[p];
    cnt_empty = 0;
  }

  ans += cnt_empty ? cnt_empty : "";
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
    if (!Number.isNaN(n)) {
      // char is a digit
      num_empty += char;
      continue;
    }
    // when char represents an arrow, or a queen
    count++;
    count += Number(num_empty); // will be zero if empty string
    num_empty = "";
  }
  count += Number(num_empty);
  return count;
}

function get_layout_shape(layout: string) {
  let rows = layout.split("/");
  let cols = get_row_length(rows[0]);
  return [rows.length, cols];
}
