const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')

const mongoManager = require('./mongoManager.js')
const imageProcessing = require('./imageProcessing.js')

const app = express()
const API_PORT = process.env.PORT_BASE
const DATA_DIRECTORY = process.env.DATA_DIRECTORY

const GARBAGE_COLLECT_EVERY = 10

// Setup
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())


// API calls
/*----------------------------------------------------------------------------*/

app.get('/listUsers', async (req, res) => {
  console.log("Call to listUsers")
  users = await mongoManager.listUsers()
  res.send(users)
})

app.post('/createUser', async (req, res) => {
  console.log("Call to createUser")
  const { name } = req.body
  try {
    await mongoManager.createUser(name)
    res.send('Added \"' + name + '\"\n')
  } catch(err) {
    console.log(err.message)
    res.status(422).send(err.message + '\n')
  }
})

app.post('/deleteUser', async (req, res) => {
  console.log("Call to deleteUser")
  const { user } = req.body
  await mongoManager.deleteUser(user)
  res.send('Deleted \"' + user + '\"\n')
})

app.get('/:username/getUserContent', async (req, res) => {
  console.log("Call to getUserContent")
  const username = req.params.username
  userContent = await mongoManager.getUserContent(username)
  res.send(userContent)
})

var saves = 0
// TODO: more RESTful approach - difficult as we currently bundle changes to save
app.post('/:username/saveUserContent', async (req, res) => {
  console.log("Call to saveUserContent")
  const { content } = req.body
  const username = req.params.username
  await mongoManager.saveUserContent(username, content)

  if (saves++ % GARBAGE_COLLECT_EVERY === 0) {
    console.log("Garbage collect")
    await garbageCollect()
  }

  res.send("Saved user content")
})

// Multer to handle disk storage for uploads
var storage = multer.diskStorage({
      destination: function (req, file, cb) {
      // Set storage directory to working directory
      cb(null, DATA_DIRECTORY)
    },
    filename: function (req, file, cb) {
      // Rename files by prepending date to avoid name clashes
      cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, "_"))
    }
})
var upload = multer({ storage: storage }).array('file')

app.post('/:username/addUserMedia', (req, res) => {
  console.log("Call to addUserMedia")
  const username = req.params.username

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }

    // Ensure to wait for addUserMedia to finish
    await mongoManager.addUserMedia(username, req.files, DATA_DIRECTORY)

    await compressImages(req.files)

    return res.send("Successfully uploaded " + req.files.length + " "
      + (req.files.length > 1 ? "files" : "file"))
    }
  )
})

app.post('/:username/addUserGallery', (req, res) => {
  console.log("Call to addUserGallery")
  const username = req.params.username

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }

    // Ensure to wait for addUserMedia to finish
    await mongoManager.addUserGallery(username, req.files, DATA_DIRECTORY)

    await compressImages(req.files)

    return res.send("Successfully uploaded " + req.files.length + " "
      + (req.files.length > 1 ? "files" : "file") + " to gallery")
    }
  )
})

/*----------------------------------------------------------------------------*/

async function compressImages(files) {
  files = files.map(f => DATA_DIRECTORY + "/" + f.filename)
  for (var i = 0; i < files.length; i++) {
    const file = files[i]
    await imageProcessing.processImageSync(file)
  }
}

// Delete files that are no longer being referenced
async function garbageCollect() {
  const allMedia = await mongoManager.getAllMedia()

  // Read directory
  var allFiles = fs.readdirSync(DATA_DIRECTORY)
  // Delete all files (except the manager) that are not referenced
  allFiles
    // The next line is not strictly needed but is kept for backwards compatibility
    .filter(f => f !== 'manager.json')
    // ---------------------------------------
    .filter(f => !allMedia.includes(f))
    .forEach(f => fs.unlinkSync(DATA_DIRECTORY + "/" + f))
}


app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`))
