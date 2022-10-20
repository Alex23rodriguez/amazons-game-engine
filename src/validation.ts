import {
  DEFAULT_POSITIONS,
  LAYOUT_CHARS,
  LAYOUT_MAP,
  L_ARROW,
  MAX_SIZE,
  P_BLACK,
  P_WHITE,
  RANKS,
} from "./consts";
import { Engine } from "./engine";
import { Coords, FEN, Size, Validation } from "./types";

function wrap(value: any, error: string, byprod?: any): Validation {
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

export function is_valid_layout(layout: string) {
  let rows: string[] = layout.split("/");
  if (rows.length > 20) return wrap(false, "Board must have at most 20 rows");

  // check first row to get number of columns
  let temp = get_row_length(rows[0]);
  if (temp.error) {
    return wrap(false, `row#0 ${rows[0]}: ${temp.error}`);
  }
  let num_cols: number = temp.value;
  if (num_cols > 20) return wrap(false, "Board must have at most 20 columns");

  // check all other rows
  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    temp = get_row_length(row);
    if (temp.error) {
      return wrap(false, `row#${i} ${row}: ${temp.error}`);
    }
    if (num_cols !== temp.value)
      return wrap(
        false,
        `row#${i}:'${row}' should have ${num_cols} columns, but has ${temp.value}`
      );
  }
  return wrap(true, null, { rows: rows.length, cols: num_cols });
}

/**
 * Verify that the given string is a valid square, given a board size.
 * square must be in lowercase letters
 * @returns byprod row as a number (1 indexed) and col as number (index of RANKS)
 */
export function is_square(sq: string) {
  let col = RANKS.indexOf(sq[0]);
  if (col === -1) return wrap(false, `Invalid square name: ${sq}`);
  let row = Number(sq.substring(1));

  if (row < 1 || row > MAX_SIZE || row !== ~~row)
    return wrap(false, `Invalid square name: ${sq}`);

  return wrap(true, null, { row: row, col: col });
}

export function is_square_in_range(sq: string, { rows, cols }: Size) {
  let issq = is_square(sq);
  if (issq.error) return issq;

  let { col, row } = issq.byprod;
  if (col >= cols)
    return wrap(
      false,
      `Column must be at most '${
        RANKS[cols - 1]
      }' for given layout, instead got '${sq[0]}'`
    );
  if (row > rows)
    return wrap(
      false,
      `Row must be at most ${rows} for given layout, instead got ${row}`
    );
  return wrap(true, null, { row: rows - row, col });
}

export function is_coords_in_range({ row, col }: Coords, { rows, cols }: Size) {
  if (row < 0 || row >= rows || row !== ~~row)
    return wrap(
      false,
      `Row coord must be int between 0 and ${rows - 1}, instead got ${row}`
    );
  if (col < 0 || col >= cols || col !== ~~col)
    return wrap(
      false,
      `Column coord must be int between 0 and ${cols - 1}, instead got ${col}`
    );

  return wrap(true, null);
}

/**
 * Verify that the given string coincides with a char designating either player
 */
export function is_turn(p: string) {
  let ans = p === P_BLACK || p === P_WHITE;
  return ans
    ? wrap(true, null)
    : wrap(
        false,
        `Turn field invalid. Expected '${P_WHITE}' or '${P_BLACK}', instead got '${p}'`
      );
}
export const is_player = is_turn;

/**
 * Verify that the given parameter represents a positive int
 */
export function is_move_num(turn: number | string) {
  let n = Number(turn);
  let ans = n >= 1 && n === ~~n;
  return ans
    ? wrap(true, null)
    : wrap(false, `Turn field must be a positive int, instead got ${turn}`);
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
  let temp = is_turn(turn);
  if (temp.error) return temp;

  temp = is_move_num(move_num);
  if (temp.error) return temp;

  let dimensions = is_valid_layout(layout);
  if (dimensions.error) {
    return dimensions;
  }

  let size = dimensions.byprod;

  if (shooting_sq !== "-") {
    temp = is_square_in_range(shooting_sq, size);
    if (temp.error) {
      return temp;
    }
  }

  return wrap(true, null);
}

export function is_valid_fen(fen: string) {
  let temp = is_fen(fen);
  if (temp.error) return temp;

  let engine = new Engine(fen as FEN);
  let { shooting_sq } = engine;
  let turn = engine.turn();
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

export function is_move(m: string[], size: Size) {
  if (typeof m !== "object" || m.length < 1 || m.length > 3)
    return wrap(false, "move must be an array of 1 to 3 squares");

  for (let sq of m) {
    let ans = is_square_in_range(sq, size);

    if (ans.error) {
      return wrap(false, ans.error);
    }
  }
  return wrap(true, null);
}

export function is_default_size(n: number) {
  let fen = DEFAULT_POSITIONS[n];
  if (typeof fen === "undefined")
    return wrap(
      false,
      `size must be one of default sizes ${Object.keys(
        DEFAULT_POSITIONS
      )}. Instead got ${n}`
    );
  return wrap(true, null, { fen });
}

export function is_size(size: any) {
  const fail = wrap(
    false,
    "size must be an object with properties 'rows' and 'cols', integers between 1 and 20"
  );
  if (typeof size !== "object" || Object.keys(size).length !== 2) {
    return fail;
  }

  const { rows, cols } = size;

  if (
    typeof rows !== "number" ||
    typeof cols !== "number" ||
    rows < 1 ||
    rows > 20 ||
    cols < 1 ||
    cols > 20 ||
    rows !== ~~rows ||
    cols !== ~~cols
  )
    return fail;

  return wrap(true, null);
}

export function is_pieces(pieces: any, size: Size) {
  const fail = wrap(
    false,
    `pieces must be of type { ${P_WHITE}: Square[], ${P_BLACK}: Square[], ${L_ARROW}: Square[] } within the specified Size`
  );
  if (typeof pieces !== "object" || Object.keys(pieces).length !== 3) {
    return fail;
  }

  let lengths = 0;
  let squares = new Set();
  for (const key of [P_WHITE, P_BLACK, L_ARROW]) {
    const arr = pieces[key];
    if (
      !Array.isArray(arr) ||
      arr.some((sq) => !is_square_in_range(sq, size).value)
    )
      return fail;

    squares = new Set([...squares, ...arr]);
    lengths += arr.length;
  }
  if (squares.size !== lengths)
    return wrap(false, "squares in pieces object cannot be repeated");

  return wrap(true, null);
}

export function is_valid_gamestate(state: any) {
  const _wrap = (err: string) => wrap(false, "invalid GameState: " + err);

  if (typeof state !== "object") return _wrap("state must be an object");

  const size = state.size;
  let ans = is_size(size);
  if (!ans.value) return _wrap(ans.error);

  ans = is_pieces(state.pieces, size);
  if (!ans.value) return _wrap(ans.error);

  ans = is_turn(state.turn);
  if (!ans.value) return _wrap(ans.error);

  if (state.shooting_sq !== null) {
    ans = is_square_in_range(state.shooting_sq, size);
    if (!ans.value) return _wrap(ans.error);
    if (!state.pieces[state.turn].includes(state.shooting_sq))
      return _wrap("shooting square must point to shooting player's piece");
  }

  if (state.move_num) {
    ans = is_move_num(state.move_num);
    if (!ans.value) return _wrap(ans.error);
  }

  return wrap(true, null);
}
