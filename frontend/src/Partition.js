export var partition = function (arr, predicate) {
  var pass = [];
  var fail = [];
  for (var i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      pass.push(arr[i]);
    } else {
      fail.push(arr[i]);
    }
  }
  return {'pass': pass, 'fail': fail};
}

export default partition;
