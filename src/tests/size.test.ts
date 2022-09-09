import { is_size } from "../validation";

describe("Size object", () => {
  it("is an object", () => {
    expect(is_size(["hi", "sup"]).value).toBe(false);

    expect(is_size(123).value).toBe(false);
  });

  it("must be an int", () => {
    expect(is_size({ rows: 1.3, cols: 5 }).value).toBe(false);
    expect(is_size({ rows: -1, cols: 5 }).value).toBe(false);
  });

  it("accepts correct sizes", () => {
    expect(is_size({ rows: 1, cols: 5 }).value).toBe(true);
  });
});
