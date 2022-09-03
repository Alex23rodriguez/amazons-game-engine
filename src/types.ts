export type Square = `${string}${number}`;
export type Player = "w" | "b";
export type FEN = `${string} ${Player} ${Square | "-"} ${number}`;
export type Move = [Square, Square?, Square?];
export type Coords = { row: number; col: number };
export type Size = { rows: number; cols: number };

export type Validation = {
  value: any;
  error: string;
  byprod?: any;
};

export const enum SqColor {
  /** a1 and h8 are dark squares */
  DARK,
  /** h1 and a8 are light squares */
  LIGHT,
}

export const enum Piece {
  /** Spot is valid for moving to. */
  EMPTY,
  /** A white piece occupys this spot. */
  WHITE,
  /** A black piece occupys this spot. */
  BLACK,
  /** Spot was destroyed by an arrow. */
  ARROW,
}

export type BoardPiecesObj = {
  [Piece.WHITE]: Square[];
  [Piece.BLACK]: Square[];
  [Piece.ARROW]: Square[];
};

export type PiecesObj = {
  w: Square[];
  b: Square[];
  x: Square[];
};

export interface GameState {
  size: Size;
  pieces: PiecesObj;
  shooting_sq: Square | null;
  turn: Player;
  move_num?: number;
}
