import { RANKS } from "./consts";
import { Coords, Size, Square, Validation } from "./types";
import { is_square_in_range, is_coords_in_range } from "./validation";

export function assert(condition: Validation) {
  if (condition.error) throw new Error(condition.error);
  return condition.byprod;
}

// TODO, add flipped version
export function square_to_coords(sq: Square, size: Size): Coords {
  let coords = assert(is_square_in_range(sq, size));
  return coords;
}

export function coords_to_square(coords: Coords, size: Size) {
  assert(is_coords_in_range(coords, size));
  let sq: Square = `${RANKS[coords.col]}${size.rows - coords.row}` as Square;
  return sq;
}
