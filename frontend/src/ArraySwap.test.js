import arraySwap from './ArraySwap.js'

test('throws on index too small', () => {
  var testArray = [1, 2, 3]
  expect(() => {
    arraySwap(testArray, -1, -1)
  }).toThrow()
  expect(() => {
    arraySwap(testArray, -1, 1)
  }).toThrow()
  expect(() => {
    arraySwap(testArray, 1, -1)
  }).toThrow()
})

test('throws on index too large', () => {
  var testArray = [1, 2, 3]
  expect(() => {
    arraySwap(testArray, 3, 3)
  }).toThrow()
  expect(() => {
    arraySwap(testArray, 3, 4)
  }).toThrow()
  expect(() => {
    arraySwap(testArray, 2, 3)
  }).toThrow()
  expect(() => {
    arraySwap(testArray, 3, 2)
  }).toThrow()
})

test('swap same location has no effect', () => {
  var testArray = [1, 2, 3]
  var result = arraySwap(testArray, 1, 1)
  expect(result).toEqual(testArray)
})

test('swap is as expected', () => {
  var testArray = [1, 2, 3, 4]
  var result = arraySwap(testArray, 1, 2)
  expect(result).toEqual([1,3,2,4])
})

test('swap at startIndex is as expected', () => {
  var testArray = [1, 2, 3, 4]
  var result = arraySwap(testArray, 0, 1)
  expect(result).toEqual([2,1,3,4])
})

test('swap at endIndex is as expected', () => {
  var testArray = [1, 2, 3, 4]
  var result = arraySwap(testArray, 2, 3)
  expect(result).toEqual([1,2,4,3])
})

test('swap at extreme ends is as expected', () => {
  var testArray = [1, 2, 3, 4]
  var result = arraySwap(testArray, 0, 3)
  expect(result).toEqual([4,2,3,1])
})
