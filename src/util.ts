import { VALID_CHARS } from "./consts";

/**
 * Utility function to **optionally** wrap a result in an error object.
 * @param wrap if false, will return value as is, if true, will return it wrapped in obj detailing error (error may be null)
 * @param value result of a calculation
 * @param msg null if nothing went wrong, otherwise a string detailing failure
 */
export function maybe_verbose(
  should_wrap: boolean,
  value: any,
  msg: string | null
) {
  if (should_wrap) return { value, error: msg };

  return value;
}

export function get_layout_shape(layout: string, verbose = false) {
  let bad_layout = [null, null];
  let rows: string[] = layout.split("/");
  if (rows.length > 20)
    return maybe_verbose(
      verbose,
      bad_layout,
      "Board must have at most 20 rows"
    );

  // check first row to get number of columns
  let temp = get_row_length(rows[0], true);
  if (temp.error) {
    return maybe_verbose(
      verbose,
      bad_layout,
      `row#0 ${rows[0]}: ${temp.error}`
    );
  }
  let num_cols: number = temp.value;
  if (num_cols > 20)
    return maybe_verbose(
      verbose,
      bad_layout,
      "Board must have at most 20 columns"
    );

  // check all other rows
  for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    temp = get_row_length(row, true);
    if (temp.error) {
      return maybe_verbose(
        verbose,
        bad_layout,
        `row#${i} ${row}: ${temp.error}`
      );
    }
    if (num_cols !== temp.value)
      return maybe_verbose(
        verbose,
        bad_layout,
        `row#${i} ${row} should have ${num_cols} columns, but has ${temp.value}`
      );
  }
  return maybe_verbose(verbose, { rows: rows.length, num_cols }, null);
}

function get_row_length(row: string, verbose = false) {
  if (row === "") {
    return maybe_verbose(verbose, null, "Row cannot be empty string");
  }
  let count = 0;
  let sub = "";
  for (let char of row) {
    if (!VALID_CHARS.includes(char))
      return maybe_verbose(
        verbose,
        null,
        `Row contains invalid char: '${char}'`
      ); // invalid row
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
  return maybe_verbose(verbose, count, null);
}
