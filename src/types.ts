// arbitrarily chose max size of 20
// prettier-ignore
export type Column = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'
// prettier-ignore
export type Row = '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'12'|'13'|'14'|'15'|'16'|'17'|'18'|'19'|'20';

export type Square = `${Column}${Row}`;
export type Player = "w" | "b";
export type FEN = `${string} ${Player} ${Square | "-"} ${number}`;
export type Move = Square[]; //`${Square}-${Square}-${Square}`;

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

export type State = {
  board: Piece[][];
  moving: Player;
  shooting: Square | null;
  turn: number;
};
