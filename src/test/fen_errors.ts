import { Amazons } from "../amazons";
import { DEFAULT_POSITIONS } from "../consts";

let layout = DEFAULT_POSITIONS[8].split(" ")[0];
let bad_fen = {
  wrong_size: 7,
  wrong_type: {},
  wrong_num_fields: "the cake is a lie",
  wrong_player_field: `${layout} x - 1`,
  turn_zero: `${layout} w - 0`,
  turn_negative: `${layout} w - -1`,
  turn_float: `${layout} w - 1.13`,
  shooting_invalid: `${layout} w nope 3`,
  shooting_invalid_2: `${layout} w a9 4`,
  shooting_invalid_3: `${layout} w a0 4`,
  shooting_invalid_4: `${layout} w i3 4`,
  shooting_empty: `${layout} w a1 6`,
  shooting_wrong_player: `${layout} w d8 8`,
  good: `${layout} w - 5`,
  good2: `${layout} w h3 5`,
};

for (let k in bad_fen) {
  try {
    let a = Amazons(bad_fen[k]);
    console.log(k, ": no error");
  } catch (e) {
    console.log(k, ":", e.message);
  }
}
