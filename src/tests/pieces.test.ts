import { Size } from "../types";
import { is_pieces } from "../validation";
describe("Pieces object", () => {
  const size: Size = { cols: 10, rows: 10 };

  it("catches objects correctly", () => {
    expect(
      is_pieces(
        {
          x: 3,
          w: 5,
          b: 5,
        },
        size
      ).value
    ).toBe(false);

    expect(is_pieces({ x: [], w: [] }, size).value).toBe(false);

    expect(is_pieces({ x: [], w: [], b: [] }, size).value).toBe(true);
  });

  it("catches when things are not valid squares", () => {
    expect(is_pieces({ x: [], w: [], b: [3] }, size).value).toBe(false);

    expect(is_pieces({ x: [], w: [], b: ["a12"] }, size).value).toBe(false);

    expect(is_pieces({ x: [], w: [], b: ["m4"] }, size).value).toBe(false);

    expect(is_pieces({ x: [], w: [], b: ["c5"] }, size).value).toBe(true);
  });

  it("cannot have repeted squares", () => {
    expect(is_pieces({ x: ["a3", "a3"], w: [], b: [] }, size).value).toBe(
      false
    );

    expect(
      is_pieces({ x: ["a5"], w: ["b3"], b: ["b2", "a5"] }, size).value
    ).toBe(false);

    expect(
      is_pieces({ x: ["a5"], w: ["b3"], b: ["b2", "a6"] }, size).value
    ).toBe(true);
  });
});
