import { Board } from "./board";
import { DEFAULT_POSITIONS, RANKS } from "./consts";
import { Piece } from "./types";

function ascii(board: any[][], flip = false) {
  let map = {
    [Piece.EMPTY]: ".",
    [Piece.WHITE]: "W",
    [Piece.BLACK]: "B",
    [Piece.ARROW]: "x",
  };

  if (flip) return _ascii_flipped(board, map);

  let lines: string[] = [];

  let rows = board.length;
  let cols = board[0].length;

  let horizontal_border = `   +${"-".repeat(cols * 3)}+`;
  lines.push(horizontal_border);

  for (let row of board) {
    let str = row.join("  ");
    for (let k in map) {
      str = str.replaceAll(k, map[k]);
    }
    lines.push(`${rows >= 10 ? "" : " "}${rows--} | ${str} |`);
  }

  lines.push(horizontal_border);
  lines.push(`     ${Array.from(RANKS.substring(0, cols)).join("  ")}`);

  return lines.join("\n");
}

function _ascii_flipped(board, map) {
  let lines: string[] = [];

  let cols = board[0].length;
  let rows = board.length;

  let horizontal_border = `   +${"-".repeat(cols * 3)}+`;
  lines.push(horizontal_border);

  for (let r = 1; r <= rows; r++) {
    let row = board[rows - r];
    let str = row.reverse().join("  ");
    for (let k in map) {
      str = str.replaceAll(k, map[k]);
    }
    lines.push(`${r >= 10 ? "" : " "}${r} | ${str} |`);
  }

  lines.push(horizontal_border);
  lines.push(
    `     ${Array.from(RANKS.substring(0, cols)).reverse().join("  ")}`
  );

  return lines.join("\n");
}

// MAIN

let fen = DEFAULT_POSITIONS[10];
let layout = fen.split(/\s+/)[0];
let board = new Board(layout);

console.log(ascii(board.copy()));

let board2 = new Board("wbxx3/2xwb2/6x");
console.log(ascii(board2.copy(), true));
