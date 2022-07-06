import { Square, PosColor } from "./consts";

// arbitrarily chose max 20 columns
// prettier-ignore
export type Column = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'
// prettier-ignore
export type Row = '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'12'|'13'|'14'|'15'|'16'|'17'|'18'|'19'|'20';
export type Position = `${Column}${Row}`;

export type Comment = string;
export type Player = "w" | "b";
export type FEN = `${string} ${Player} ${Position | "-"} ${number}`;
export type Header = { [header: string]: string };
export type Move = string;
export type PGN = string[];

export interface Board {
  rows: number;
  cols: number;
  board: Square[][];
  get: (pos: Position) => Square;
  get_index: (pos: Position) => [number, number];
  move: (move: Move) => void;
  undo: (move: Move) => void;
}

export type ErrorObj = {
  error: string;
};

export interface Game {
  layout: string;
  moving: Player;
  shooting: Position;
  turn: number;
  board: Board;
}

export interface Amazons {
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
}
