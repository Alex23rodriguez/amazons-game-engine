import { Amazons } from "../amazons";
import { DEFAULT_POSITIONS } from "../consts";

let amz = new Amazons(DEFAULT_POSITIONS[10]);

while (!amz.game_over()) {
  console.log(amz.ascii());
  console.log(amz.state());
  amz.random_move();
  amz = new Amazons(amz.state());
}
