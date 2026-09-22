// RippleFold — a pure kernel that folds a numeric array in half repeatedly,
// summing overlapping cells at each crease until one value remains.
//
// Fold rule (one crease):
//   - even length n:  out[i] = arr[i] + arr[n-1-i]   for i in [0, n/2)
//   - odd length n:   same pairing for i in [0, floor(n/2)), and the exact
//                     middle cell survives unchanged, carried to the end
//                     of the folded array (it has nothing to overlap with).
//
// This preserves the total sum of the array at every crease: every input
// cell contributes exactly once to the output, either summed into a pair
// or passed through untouched. So the final single value always equals
// the sum of the original array — folding is lossy in *shape*, not in
// *mass*.
//
// No I/O. No throwing. Bad input returns {ok:false, why:...}.

function isFiniteNumber(x) {
  return typeof x === 'number' && Number.isFinite(x);
}

function validateNumericArray(arr) {
  if (!Array.isArray(arr)) return 'input is not an array';
  if (arr.length === 0) return 'array is empty';
  for (let i = 0; i < arr.length; i++) {
    if (!isFiniteNumber(arr[i])) {
      return `element at index ${i} is not a finite number`;
    }
  }
  return null;
}

// Assumes arr is already validated and non-empty (n >= 1).
//
// NOTE: there is deliberately no n<=1 fast-path here. For n === 1 the
// general formula already produces the right answer on its own: half =
// floor(1/2) = 0, so the pairing loop contributes nothing, and the odd
// branch (n % 2 === 1) sets out[0] = arr[0] — identical to arr.slice().
// A special case would be equivalent-but-unverifiable code: n === 0 can
// never reach here (validateNumericArray rejects empty arrays before
// foldOnce/foldAll call in, and foldAll's `while (current.length > 1)`
// guard means rawFoldOnce is never invoked once current is down to a
// single cell), and n === 1 needs no help. Keeping the guard would leave
// a line no test could ever legitimately kill.
function rawFoldOnce(arr) {
  const n = arr.length;
  const half = Math.floor(n / 2);
  const outLen = Math.ceil(n / 2);
  const out = new Array(outLen);
  for (let i = 0; i < half; i++) {
    out[i] = arr[i] + arr[n - 1 - i];
  }
  if (n % 2 === 1) {
    out[half] = arr[half];
  }
  return out;
}

// Performs exactly one crease. Total: validates before touching the array.
export function foldOnce(arr) {
  const why = validateNumericArray(arr);
  if (why) return { ok: false, why };
  return { ok: true, folded: rawFoldOnce(arr) };
}

// Folds an array all the way down to one value, recording the array state
// after each crease. Total: validates before folding.
export function foldAll(arr) {
  const why = validateNumericArray(arr);
  if (why) return { ok: false, why };

  let current = arr.slice();
  const history = [];
  while (current.length > 1) {
    current = rawFoldOnce(current);
    history.push(current.slice());
  }
  return { ok: true, value: current[0], history, folds: history.length };
}
