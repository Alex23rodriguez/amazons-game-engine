import { Board } from "../board";
import { LAYOUT_MAP } from "../consts";
import { Piece, Square } from "../types";

type PiecesObj = {
  [Piece.WHITE]: Square[];
  [Piece.BLACK]: Square[];
  [Piece.ARROW]: Square[];
};

const b = Board.from_size(5, 3);
console.log(b.ascii());

const b2 = new Board({
  size: { rows: 5, cols: 3 },
  pieces: {
    [LAYOUT_MAP["w"]]: ["a1"],
    [LAYOUT_MAP["b"]]: ["b2"],
    [LAYOUT_MAP["x"]]: ["b3", "c4"],
  } as PiecesObj,
});

console.log(b2.ascii());
