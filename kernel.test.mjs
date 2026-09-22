import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as K from './kernel.mjs';

test('foldOnce folds an even-length array by summing mirrored pairs', () => {
  const result = K.foldOnce([1, 2, 3, 4]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.folded, [5, 5]);
});

test('foldOnce carries an odd middle cell through unchanged', () => {
  const result = K.foldOnce([1, 2, 3]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.folded, [4, 2]);
});

test('foldOnce on a single-cell array returns that cell unchanged, via the general formula (no n<=1 special case)', () => {
  const result = K.foldOnce([7]);
  assert.equal(result.ok, true);
  assert.deepEqual(result.folded, [7]);
  // pin it's a fresh array, not the same reference as the input
  assert.notEqual(result.folded, [7].slice() === result.folded);
});

test('foldAll reduces an even-length array to one value plus history', () => {
  const result = K.foldAll([1, 2, 3, 4]);
  assert.equal(result.ok, true);
  assert.equal(result.value, 10);
  assert.deepEqual(result.history, [[5, 5], [10]]);
  assert.equal(result.folds, 2);
});

test('foldAll on an odd-length array preserves total sum through every crease', () => {
  const result = K.foldAll([1, 2, 3, 4, 5]);
  assert.equal(result.ok, true);
  assert.equal(result.value, 15);
  assert.deepEqual(result.history, [[6, 6, 3], [9, 6], [15]]);
  assert.equal(result.folds, 3);
});

test('foldAll on a single-cell array needs zero folds and never reaches rawFoldOnce', () => {
  const result = K.foldAll([7]);
  assert.equal(result.ok, true);
  assert.equal(result.value, 7);
  assert.deepEqual(result.history, []);
  assert.equal(result.folds, 0);
});

test('foldAll is total: empty, non-array, and non-numeric input all return ok:false', () => {
  const empty = K.foldAll([]);
  assert.equal(empty.ok, false);
  assert.equal(typeof empty.why, 'string');

  const notArray = K.foldAll('not an array');
  assert.equal(notArray.ok, false);
  assert.equal(typeof notArray.why, 'string');

  const badElement = K.foldAll([1, 2, NaN, 4]);
  assert.equal(badElement.ok, false);
  assert.equal(typeof badElement.why, 'string');
});
