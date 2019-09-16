import axios from 'axios';

// TODO: Switch all to use axios?

const HTTP_OK = 200;

function createPostParams(jsonData) {
  const params = {
    method: 'POST',
    body: JSON.stringify(jsonData),
    headers: {
      'Content-Type':'application/json',
    }
  };
  return params;
}

export function getFormattedAddress(backendAddress) {
  if (!backendAddress.toLowerCase().startsWith('http://')
    && !backendAddress.toLowerCase().startsWith('https://')) {
    return 'http://' + backendAddress;
  } else if (backendAddress.toLowerCase().startsWith('https://')) {
    return 'http://' + backendAddress.substring(8, backendAddress.length);
  } else {
    return backendAddress;
  }
}

export function listUsers(backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/listUsers';

  fetch(query_url)
  .then(res => res.json())
  .then(callback);
}

export function getUserContent(username, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/getUserContent';
  fetch(query_url)
  .then(res => res.json())
  .then(callback);
}

export function saveUserContent(username, content, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/saveUserContent';
  var postParams = createPostParams({'content': content});
  fetch(query_url, postParams)
    .then(callback);
}

export function createAccount(newName, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/createAccount';
  const postParams = createPostParams({'name': newName});
  fetch(query_url, postParams)
    .then(callback);
}

export function deleteAccount(username, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/deleteAccount';
  const postParams = createPostParams({'name': username});
  fetch(query_url, postParams)
    .then(callback);
}

export function uploadUserMedia(files, username, backendAddress, progressCallback, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/addUserMedia';
  const formData = new FormData();
  for (var i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }

  axios.post(query_url, formData, {
       onUploadProgress: progressCallback,
     })
  .then(res => ({'ok': res.status === HTTP_OK, 'text': res.data}))
  .then(callback);
}
