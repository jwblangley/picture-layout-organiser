const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')

const manager = require('./manager.js')

const app = express()
const API_PORT = process.env.PORT_BASE

// Setup
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

// API calls
app.get('/listUsers', (req, res) => {
  console.log("Call to listUsers")
  res.send(manager.listUsers())
})

app.post('/createAccount', (req, res) => {
  console.log("Call to createAccount")
  const { name } = req.body
  try {
    manager.createAccount(name)
  } catch(err) {
    res.status(422).send('Username already exists\n')
    return
  }
  res.send('Added \"' + name + '\"\n')
})

app.post('/deleteAccount', (req, res) => {
  console.log("Call to deleteAccount")
  const { name } = req.body
  manager.deleteAccount(name)
  res.send('Deleted \"' + name + '\"\n')
})

app.get('/:username/getUserContent', (req, res) => {
  console.log("Call to getUserContent")
  const username = req.params.username
  res.send(manager.getUserContent(username))
})

// TODO: more RESTful solution?
app.post('/:username/saveUserContent', (req, res) => {
  console.log("Call to saveUserContent")
  const { content } = req.body
  const username = req.params.username
  manager.saveUserContent(username, content)
  res.send("Saved user content")
})

// Multer to handle disk storage for uploads
var storage = multer.diskStorage({
      destination: function (req, file, cb) {
      // Set storage directory to working directory
      cb(null, manager.getWorkingDirectory())
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
    await manager.addUserMedia(username, req.files)

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
    await manager.addUserGallery(username, req.files)

    return res.send("Successfully uploaded " + req.files.length + " "
      + (req.files.length > 1 ? "files" : "file") + " to gallery")
    }
  )
})


app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`))
