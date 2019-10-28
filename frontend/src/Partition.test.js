import partition from './Partition.js';

test('partition empty array gives two empty arrays', () => {
  var testArray = [];
  var result = partition(testArray, (i => i === 1));
  expect(result.pass).toEqual([]);
  expect(result.fail).toEqual([]);
});

test('true predicate fills pass', () => {
  var testArray = [1, 2, 3];
  var result = partition(testArray, (i => true));
  expect(result.pass).toEqual([1, 2, 3]);
});

test('true predicate leaves fail empty', () => {
  var testArray = [1, 2, 3];
  var result = partition(testArray, (i => true));
  expect(result.fail).toEqual([]);
});

test('false predicate fills fail', () => {
  var testArray = [1, 2, 3];
  var result = partition(testArray, (i => false));
  expect(result.fail).toEqual([1, 2, 3]);
});

test('false predicate leaves pass empty', () => {
  var testArray = [1, 2, 3];
  var result = partition(testArray, (i => false));
  expect(result.pass).toEqual([]);
});

test('partition works', () => {
  var testArray = [1, 2, 3];
  var result = partition(testArray, (i => i > 1));
  expect(result.pass).toEqual([2,3]);
  expect(result.fail).toEqual([1]);
});

test('partition has no side effects', () => {
  var testArray = [1, 2, 3];
  var result = partition(testArray, (i => i === 1));
  expect(testArray).toEqual([1,2,3]);
});
