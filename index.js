const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const manager = require('./manager.js');

const app = express();
const API_PORT = 3001;

// Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// API calls
app.get('/listUsers', (req, res) => {
  console.log("Call to listUsers");
  res.send(manager.listUsers());
});

app.post('/createUser', (req, res) => {
  console.log("Call to createUser");
  const { name } = req.body;
  try {
    manager.createUser(name);
  } catch(err) {
    res.status(422).send('Username already exists\n');
    return;
  }
  res.send('Added \"' + name + '\"\n');
});

app.get('/:username/getUserContent', (req, res) => {
  console.log("Call to getUserContent");
  const username = req.params.username;
  res.send(manager.getUserContent(username))
});

app.get('/:username/loadAllAndGetUserContent', (req, res) => {
  console.log("Call to loadAll");
  const username = req.params.username;
  res.send(manager.loadAllAndGetUserContent(username));
});


app.listen(API_PORT, () => console.log(`Server running on port ${API_PORT}`));
