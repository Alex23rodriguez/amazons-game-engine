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
  /** h1 and a8 are light squares */
  LIGHT,
  /** a1 and h8 are dark squares */
  DARK,
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
