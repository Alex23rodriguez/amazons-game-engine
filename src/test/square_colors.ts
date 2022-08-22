import { Amazons } from "../amazons";
import { DEFAULT_POSITIONS } from "../consts";
import { SqColor } from "../types";
import { assert } from "../util";

console.log("dark", SqColor.DARK);
console.log("light", SqColor.LIGHT);
let amz = Amazons(6);
for (let size of [6, 8, 10]) {
  amz = Amazons(size);
  console.log("a1", amz.square_color("a1"));
  console.log("a2", amz.square_color("a2"));
  console.log("b1", amz.square_color("b1"));
  console.log(amz.max_square());
}

amz = Amazons("1 w - 1");
console.log(amz.square_color("a1"));
console.log(amz.max_square());
amz = Amazons("1/1/1/1/1 w - 1");
console.log(amz.square_color("a1"));
console.log(amz.max_square());
amz = Amazons("7 w - 1");
console.log(amz.square_color("a1"));
console.log(amz.max_square());
