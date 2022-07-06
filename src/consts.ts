const COLS = "abcdefghijklmnopqrst";

const VALID_CHARS = "wbx0123456789";

const COLS_TO_NUM = {};
const NUM_TO_COLS = {};

for (let i = 0; i < COLS.length; i++) {
  COLS_TO_NUM[COLS[i]] = i;
  NUM_TO_COLS[i] = COLS[i];
}

const enum Square {
  /** Spot is valid for moving to. */
  EMPTY,
  /** A white piece occupys this spot. */
  WHITE,
  /** A black piece occupys this spot. */
  BLACK,
  /** Spot was destroyed by an arrow. */
  ARROW,
}

const MAP_COLOR_SQUARE: { [key: string]: Square } = {
  w: Square.WHITE,
  b: Square.BLACK,
  x: Square.ARROW,
  e: Square.EMPTY,
};

const enum PosColor {
  /** h1 and a8 are light squares */
  LIGHT,
  /** a1 and h8 are dark squares */
  DARK,
}

export { COLS, COLS_TO_NUM, Square, VALID_CHARS, MAP_COLOR_SQUARE, PosColor };
