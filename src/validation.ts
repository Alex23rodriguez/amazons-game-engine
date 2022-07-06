export function is_position(pos: string, rows: number, cols: number) {
  // check column
  let max_col = String.fromCharCode(96 + cols);
  if (pos[0] < "a" || pos[0] > max_col) return false;
  // check row
  let row = Number(pos.substring(1));
  return row >= 1 && row <= rows;
}

export function is_move(move: string, rows: number, cols: number) {
  const parts = move.split("-");
  return parts.every((x) => is_position(x, rows, cols));
}

export function is_player(p: string) {
  return p === "w" || p === "b";
}

export function is_turn(turn: number | string) {
  let n = Number(turn);
  return n >= 1 && n === ~~n;
}
