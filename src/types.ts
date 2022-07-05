export const enum Square {
  /** Spot is valid for moving to. */
  EMPTY,
  /** A black piece occupys this spot. */
  BLACK,
  /** A white piece occupys this spot. */
  WHITE,
  /** Spot was destroyed by a missile. */
  DESTROYED,
}

export const enum PosColor {
  LIGHT,
  DARK,
}

export type Color = Square.BLACK | Square.WHITE;
export type Board = Square[][];
export type Comment = string;
export type FEN = string;
export type Header = Map<string, string>;
export type Move =
  | string
  | {
      from: Position;
      to: Position;
      arrow: Position;
    };
export type PGN = string[];
export type Position = string;

export type Amazons = {
  ascii: () => string;
  board: () => Board;
  clear: () => null;
  delete_comment: () => Comment;
  delete_comments: () => {
    fen: FEN;
    comment: Comment;
  }[];
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
  move: (mv: Move) => null;
  moves: () => Position[];
  pgn: () => PGN;
  put: (piece: Square, pos: Position) => boolean;
  remove: (pos: Position) => Square;
  reset: () => null;
  set_comment: (comment: string) => null;
  position_color: (pos: Position) => PosColor;
  turn: () => Color;
  undo: () => Move;
  validate_fen: (fen: FEN) => boolean;
};
