import { Square } from "../types";
import { square_to_coords, coords_to_square } from "../util";
import { is_square_in_range } from "../validation";

let sizes = [
  [2, 2],
  [3, 3],
  [4, 4],
];
let sqs = ["a1", "a2", "b1", "b2"];

for (let sq of sqs) {
  for (let [rows, cols] of sizes) {
    console.log(rows, cols, sq, square_to_coords(sq as Square, rows, cols));
  }
}

console.log(coords_to_square(0, 0, 1, 1));
console.log(coords_to_square(0, 0, 1, 2));
console.log(coords_to_square(0, 0, 2, 1));
console.log(coords_to_square(0, 0, 3, 3));

console.log(coords_to_square(0, 2, 2, 3));
console.log(coords_to_square(1, 2, 2, 3));
