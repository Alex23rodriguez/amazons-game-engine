import { FEN, Square } from "./types";

const COLS = "abcdefghijklmnopqrst";

const VALID_CHARS = "wbx0123456789";

const COLS_TO_NUM = {};
const NUM_TO_COLS = {};

for (let i = 0; i < COLS.length; i++) {
  COLS_TO_NUM[COLS[i]] = i;
  NUM_TO_COLS[i] = COLS[i];
}

const MAP_COLOR_SQUARE: { [key: string]: Square } = {
  w: Square.WHITE,
  b: Square.BLACK,
  x: Square.ARROW,
  e: Square.EMPTY,
};

const DEFAULT_POSITIONS: { [key: number]: FEN } = {
  6: "3b2/6/b5/5w/6/2w3 w - 1",
  8: "3b4/8/b6b/8/8/w6w/8/4w3 w - 1",
  10: "3b2b3/10/10/b8b/10/10/w8w/10/10/3w2w3 w - 1",
};

export {
  COLS,
  COLS_TO_NUM,
  Square,
  VALID_CHARS,
  MAP_COLOR_SQUARE,
  DEFAULT_POSITIONS,
};
