import {getFormattedAddress} from './ManagerAdapter.js';

test('adds http:// to standard string', () => {
  var testInput = 'test'
  var result = getFormattedAddress(testInput);
  expect(result).toEqual('http://test');
});

test('replaces https://  with http://', () => {
  var testInput = 'https://test'
  var result = getFormattedAddress(testInput);
  expect(result).toEqual('http://test');
});

test('does not affect correctly formatted string', () => {
  var testInput = 'http://test'
  var result = getFormattedAddress(testInput);
  expect(result).toEqual('http://test');
});
