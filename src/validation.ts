import {
  LAYOUT_CHARS,
  LAYOUT_MAP,
  MAX_SIZE,
  P_BLACK,
  P_WHITE,
  RANKS,
} from "./consts";
import { Engine } from "./engine";
import { FEN, Player } from "./types";

function wrap(value: any, error: string, byprod?: any) {
  if (typeof byprod === "undefined") return { value, error };
  return { value, error, byprod };
}

/**
 * given a row from the layout field of a FEN (check README for details)
 * will return its length, or null if the row is invalid
 * @param row a row from the layout field of a FEN
 */
function get_row_length(row: string) {
  if (row === "") {
    return wrap(null, "Row cannot be empty string");
  }
  let count = 0;
  let sub = "";
  for (let char of row) {
    if (!LAYOUT_CHARS.includes(char))
      return wrap(null, `Row contains invalid char: '${char}'`); // invalid row
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
  return wrap(count, null);
}

function get_layout_shape(layout: string) {
  let bad_layout = [null, null];
  let rows: string[] = layout.split("/");
  if (rows.length > 20)
    return wrap(bad_layout, "Board must have at most 20 rows");

  // check first row to get number of columns
  let temp = get_row_length(rows[0]);
  if (temp.error) {
    return wrap(bad_layout, `row#0 ${rows[0]}: ${temp.error}`);
  }
  let num_cols: number = temp.value;
  if (num_cols > 20)
    return wrap(bad_layout, "Board must have at most 20 columns");

  // check all other rows
  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    temp = get_row_length(row);
    if (temp.error) {
      return wrap(bad_layout, `row#${i} ${row}: ${temp.error}`);
    }
    if (num_cols !== temp.value)
      return wrap(
        bad_layout,
        `row#${i} ${row} should have ${num_cols} columns, but has ${temp.value}`
      );
  }
  return wrap({ rows: rows.length, cols: num_cols }, null);
}

/**
 * Verify that the given string is a valid square, given a board size.
 * square must be in lowercase letters
 * @returns byprod row and col which can be used to index board
 */
export function is_square(sq: string) {
  let col = RANKS.indexOf(sq[0]);
  if (col === -1) return wrap(false, `Invalid square name: ${sq}`);
  let row = Number(sq.substring(1));

  if (row < 1 || row > MAX_SIZE || row !== ~~row)
    return wrap(false, `Invalid square name: ${sq}`);

  return wrap(true, null, { row: row - 1, col: col });
}

export function is_square_in_range(sq: string, rows: number, cols: number) {
  let issq = is_square(sq);
  if (issq.error) return issq;

  if (issq.byprod.col > cols)
    return wrap(
      false,
      `Column must be at most '${RANKS[cols]}' for given layout, instead got '${sq[0]}'`
    );
  let row = issq.byprod.row;
  if (row < 0 || row >= rows)
    return wrap(
      false,
      `Row must be at most ${rows} for given layout, instead got ${row + 1}`
    );
  return wrap(true, null);
}

/**
 * Verify that the given string coincides with a char designating either player
 */
export function is_player(p: string) {
  let ans = p === P_BLACK || p === P_WHITE;
  return ans
    ? wrap(true, null)
    : wrap(
        false,
        `Turn field invalid. Expected '${P_WHITE}' or '${P_BLACK}', instead got '${p}'`
      );
}

/**
 * Verify that the given parameter represents a positive int
 */
export function is_turn(turn: number | string) {
  let n = Number(turn);
  let ans = n >= 1 && n === ~~n;
  return ans
    ? wrap(true, null)
    : wrap(false, `Turn must be a positive int, instead got ${turn}`);
}

/**
 * Verify that the given string constitutes a valid FEN.
 * @param fen string to check
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
export function is_fen(fen: string) {
  let fields = fen.split(/\s+/);
  if (fields.length !== 4)
    return wrap(
      false,
      "FEN must contain exactly 4 fields separated by a whitespace"
    );

  // split fen into individual fields
  const [layout, turn, shooting_sq, move_num] = fields;

  // start fen validation
  let temp = is_player(turn);
  if (temp.error) return temp;

  temp = is_turn(move_num);
  if (temp.error) return temp;

  let dimensions = get_layout_shape(layout);
  if (dimensions.error) {
    return dimensions;
  }

  let { rows, cols } = dimensions.value;

  if (shooting_sq !== "-") {
    temp = is_square_in_range(shooting_sq, rows, cols);
    if (temp.error) {
      return temp;
    }
  }

  return wrap(true, null);
}

export function is_valid_fen(fen: string) {
  // TODO
  let temp = is_fen(fen);
  if (temp.error) return temp;

  let engine = new Engine(fen as FEN);
  let { shooting_sq, turn } = engine;
  if (shooting_sq) {
    let actual = LAYOUT_MAP[engine.get(shooting_sq)];

    if (actual !== turn)
      return wrap(
        false,
        `Shooting square '${shooting_sq}' does not point to player with current turn`
      );
  }

  return wrap(true, null, { engine });
}

export function is_move(m, rows: number, cols: number) {
  if (typeof m !== "object" || m.length < 1 || m.length > 3)
    return wrap(false, "move must be an array of 1 to 3 squares");

  for (let sq of m) {
    let ans = is_square_in_range(m, rows, cols);

    if (ans.error) {
      return wrap(false, ans.error);
    }
  }
  return wrap(true, null);
}
