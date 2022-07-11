// arbitrarily chose max 20 columns
// prettier-ignore
export type Column = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'
// prettier-ignore
export type Row = '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'12'|'13'|'14'|'15'|'16'|'17'|'18'|'19'|'20';
export type Square = `${Column}${Row}`;
export type Player = "w" | "b";
export type FEN = `${string} ${Player} ${Square | "-"} ${number}`;
export type Move = string; //`${Square}-${Square}-${Square}`;
export type HalfMove = string;

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

export type Board = Piece[][];

export type State = {
  board: Board;
  moving: Player;
  shooting: Square | null;
  turn: number;
};

/* export interface Amazons {
  ascii: () => string;
  board: () => Board;
  clear: () => void;
  delete_comment: () => Comment;
  delete_comments: () => {
    fen: FEN;
    comment: Comment;
  }[];
  // similar to a chess fen, adapted to the game of the amazons
  fen: () => FEN;
  game_over: () => boolean;
  get: (pos: Position) => Square;
  get_comment: () => Comment;
  get_comments: () => {
    fen: FEN;
    comment: Comment;
  }[];
  header: (...key_value_pairs: string[]) => Header;
  history: () => Move[];
  in_endgame: () => boolean;
  load: (fen: FEN) => boolean;
  load_png: (pgn: PGN) => boolean;
  move: (mv: Move) => void;
  moves: () => Position[];
  pgn: () => PGN;
  put: (piece: Square, pos: Position) => boolean;
  remove: (pos: Position) => Square;
  reset: () => void;
  set_comment: (comment: string) => void;
  position_color: (pos: Position) => PosColor;
  turn: () => number;
  undo: () => Move;
  validate_fen: (fen: FEN) => boolean;
} */
