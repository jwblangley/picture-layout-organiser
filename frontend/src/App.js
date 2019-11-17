import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'

import './App.css'

import {Progress} from 'reactstrap'
import {
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@material-ui/core/index'

import Grid from './components/grid/Grid'
import ImageSquare from './components/imageSquare/ImageSquare'
import StatusMessage from './components/statusMessage/StatusMessage'
import EditPage from './components/editPage/EditPage'
import ToggleSwitch from './components/toggleSwitch/ToggleSwitch'

import useStyles from './style'

import arraySwap from './ArraySwap'
import partition from './Partition'

import binIcon from './images/bin.svg'

import {
  getFormattedAddress,
  listUsers,
  getUserContent,
  saveUserContent,
  createAccount,
  deleteAccount,
  uploadUserMedia,
  uploadUserGallery
  } from './adapters/ManagerAdapter'

require('dotenv').config()

const NUM_COLS = 3
const MAX_IN_GALLERY = 10

const NONE_INDEX = -1
const EMPTY_USER = ''

const ENTER_KEY = 13
const ESC_KEY = 27
const LEFT_KEY = 37
const UP_KEY = 38
const RIGHT_KEY = 39
const DOWN_KEY = 40

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'video/mp4']

var lastUpdate = 0

function getBackendPorts() {
  return ({
    'backend': parseInt(process.env.REACT_APP_BACKEND_PORT_BASE),
    'imageHost': parseInt(process.env.REACT_APP_BACKEND_PORT_BASE) + 1
  })
}

function copyToClipBoard(text) {
  // Add a new <input> element to body temporarily
  var body = document.getElementsByTagName('body')[0]
  var tempInput = document.createElement('INPUT')
  body.appendChild(tempInput)
  // Copy text into that element
  tempInput.setAttribute('value', text)
  // Select the text
  tempInput.select()
  tempInput.setSelectionRange(0, 99999) /*For mobile devices*/
  // Run the copy command
  document.execCommand('copy')
  // Remove the temporary element
  body.removeChild(tempInput)
}

function downloadUrl(url) {
  // Remove path (url) to file
  var fileName = url.substring(url.lastIndexOf('/') + 1)

  // Download url as blob to then download straight to device (not new tab)
  // N.B: CORS must be enabled on requested files
  axios({
    'url': url,
    'method': 'GET',
    'responseType': 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    link.click()
  })
}

const App = () => {
  const classes = useStyles()


  const [backendAddress, setBackendAddress] = useState(null)
  const [imageHostAddress, setImageHostAddress] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(NONE_INDEX)
  const [editingIndex, setEditingIndex] = useState(NONE_INDEX)
  const [content, setContent] = useState([])
  const [username, setUsername] = useState(EMPTY_USER)
  const [saved, setSaved] = useState(true)
  const [statusMessages, setStatusMessages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadPercent, setUploadPercent] = useState(0)
  const [galleryUpload, setGalleryUpload] = useState(false)

  const fileUploaderRef = useRef(null)

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false)
    return () => document.removeEventListener("keydown", handleKeyDown, false)
  })


  // Universal keyDown handler - used for moving selected item
  function handleKeyDown(e) {
    // On ESC, deselect items and close edit page
    if (e.keyCode === ESC_KEY) {
      setSelectedIndex(NONE_INDEX)
      setEditingIndex(NONE_INDEX)
    }
    const indexChangeMap = new Map([[LEFT_KEY, -1], [UP_KEY, -1 * NUM_COLS], [RIGHT_KEY, 1], [DOWN_KEY, NUM_COLS]])
    if (selectedIndex !== NONE_INDEX && indexChangeMap.has(e.keyCode)) {
      // Prevent arrow key scrolling
      e.preventDefault()

      var swapToIndex = selectedIndex + indexChangeMap.get(e.keyCode)

      // N.B selectedIndex should never be locked
      if (!isContentLocked(selectedIndex) && !isContentLocked(swapToIndex)) {
        try {
          var newContent = arraySwap([...content], selectedIndex, swapToIndex)
          setSelectedIndex(swapToIndex)
          setContent(newContent)
          setSaved(false)
          delayedSaveAfterLastEdit(newContent)
        } catch(err) {
          console.log(err)
        }

        // TODO: Relplace with better system (use refs?)
        // Scroll to moved selected item location
        const selectedItemAnchor = document.getElementById('current-selected-item')
        const anchorRect = selectedItemAnchor.getBoundingClientRect()
        const absoluteAnchorTop = anchorRect.top + window.pageYOffset
        const middleScrollPoint = absoluteAnchorTop - (window.innerHeight / 2)
        window.scrollTo(0, middleScrollPoint)
      }
    }
  }

  function formatContent(content) {
    var newContent = [...content]
    var imageHostPrefix = getFormattedAddress(imageHostAddress) + '/'

    return newContent.map(c => {
      var contentItem = {...c}
      if (contentItem.mediaType === 'image' || contentItem.mediaType === 'video') {
        contentItem.media = imageHostPrefix + contentItem.media
        if (contentItem.mediaType === 'video') {
          contentItem.thumbnail = imageHostPrefix + contentItem.thumbnail
        }
      } else if (contentItem.mediaType === 'gallery') {
        contentItem.media = contentItem.media.map(galleryItem => {
          if (galleryItem.mediaType === 'image') {
            return {
              'media': imageHostPrefix + galleryItem.media,
              'mediaType': 'image'
            }
          } else if (galleryItem.mediaType === 'video') {
            return {
              'media': imageHostPrefix + galleryItem.media,
              'mediaType': 'video',
              'thumbnail': imageHostPrefix + galleryItem.thumbnail,
            }
          }
          throw new Error("Unknown media type")
        })
      }
      return contentItem
    })
  }

  function stripContentFormat(formattedContent) {
    var newContent = [...formattedContent]
    var imageHostPrefix = getFormattedAddress(imageHostAddress) + '/'

    return newContent.map(c => {
      var contentItem = {...c}
      if (contentItem.mediaType === 'image' || contentItem.mediaType === 'video') {
        contentItem.media = contentItem.media.replace(imageHostPrefix, '')
        if (contentItem.mediaType === 'video') {
          contentItem.thumbnail = contentItem.thumbnail.replace(imageHostPrefix, '')
        }
      } else if (contentItem.mediaType === 'gallery') {
        contentItem.media = contentItem.media.map(galleryItem => {
          if (galleryItem.mediaType === 'image') {
            return {
              'media': galleryItem.media.replace(imageHostPrefix, ''),
              'mediaType': 'image'
            }
          } else if (galleryItem.mediaType === 'video') {
            return {
              'media': galleryItem.media.replace(imageHostPrefix, ''),
              'mediaType': 'video',
              'thumbnail': galleryItem.thumbnail.replace(imageHostPrefix, ''),
            }
          }
          throw new Error("Unknown media type")
        })
      }
      return contentItem
    })
  }

  // 2 seconds after last update (not necessarily this call), issue a save
  function delayedSaveAfterLastEdit(contentToSave) {
    const delay = 2000
    lastUpdate = Date.now()
    setTimeout(function(){
      if (Date.now() - lastUpdate > delay - 100) {
        var strippedContent = stripContentFormat(contentToSave)
        saveUserContent(username, strippedContent, backendAddress, function(){
          setSaved(true)
        })
      }
    }, delay)
  }

  function deselectSelectedItem() {
    setSelectedIndex(NONE_INDEX)
  }

  function isContentLocked(index) {
    // N.B: content outside of the array is said to be locked also
    if (index < 0 || index >= content.length) {
      return true
    }
    return content[index].locked
  }

  // Set all content items at and above the given index to locked
  function lockContentAfterIndex(lockIndex) {
    if (lockIndex === getNextDownloadIndex() + 1) {
      // Lock on furtherst locked item toggles that specific lock
      lockIndex++
    }

    var updatedContent = [...content]
    updatedContent = updatedContent.map((item, itemIndex) => {
      var newItem = {...item}
      newItem.locked = (itemIndex >= lockIndex)
      return newItem
    })
    deselectSelectedItem()
    setContent(updatedContent)
    setSaved(false)
    delayedSaveAfterLastEdit(updatedContent)
  }

  // Returns -1 when there is no next item
  function getNextDownloadIndex() {
    var lockedIndexes = content
      .map((c, index) => ({'index': index, 'locked':c.locked}))
      .filter(c => c.locked)
      .map(c => c.index)
    if (lockedIndexes.length === 0) {
      // None locked: return end
      return content.length - 1
    }
    var minLocked = Math.min(...lockedIndexes)
    return minLocked - 1
  }

  function saveContentItemToDevice(index, andLock) {
    var contentToSave = content[index]
    // Copy caption to clipboard
    var caption = contentToSave.caption
    copyToClipBoard(caption)

    // Download file(s) of content
    if (contentToSave.mediaType === 'image' || contentToSave.mediaType === 'video') {
      downloadUrl(contentToSave.media)
    } else if (contentToSave.mediaType === 'gallery') {
      contentToSave.media.forEach(galleryItem => downloadUrl(galleryItem.media))
    } else {
      throw new Error("Unknown media type")
    }

    if (andLock) {
      // For normal 'next' usage, lock item
      lockContentAfterIndex(index)
      reportStatusMessage("Downloaded item, copied caption to clipboard and locked item", true)
    } else {
      reportStatusMessage("Downloaded item and copied caption to clipboard", true)
    }
  }

  // When a different account is selcted
  // Also handle new account creation
  function handleAccountSelect(option) {
    deselectSelectedItem()
    if (option === 'create-new') {
      if (backendAddress !== null) {
        // Create new account
        var newName = prompt("New account name")
        // Remove whitespace from beginning and end of input
        if (newName !== null) {
          newName = newName.trim()
          if (newName !== null && newName !== "") {
            // Create account then switch to that new account - if a duplicate name is entered, enter that account
            createAccount(newName, backendAddress, function() {
              // Update list of users
              listUsers(backendAddress, (users) => {
                setUsers(users)
                // Get new user's content - usually empty unless duplicate name used
                getUserContent(newName, backendAddress, function(incomingContent){
                  setUsername(newName)
                  setContent(formatContent(incomingContent))
                })
              })
            })
          }
        }
      }
    } else if (option === EMPTY_USER) {
      setUsername(EMPTY_USER)
      setContent([])
    } else {
      // Default - switch to an existing user
      var username = option
      getUserContent(username, backendAddress, function(content) {
        setUsername(username)
        setContent(formatContent(content))
      })
    }
  }

  // Save caption text to content at given index
  function saveCaption(newCaption, index) {
    var newContent = [...content]
    newContent[index].caption = newCaption
    setContent(newContent)
    setSaved(false)
    delayedSaveAfterLastEdit(newContent)
  }

  // Remove content from given index
  function deleteImage(index) {
    var newContent = [...content]
    // Delete 1 item at index, index
    newContent.splice(index, 1)
    setContent(newContent)
    setSaved(false)
    delayedSaveAfterLastEdit(newContent)
  }

  // Report a status message to the screen
  function reportStatusMessage(messageText, positive) {
    // Use previousState so that multiple updates are not lost
    setStatusMessages(prevStatusMessages =>
      [
        {'text': messageText, 'positive': positive},
        ...prevStatusMessages
      ]
    )
  }

  function uploadProgressUpdate(progressEvent) {
    var progressPercent = progressEvent.loaded / progressEvent.total * 100
    setUploadPercent(progressPercent)
  }

  function uploadCompleteCallback(res) {
    if (!res.ok) {
      reportStatusMessage("Failed to upload, please try again", false)
    } else {
      reportStatusMessage(res.text, true)
      // Display newly uploaded content
      getUserContent(username, backendAddress, function(incomingContent) {
        setContent(formatContent(incomingContent))
      })
    }
    // Indicate to state that uploading is finished
    setUploading(false)
  }

  function handleFilesSelected(e) {
    var allowingFiles = partition(e.target.files, f => ALLOWED_MIME_TYPES.includes(f.type))
    var validFiles = allowingFiles.pass
    var disallowedFiles = allowingFiles.fail

    // Report disallowed files
    disallowedFiles.forEach(f => reportStatusMessage("Could not upload \"" + f.name + "\" - unsupported type", false))

    // N.B: Content must be saved before upload - enforced by button disabled
    if (validFiles.length > 0) {
      if (galleryUpload && validFiles.length > 1) {
        if (validFiles.length > MAX_IN_GALLERY) {
          reportStatusMessage("Cannot create gallery of more than " + MAX_IN_GALLERY + " items", false)
          return
        }
        uploadUserGallery(
          validFiles,
          username,
          backendAddress,
          // progress callback
          uploadProgressUpdate,
          // callback
          uploadCompleteCallback
        )
      } else {
        setUploading(true)
        setUploadPercent(0)
        uploadUserMedia(
          validFiles,
          username,
          backendAddress,
          // progress callback
          uploadProgressUpdate,
          // callback
          uploadCompleteCallback
        )
      }
    }

    // Remove any file from selection
    // Causes confusing behaviour when selecting the same file twice in a row otherwise due to onChange
    e.target.value = null
  }




  /* ========================For Rendering=================================== */

  // Prepare image upload button and functionality
  var imageUploadButton = (
    <span>
      <Button
        className={classes.button}
        disabled={username === EMPTY_USER || !saved}
        variant='contained'
        color='primary'
        onClick={() => fileUploaderRef.current.click()}
      >
        Upload
      </Button>
      <input
        type="file" multiple
        id="add-file"
        ref={fileUploaderRef}
        style={{display: "none"}}
        disabled={username === EMPTY_USER || !saved || uploading || editingIndex !== NONE_INDEX}
        onChange={handleFilesSelected}
      />
    </span>
  )

  var topBar = (
    <div className="top-bar">
      <div className="admin-bar">
        <span className="backend-address-input">
          <TextField
            className={classes.textField}
            label="Backend address"
            disabled={uploading || editingIndex !== NONE_INDEX}
            onKeyDown={
              function(e){
                if (e.keyCode === ENTER_KEY) {
                  var ports = getBackendPorts()
                  var backendAddress = e.target.value + ':' + ports.backend
                  var imageHostAddress = e.target.value + ':' + ports.imageHost
                  setBackendAddress(backendAddress)
                  setImageHostAddress(imageHostAddress)

                  // Populate state with list of users
                  listUsers(backendAddress, function(users){
                    setUsers(users)
                  })
                }
              }}
            onFocus={function(e){
              // Deselect item on focus so that arrow key events only affect the input
              deselectSelectedItem()
            }}
          />
        </span>
        <span className='account-select'>
          <FormControl style={{minWidth: 120}}>
            <InputLabel id='account-select-label'>Account</InputLabel>
            <Select
              value={username}
              labelId='account-select-label'
              disabled={backendAddress === null || uploading || editingIndex !== NONE_INDEX}
              onChange={e => handleAccountSelect(e.target.value)}
            >
              <MenuItem value={EMPTY_USER}>None selected</MenuItem>
              {users.map(name =>
                (<MenuItem key={name} value={name}>{name}</MenuItem>)
              )}
              <MenuItem value='create-new'>+ New account</MenuItem>
            </Select>
          </FormControl>
          <img
            id='account-delete-icon'
            src={binIcon}
            alt='delete account'
            onClick={function() {
              if (backendAddress !== null && username !== EMPTY_USER && !uploading && editingIndex === NONE_INDEX) {
                if (window.confirm("Are you sure you want to delete \"" + username + "\" from the organiser")) {
                  // Delete account, reread list of users and set current user to the empty user and content empty
                  deleteAccount(username, backendAddress, function() {
                    listUsers(backendAddress, (users) => {
                      setUsers(users)
                      setUsername(EMPTY_USER)
                      setContent([])
                    })
                  })
                }
              }
            }}
          />
        </span>
      </div>
      <div className='upload-status-bar'>
        <ToggleSwitch
          value={galleryUpload}
          text={"Gallery upload: "}
          onChange={checked => setGalleryUpload(checked)}
        />
        {imageUploadButton}
        <div className="progress-bar-container">
          <Progress max="100" color="success" striped value={uploadPercent}>{Math.round(uploadPercent, 2)}%</Progress>
        </div>
      </div>
      <div className='download-button'>
        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          disabled={uploading || editingIndex !== NONE_INDEX || username === EMPTY_USER || backendAddress === null }
          onClick={function() {
            var toDownloadIndex = selectedIndex === NONE_INDEX ? getNextDownloadIndex() : selectedIndex
            if (toDownloadIndex === -1) {
              reportStatusMessage("No next item available", false)
              return
            }
            saveContentItemToDevice(toDownloadIndex, selectedIndex === NONE_INDEX)
          }}
        >
          {selectedIndex === NONE_INDEX ? 'Download latest and lock' : ' Download selected'}
        </Button>
      </div>
      <div className='status-message-container'>
        {statusMessages.map((message, index) =>
          <StatusMessage
            key={index}
            text={message.text}
            positive={message.positive}
            handleDismiss={function(){
              setStatusMessages(statusMessages.filter((m, i) => i !== index))
            }}
          />
        )}
      </div>
    </div>
  )

  // Prepare main gridContent for display when appropriate
  // N.B: hide content whilst uploading to prevent race conditions
  var gridContent = (
    <div id='main-grid' className='App' style={{'display': uploading ? 'none' : 'table'}}>
      <h2>{saved ? "Content is saved and up-to-date" : "Saving"}</h2>
      <Grid
        cols={NUM_COLS}
        gridContent={content.map((c, index) => (
          <ImageSquare
            media={c.media}
            mediaType={c.mediaType}
            captioned={c.caption !== ''}
            thumbnail={c.thumbnail}
            selected={selectedIndex === index}
            locked={c.locked}
            toggleLock={function(e) {
              // Disabled when editing - otherwise lock up to here
              e.stopPropagation()
              if (editingIndex === NONE_INDEX) {
                lockContentAfterIndex(index)
              }
            }}
            handleClick={function() {
              // Disabled when editing, else if not locked, select item
              if (editingIndex === NONE_INDEX) {
                if (!isContentLocked(index)) {
                  if (selectedIndex === index) {
                    deselectSelectedItem()
                  } else {
                    setSelectedIndex(index)
                  }
                }
              }
            }}
            handleEditClick={function(e) {
              // If not editing something else, choose this for editing
              e.stopPropagation()
              if (editingIndex === NONE_INDEX) {
                setEditingIndex(index)
                setSelectedIndex(NONE_INDEX)
              }
            }}
          />
        ))}
      />
    </div>
  )

  // Content to render when there is no grid to show (no account selected)
  var noGridContent = (
    <div className='empty-content'>
      Please connect backend and select an account
    </div>
  )

  return (
    <div>
      {topBar}
      <div className='page-content'>

        {
          (backendAddress !== null && username !== EMPTY_USER)
            ? gridContent
            : noGridContent
        }

        {
          editingIndex !== NONE_INDEX &&
          <EditPage
            caption={content[editingIndex].caption}
            media={content[editingIndex].media}
            mediaType={content[editingIndex].mediaType}
            closePage={() => setEditingIndex(NONE_INDEX)}
            saveCaption={text => saveCaption(text, editingIndex)}
            deleteImage={function() {
              if (window.confirm("Delete image?")) {
                deleteImage(editingIndex)
                setEditingIndex(NONE_INDEX)
              }
            }}
            setGalleryItemAsGalleryHead={function(itemIndex) {
              // Get old items
              var newContent = [...content]
              var selectedGallery = newContent[editingIndex]
              var galleryMedia = selectedGallery.media
              var toHead = galleryMedia[itemIndex]

              // Delete 1 item at index, itemIndex - remove item from original place in list
              galleryMedia.splice(itemIndex, 1)
              // Move item to head of list
              galleryMedia = [toHead, ...galleryMedia]

              // Build new items
              selectedGallery.media = galleryMedia
              newContent[editingIndex] = selectedGallery

              // Set state and save
              setContent(newContent)
              delayedSaveAfterLastEdit(newContent)

              //TODO: Relplace with better system (use refs?)
              // Scroll to gallery head
              document.getElementById("gallery-preview-head").scrollIntoView()
            }}
          />
        }
      </div>
    </div>
  )
}

export default App
