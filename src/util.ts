import { RANKS } from "./consts";
import { Square, Validation } from "./types";
import { is_square_in_range } from "./validation";

export function assert(condition: Validation) {
  if (condition.error) throw new Error(condition.error);
  return condition.byprod;
}

export function to_coords(sq: Square, rows: number, cols: number) {
  let { row, col } = assert(is_square_in_range(sq, rows, cols));
  return [row, col];
}

export function from_coords(row: number, col: number, rows: number) {
  let sq: Square = `${RANKS[col]}${rows - row}` as Square;
  return sq;
}
