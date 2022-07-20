import { Square } from "../types";
import { to_coords } from "../util";

let sizes = [
  [2, 2],
  [3, 3],
  [4, 4],
];
let sqs = ["a1", "a2", "b1", "b2"];

for (let sq of sqs) {
  for (let [rows, cols] of sizes) {
    console.log(rows, cols, sq, to_coords(sq as Square, rows, cols));
  }
}

to_coords("a3", 2, 2);
