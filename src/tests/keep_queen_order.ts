import { Amazons } from "../amazons";

let amz = new Amazons(10);

while (!amz.game_over()) {
  console.log(amz.pieces());

  let mv = amz.random_move();
  console.log(mv);
}
