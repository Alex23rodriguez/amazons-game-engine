import { RANKS } from "./consts";
import { Square, Validation } from "./types";
import { is_square_in_range, is_coords_in_range } from "./validation";

export function assert(condition: Validation) {
  if (condition.error) throw new Error(condition.error);
  return condition.byprod;
}

export function square_to_coords(sq: Square, rows: number, cols: number) {
  let { row, col } = assert(is_square_in_range(sq, rows, cols));
  return [row, col];
}

export function coords_to_square(row: number, col: number, rows: number, cols) {
  assert(is_coords_in_range(row, col, rows, cols));
  let sq: Square = `${RANKS[col]}${rows - row}` as Square;
  return sq;
}
