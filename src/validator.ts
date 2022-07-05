class Validator {
  readonly sizeX: number;
  readonly sizeY?: number;

  private _max_col: string;

  constructor(sizeX: number, sizeY?: number) {
    this.sizeX = sizeX;
    if (typeof sizeY === "undefined") this.sizeY = sizeX;

    if (sizeX > 26 || sizeX < 1 || sizeY > 26 || sizeY < 1)
      throw new Error("Maximum board size is 26x26");

    this._max_col = String.fromCharCode(96 + sizeX);
  }

  is_position(pos: string) {
    // check column
    if (pos[0] < "a" || pos[0] > this._max_col) return false;
    let row = Number(pos.substring(1));
    return row >= 1 && row <= this.sizeX;
  }

  is_move(move: string) {
    const parts = move.split("-");
    return parts.every(this.is_position);
  }

  is_player(p: string) {
    return p === "w" || p === "b";
  }

  is_board_fen(board: string) {
    const rows = board.split("/");
    if (rows.length != this.sizeY) return false;
    for (let row of rows) {
      if (this._check_row(row) != this.sizeX) return false;
    }
    return true;
  }

  is_turn(turn: number | string) {
    let n = Number(turn);
    return n >= 1 && n === ~~n;
  }
  private _check_row(row: string) {
    let count = 0;
    let sub = "";
    for (let char of row) {
      if (!"wbx0123456789".includes(char)) return 0; // invalid row
      let n = Number(char);
      if (Number.isNaN(n)) {
        count++;
        if (sub) {
          count += Number(sub);
          sub = "";
        }
      } else {
        sub += char;
      }
    }
    count += Number(sub);
    return count;
  }
}

export default Validator;
