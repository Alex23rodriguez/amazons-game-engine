import { DEFAULT_POSITIONS } from "../consts";
import { Engine } from "../engine";

let e = new Engine(DEFAULT_POSITIONS[6]);

console.log("start!");
console.log(e.ascii());
let moves = e.moves();
while (moves.length) {
  let m = moves[Math.floor(Math.random() * moves.length)];
  console.log("\n", e.move_num, e.turn, "shooting: ", !!e.shooting_sq);
  e.move(m);
  moves = e.moves();
  console.log(e.ascii());
}
console.log(`${e.turn()} loses!`);
