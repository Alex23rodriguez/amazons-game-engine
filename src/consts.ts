import { FEN, Piece } from "./types";

export const MAX_SIZE = 20;
export const COLS = "abcdefghijklmnopqrst";

export const VALID_CHARS = "wbx0123456789";
export const BLACK = "wbx0123456789";
export const WHITE = "wbx0123456789";

export const [COLS_TO_NUM, NUM_TO_COLS] = (() => {
  let ctn = {};
  let ntc = {};
  for (let i = 0; i < COLS.length; i++) {
    ctn[COLS[i]] = i;
    ntc[i] = COLS[i];
  }
  return [ctn, ntc];
})();

export const MAP_COLOR_SQUARE: { [key: string]: Piece } = {
  w: Piece.WHITE,
  b: Piece.BLACK,
  x: Piece.ARROW,
  e: Piece.EMPTY,
};

export const DEFAULT_POSITIONS: { [key: number]: FEN } = {
  6: "3b2/6/b5/5w/6/2w3 w - 1",
  8: "3b4/8/b6b/8/8/w6w/8/4w3 w - 1",
  10: "3b2b3/10/10/b8b/10/10/w8w/10/10/3w2w3 w - 1",
};
