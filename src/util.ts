import { RANKS } from "./consts";
import { Coords, Square, Validation } from "./types";
import { is_square_in_range, is_coords_in_range } from "./validation";

export function assert(condition: Validation) {
  if (condition.error) throw new Error(condition.error);
  return condition.byprod;
}

// TODO, add flipped version
export function square_to_coords(
  sq: Square,
  rows: number,
  cols: number
): Coords {
  let coords = assert(is_square_in_range(sq, rows, cols));
  return coords;
}

export function coords_to_square(coords: Coords, rows: number, cols) {
  assert(is_coords_in_range(coords.row, coords.col, rows, cols));
  let sq: Square = `${RANKS[coords.col]}${rows - coords.row}` as Square;
  return sq;
}
