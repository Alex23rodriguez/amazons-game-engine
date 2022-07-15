import { LAYOUT_CHARS, MAX_SIZE, P_BLACK, P_WHITE, RANKS } from "./consts";
import { FEN } from "./types";

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
  return wrap({ rows: rows.length, num_cols }, null);
}

/**
 * Verify that the given string is a valid square, given a board size.
 * square must be in lowercase letters
 * @returns byprod row and col which can be used to index board
 */
export function is_square(sq: string) {
  let col = RANKS.indexOf(sq[0]);
  if (col === -1) return wrap(false, `Invalid column: '${sq[0]}'`);
  let row = Number(sq.substring(1));

  if (row < 1 || row > MAX_SIZE || row !== ~~row)
    return wrap(
      false,
      `Rows must be int between 1 and ${MAX_SIZE}, instead got '${row}'`
    );

  return wrap(true, null, { row: row - 1, col: col });
}

export function is_square_in_range(sq: string, rows: number, cols: number) {
  let issq = is_square(sq);
  if (issq.error) return issq;

  if (issq.byprod.col > cols)
    return wrap(
      false,
      `Column must be at most ${cols}, instead got ${issq.byprod.col}`
    );
  let row = issq.byprod.row;
  let ans = row >= 1 && row <= rows;
  if (ans) return wrap(true, null);
  return wrap(false, "TODO");
}

/**
 * Verify that the given string coincides with a char designating either player
 */
export function is_player(p: string) {
  let ans = p === P_BLACK || p === P_WHITE;
  return ans ? wrap(true, null) : wrap(false, "Player field invalid");
}

/**
 * Verify that the given parameter represents a positive int
 */
export function is_turn(turn: number | string) {
  let n = Number(turn);
  let ans = n >= 1 && n === ~~n;
  return ans ? wrap(true, null) : wrap(false, "Turn must be a positive int");
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
  const [layout, moving, shooting, turn] = fields;

  // start fen validation
  if (!is_player(moving))
    return wrap(false, `Invalid moving player: ${moving}`);

  if (!is_turn(turn)) return wrap(false, `Invalid turn number: ${turn}`);

  let dimensions = get_layout_shape(layout);
  if (dimensions.error) {
    return wrap(false, `Invalid layout: ${dimensions.error}`);
  }

  let { rows, cols } = dimensions.byprod;

  if (shooting !== "-") {
    if (!is_square_in_range(shooting, rows, cols)) {
      return wrap(false, `Invalid shooting square: ${shooting}`);
    }
  }

  return wrap(true, null);
}

export function is_valid_fen(fen: string) {
  // TODO
  return wrap(true, null, { rows: 1, cols: 1 });
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
