import { FEN, Piece } from "./types";

export const MAX_SIZE = 20; // don't exede 26
export const RANKS = "abcdefghijklmnopqrstuvwxyz".substring(0, MAX_SIZE); // 20 goes up to 't'

export const P_BLACK = "b";
export const P_WHITE = "w";
export const P_ARROW = "x"; // this one is not a player, but used in layout
export const P_EMPTY = "o"; // this one is not a player, but may be used in layout in the future
export const LAYOUT_CHARS = P_BLACK + P_WHITE + P_ARROW + "0123456789";

export const LAYOUT_MAP = {
  [P_WHITE]: Piece.WHITE,
  [P_BLACK]: Piece.BLACK,
  [P_ARROW]: Piece.ARROW,
  [P_EMPTY]: Piece.EMPTY,
  [Piece.WHITE]: P_WHITE,
  [Piece.BLACK]: P_BLACK,
  [Piece.ARROW]: P_ARROW,
  [Piece.EMPTY]: P_EMPTY,
};

export const DEFAULT_POSITIONS: { [key: number]: FEN } = {
  6: "3b2/6/b5/5w/6/2w3 w - 1",
  8: "3b4/8/b6b/8/8/w6w/8/4w3 w - 1",
  10: "3b2b3/10/10/b8b/10/10/w8w/10/10/3w2w3 w - 1",
};
