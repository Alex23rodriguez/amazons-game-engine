import { BLACK, COLS, WHITE } from "./consts";
import { Piece, Player, Square } from "./types";
import { get_layout_shape, maybe_verbose } from "./util";

/**
 * Verify that the given string is a valid square, given a board size.
 * square must be in lowercase letters
 */
export function is_square(sq: string, rows: number, cols: number) {
  // check column
  let max_col = COLS[cols - 1];
  if (sq[0] < "a" || sq[0] > max_col) return false;
  // check row
  let row = Number(sq.substring(1));
  return row >= 1 && row <= rows;
}

/**
 * Verify that the given string is a valid move, given the board size.
 * moves consist of three squares separated by a '-'
 * DOES NOT verify that the move is possible (ie vertical, horizontal or on the diagonal)
 */
export function is_move(move: string, rows: number, cols: number) {
  const parts = move.split("-");
  return parts.length === 3 && parts.every((x) => is_square(x, rows, cols));
}

/**
 * Verify that the given string is a valid move, given the board size.
 * moves consist of two squares separated by a '-'
 * DOES NOT verify that the move is possible (ie vertical, horizontal or on the diagonal)
 */
export function is_half_move(move: string, rows: number, cols: number) {
  const parts = move.split("-");
  return parts.length === 2 && parts.every((x) => is_square(x, rows, cols));
}

/**
 * Verify that the given string coincides with a char designating either player
 */
export function is_player(p: string) {
  return p === BLACK || p === WHITE;
}

/**
 * Verify that the given parameter represents a positive int
 */
export function is_turn(turn: number | string) {
  let n = Number(turn);
  return n >= 1 && n === ~~n;
}

/**
 * Verify that the given string constitutes a valid FEN.
 * @param fen string to check
 * @param verbose if true, instead of returning a boolean, will return {value: boolean, error: string | null} detailing what failed in the FEN
 *
 * A valid FEN is a string with 4 fields separated by whitespace:
 * - layout: a string detailing the layout of the board (view README for more info)
 * - moving: the current active player, whose turn it is to make a move
 * - shooting: '-' if the current active player has not moved their queen, and square pointing to the queen if pending arrow
 * - turn: a positive integer indicating the turn of the game, where one turn is when both players make a full move
 *
 * WARNING: in case shooting field is a square,
 *   DOES NOT verify that it is within the size of the board,
 *   NOR that it points to a queen of the correct color
 */
export function is_fen(fen: string, verbose = false) {
  let fields = fen.split(/\s+/);
  if (fields.length !== 4)
    return maybe_verbose(
      verbose,
      false,
      "FEN must contain exactly 4 fields separated by a whitespace"
    );

  // split fen into individual fields
  const [layout, moving, shooting, turn] = fields;

  // start fen validation
  if (!is_player(moving))
    return maybe_verbose(verbose, false, `Invalid moving player: ${moving}`);

  if (!is_turn(turn))
    return maybe_verbose(verbose, false, `Invalid turn number: ${turn}`);

  let dimensions = get_layout_shape(layout, true);
  if (dimensions.error) {
    return maybe_verbose(verbose, false, `Invalid layout: ${dimensions.error}`);
  }

  let { rows, cols } = dimensions;

  if (shooting !== "-") {
    if (!is_square(shooting, rows, cols)) {
      return maybe_verbose(
        verbose,
        false,
        `Invalid shooting square: ${shooting}`
      );
    }
  }

  return maybe_verbose(verbose, true, null);
}
