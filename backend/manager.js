const fs = require('fs')
const ThumbnailGenerator = require('video-thumbnail-generator').default

const GARBAGE_COLLECT_EVERY = 10

// N.B synchronous file reading for setup
const workingDirectory
= fs.readFileSync('.config/absoluteDirectory.txt', 'utf8').replace(/\s/g, "")

function getWorkingDirectory() {
  return workingDirectory
}

function readManagerSync() {
  return JSON.parse(fs.readFileSync(workingDirectory + "/manager.json"))
}

var writeManagerCounter = 0
function writeManagerSync(managerJson) {
  // N.B: garbage collect on first run to ensure they are regular enough long term over many short sessions
  if (writeManagerCounter++ % GARBAGE_COLLECT_EVERY === 0) {
    console.log("Garbage collect")
    garbageCollect(managerJson)
  }
  // WRite manager json to disk
  fs.writeFileSync(workingDirectory + "/manager.json", JSON.stringify(managerJson) + '\n')
}

// Delete files that are no longer being referenced
function garbageCollect(managerJson) {

  // Calculate referenced files
  var referencedFiles = []

  // Add video and image media from all users
  managerJson.users.map(u => u.content.filter(c => c.mediaType === 'image' || c.mediaType === 'video').map(c => c.media))
    .forEach(filesList => referencedFiles.push(...filesList))
  // Add video thumbnails from all users
  managerJson.users.map(u => u.content.filter(c => c.mediaType === 'video').map(c => c.thumbnail))
    .forEach(filesList => referencedFiles.push(...filesList))

  // Add gallery content
  var allGalleries = []
  // Read all user's galleries into allGalleries
  managerJson.users.map(u => u.content.filter(c => c.mediaType === 'gallery').map(c => c.media))
    .forEach(userGalleries => allGalleries.push(...userGalleries))
  // Add all gallery vidoes and images
  allGalleries.map(g => g.filter(c => c.mediaType === 'image' || c.mediaType === 'video').map(c => c.media))
    .forEach(filesList => referencedFiles.push(...filesList))
  // Add all gallery video thumbnails
  allGalleries.map(g => g.filter(c => c.mediaType === 'video').map(c => c.thumbnail))
    .forEach(filesList => referencedFiles.push(...filesList))

  // Read directory
  var allFiles = fs.readdirSync(workingDirectory)
  // Delete all files (except the manager) that are not referenced
  allFiles
    .filter(f => f !== 'manager.json')
    .filter(f => !referencedFiles.includes(f))
    .forEach(f => fs.unlinkSync(workingDirectory + "/" + f))
}

function saveUserContent(username, userContent) {
  var manager = {...readManagerSync()}
  var userIndex = manager.users.findIndex(u => u.name === username)
  manager.users[userIndex].content = userContent
  writeManagerSync(manager)
}

function listUsers() {
  var manager = readManagerSync()
  return manager.users.map(u => u.name)
}

function createAccount(name) {
  var manager = readManagerSync()

  if (listUsers().includes(name)) {
    throw "Username already exists"
  }

  var newUser = {
    'name': name,
    'content': []
  }
  manager.users.push(newUser)

  writeManagerSync(manager)
}

function deleteAccount(name) {
  var manager = readManagerSync()

  var users = [...manager.users]
  users = users.filter(u => u.name !== name)

  manager.users = users

  writeManagerSync(manager)
}

function getUserContent(username) {
  var manager = readManagerSync()
  return manager.users.filter(u => u.name === username)[0].content
}

async function generateThumbnails(files) {
  // Generate thumbnails for videos
  // Store thumbnail name against filename in map
  var thumbnailMap = new Map()
  // Map each video to promise that thumbnail will be completed and its name put in the map
  var thumbnailPromises = files.filter(f => f.mimetype.startsWith('video'))
    .map(async f => {
      // Generate thumbnail
      const tg = new ThumbnailGenerator({
        sourcePath: workingDirectory + '/' + f.filename,
        thumbnailPath: workingDirectory
      })
      var thumbnail = await tg.generateOneByPercent(50, {size: '640x?'})
      thumbnailMap.set(f.filename, thumbnail)
      return thumbnail
  })

  // Wait for all thumbnails to be complete and added to map
  await Promise.all(thumbnailPromises)
  return thumbnailMap
}

async function addUserMedia(username, files) {
  var userContent = [...getUserContent(username)]

  var thumbnailMap = await generateThumbnails(files)

  var newEntries = files.map(f => {
    if (f.mimetype.startsWith('video')) {
      // Video
      return ({
        'media': f.filename,
        'mediaType': 'video',
        'caption': '',
        'thumbnail': thumbnailMap.get(f.filename),
        'locked': false
      })
    } else {
      // Standard image
      return ({
        'media': f.filename,
        'mediaType': 'image',
        'caption': '',
        'locked': false
      })
    }
  })

  userContent = [...newEntries, ...userContent]

  saveUserContent(username, userContent)
}

async function addUserGallery(username, files) {
  var userContent = [...getUserContent(username)]

  var thumbnailMap = await generateThumbnails(files)

  var galleryContent = files.map(f => {
    if (f.mimetype.startsWith('video')) {
      // Video
      return ({
        'media': f.filename,
        'mediaType': 'video',
        'thumbnail': thumbnailMap.get(f.filename)
      })
    } else {
      // Standard image
      return ({
        'media': f.filename,
        'mediaType': 'image'
      })
    }
  })

  var newContentEntry = {
    'media': galleryContent,
    'mediaType': 'gallery',
    'caption': '',
    'locked': false
  }

  userContent = [newContentEntry, ...userContent]

  saveUserContent(username, userContent)
}


module.exports = {
  getWorkingDirectory,
  listUsers,
  createAccount,
  deleteAccount,
  getUserContent,
  saveUserContent,
  addUserMedia,
  addUserGallery
}
