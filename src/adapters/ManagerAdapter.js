import axios from 'axios';

// TODO: Switch all to use axios?

const HTTP_OK = 200;

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
  axios.post(query_url, {
    'content': content
  })
  .then(callback);
}

export function createAccount(newName, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/createAccount';
  axios.post(query_url, {
    'name': newName
  })
  .then(callback);
}

export function deleteAccount(username, backendAddress, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/deleteAccount';
  axios.post(query_url, {
    'name': username
  })
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

export function uploadUserGallery(files, username, backendAddress, progressCallback, callback) {
  const query_url = getFormattedAddress(backendAddress) + '/' + username + '/addUserGallery';
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
