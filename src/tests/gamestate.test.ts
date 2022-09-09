import { L_ARROW, P_BLACK, P_WHITE } from "../consts";
import { is_valid_gamestate } from "../validation";

describe("Game state", () => {
  const pre = "invalid GameState: ";

  const size = { cols: 10, rows: 8 };
  const pieces = { w: ["a1"], b: ["b3"], x: ["c5"] };
  const turn = "b";
  const shooting_sq = "b3";
  const move_num = 5;

  it("validates correct game states", () => {
    expect(is_valid_gamestate({ size, pieces, turn, shooting_sq }).value).toBe(
      true
    );
    expect(
      is_valid_gamestate({ size, pieces, turn, shooting_sq, move_num }).value
    ).toBe(true);
  });

  it("is an object", () => {
    expect(is_valid_gamestate(123).error).toBe(pre + "state must be an object");
    expect(is_valid_gamestate("hi").error).toBe(
      pre + "state must be an object"
    );
  });

  it("checks size correctly", () => {
    expect(
      is_valid_gamestate({ size: 234, pieces, turn, shooting_sq }).value
    ).toBe(false);
  });

  it("checks pieces correctly", () => {
    expect(
      is_valid_gamestate({
        size,
        pieces: { w: ["a1"], b: ["a2", 5], x: [] },
        turn,
        shooting_sq,
      }).error
    ).toBe(
      pre +
        `pieces must be of type { ${P_WHITE}: Square[], ${P_BLACK}: Square[], ${L_ARROW}: Square[] } within the specified Size`
    );

    expect(
      is_valid_gamestate({
        size,
        pieces: { w: ["a1"], b: ["a2", "b3"], x: ["c2", "b3"] },
        turn,
        shooting_sq,
      }).error
    ).toBe(pre + "squares in pieces object cannot be repeated");
  });

  it("checks turn correctly", () => {
    expect(
      is_valid_gamestate({ size, pieces, turn: 5, shooting_sq }).value
    ).toBe(false);
    expect(
      is_valid_gamestate({ size, pieces, turn: "x", shooting_sq }).value
    ).toBe(false);
    expect(
      is_valid_gamestate({ size, pieces, turn: ["w"], shooting_sq }).value
    ).toBe(false);
  });

  it("checks shooting_sq correctly", () => {
    expect(
      is_valid_gamestate({ size, pieces, turn, shooting_sq: null }).value
    ).toBe(true);

    expect(
      is_valid_gamestate({ size, pieces, turn, shooting_sq: "a2" }).error
    ).toBe(pre + "shooting square must point to shooting player's piece");

    expect(
      is_valid_gamestate({ size, pieces, turn, shooting_sq: "a1" }).error
    ).toBe(pre + "shooting square must point to shooting player's piece");
  });

  it("checks move num", () => {
    expect(
      is_valid_gamestate({ size, pieces, turn, shooting_sq, move_num: -1 })
        .value
    ).toBe(false);
    expect(
      is_valid_gamestate({ size, pieces, turn, shooting_sq, move_num: 1.5 })
        .value
    ).toBe(false);
  });
});
