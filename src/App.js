import React, {Component} from 'react';
import './App.css';

import {Progress} from 'reactstrap';

import Grid from './components/grid/Grid.js';
import ImageSquare from './components/imageSquare/ImageSquare.js';
import StatusMessage from './components/statusMessage/StatusMessage.js';
import EditPage from './components/editPage/EditPage.js';
import ToggleSwitch from './components/toggleSwitch/ToggleSwitch.js';

import arraySwap from './ArraySwap.js';
import partition from './Partition.js';

import plusIcon from './images/plus.svg';
import binIcon from './images/bin.svg';

import {
  getFormattedAddress,
  listUsers,
  getUserContent,
  saveUserContent,
  createAccount,
  deleteAccount,
  uploadUserMedia,
  uploadUserGallery
  } from './adapters/ManagerAdapter.js';

require('dotenv').config();

const NUM_COLS = 3;
const MAX_IN_GALLERY = 10;

const NONE_INDEX = -1;

const ENTER_KEY = 13;
const ESC_KEY = 27;
const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'video/mp4'];

var lastUpdate = 0;

function getBackendPorts() {
  return ({
    'backend': parseInt(process.env.REACT_APP_BACKEND_PORT_BASE),
    'imageHost': parseInt(process.env.REACT_APP_BACKEND_PORT_BASE) + 1
  });
}

class App extends Component {

  constructor(props) {
    super(props);
    this.accountSelectorRef = React.createRef();
    this.fileUploaderRef = React.createRef();

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      backendAddress: null,
      imageHostAddress: null,
      users: [],
      selectedIndex: NONE_INDEX,
      editingIndex: NONE_INDEX,
      content: [],
      username: null,
      saved: true,
      statusMessages: [],
      uploading: false,
      uploadPercent: 0
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  // Universal keyDown handler - used for moving selected item
  handleKeyDown(e) {
    // On ESC, deselect items and close edit page
    if (e.keyCode === ESC_KEY) {
      this.setState({'selectedIndex': NONE_INDEX, 'editingIndex': NONE_INDEX});
    }
    const indexChangeMap = new Map([[LEFT_KEY, -1], [UP_KEY, -1 * NUM_COLS], [RIGHT_KEY, 1], [DOWN_KEY, NUM_COLS]]);
    if (this.state.selectedIndex !== NONE_INDEX && indexChangeMap.has(e.keyCode)) {

      var selectedIndex = this.state.selectedIndex;
      var swapToIndex = this.state.selectedIndex + indexChangeMap.get(e.keyCode);
      // N.B selectedIndex should never be locked
      if (!this.isContentLocked(selectedIndex) && !this.isContentLocked(swapToIndex)) {
        try{
          this.setState({
            content: arraySwap(this.state.content, selectedIndex, swapToIndex),
            selectedIndex: swapToIndex,
            saved: false
          });
        } catch(err) {
          console.log(err);
        }
        this.delayedSaveAfterLastEdit();
      }
    }
  }

  formatContent(content) {
    var newContent = [...content];

    return newContent.map(c => {
      var content = {...c}
      if (content.mediaType === 'image' || content.mediaType === 'video') {
        content.media = getFormattedAddress(this.state.imageHostAddress) + '/' + content.media;
        if (content.mediaType === 'video') {
          content.thumbnail = getFormattedAddress(this.state.imageHostAddress) + '/' + content.thumbnail;
        }
      } else if (content.mediaType === 'gallery') {
        content.media = content.media.map(galleryItem => {
          if (galleryItem.mediaType === 'image') {
            return {
              'media': getFormattedAddress(this.state.imageHostAddress) + '/' + galleryItem.media,
              'mediaType': 'image'
            };
          } else if (galleryItem.mediaType === 'video') {
            return {
              'media': getFormattedAddress(this.state.imageHostAddress) + '/' + galleryItem.media,
              'mediaType': 'video',
              'thumbnail': getFormattedAddress(this.state.imageHostAddress) + '/' + galleryItem.thumbnail,
            };
          }
        });
      }
      return content;
    });
  }

  // 2 seconds after last update (not necessarily this call), issue a save
  delayedSaveAfterLastEdit() {
    const delay = 2000;
    lastUpdate = Date.now();
    setTimeout(function(){
      if (Date.now() - lastUpdate > delay - 100) {
        saveUserContent(this.state.username, this.state.content, this.state.backendAddress, function(){
          this.setState({'saved':true});
        }.bind(this));
      }
    }.bind(this), delay);
  }

  deselectSelectedItem() {
    this.setState({selectedIndex: NONE_INDEX})
  }

  isContentLocked(index) {
    // N.B: content outside of the array is said to be locked also
    if (index < 0 || index >= this.state.content.length) {
      return true;
    }
    return this.state.content[index].locked;
  }

  // Set all content items at and above the given index to locked
  lockContentAfterIndex(lockIndex) {
    var updatedContent = [...this.state.content];
    updatedContent = updatedContent.map((item, itemIndex) => {
      var newItem = {...item};
      newItem.locked = (itemIndex >= lockIndex);
      return newItem;
    });
    this.deselectSelectedItem();
    this.setState({'content': updatedContent, 'saved': false});
    this.delayedSaveAfterLastEdit();
  }

  // When a different account is selcted
  // Also handle new account creation
  handleAccountSelect(option) {
    this.deselectSelectedItem();
    if (option === 'create-new') {
      if (this.state.backendAddress !== null) {
        // Create new account
        var newName = prompt("New account name");
        // Remove whitespace from beginning and end of input
        if (newName !== null) {
          newName = newName.trim();
          if (newName !== null && newName !== "") {
            // Create account then switch to that new account - if a duplicate name is entered, enter that account
            createAccount(newName, this.state.backendAddress, function() {
              // Update list of users
              listUsers(this.state.backendAddress, (users) => {
                this.setState({'users': users});
                this.accountSelectorRef.current.value = newName;
                // Get new user's content - usually empty unless duplicate name used
                getUserContent(newName, this.state.backendAddress, function(content){
                  this.setState(
                    {
                      'username': newName,
                      'content': this.formatContent(content)
                    }
                  );
                }.bind(this));
              })
            }.bind(this));
          }
        }
      }
    } else if (option === '') {
      // None selected
      this.setState({
        'username': null,
        'content': []
      });
    } else {
      // Default - switch to an existing user
      var username = option;
      getUserContent(username, this.state.backendAddress, function(content){
        this.setState(
          {
            'username': username,
            'content': this.formatContent(content)
          }
        );
      }.bind(this));
    }
  }

  // Save caption text to content at given index
  saveCaption(newCaption, index) {
    var content = [...this.state.content];
    content[index].caption = newCaption;
    this.setState({
      'content': content,
      'saved': false,
    });
    this.delayedSaveAfterLastEdit();
  }

  // Remove content from given index
  deleteImage(index) {
    var content = [...this.state.content];
    // Delete 1 item at index, index
    content.splice(index, 1);
    this.setState({'content': content, 'saved': false});
    this.delayedSaveAfterLastEdit();
  }

  // Report a status message to the screen
  reportStatusMessage(messageText, positive) {
    // Use previousState so that multiple updates are not lost
    this.setState((previousState, props) =>
      ({'statusMessages':
        [
          {'text': messageText, 'positive': positive},
          ...previousState.statusMessages
        ]
      })
    );
  }

  uploadProgressUpdate(progressEvent) {
    var progressPercent = progressEvent.loaded / progressEvent.total * 100;
    this.setState({'uploadPercent': progressPercent});
  }

  uploadCompleteCallback(res) {
    if (!res.ok) {
      this.reportStatusMessage("Failed to upload, please try again", false)
    } else {
      this.reportStatusMessage(res.text, true);
      // Display newly uploaded content
      getUserContent(this.state.username, this.state.backendAddress, function(content) {
        this.setState(
          {
            'username': this.state.username,
            'content': this.formatContent(content)
          }
        );
      }.bind(this));
    }
    // Indicate to state that uploading is finished
    this.setState({'uploading': false});
  }

  handleFilesSelected(e) {
    var allowingFiles = partition(e.target.files, f => ALLOWED_MIME_TYPES.includes(f.type));
    var validFiles = allowingFiles.pass;
    var disallowedFiles = allowingFiles.fail;

    // Report disallowed files
    disallowedFiles.forEach(f => this.reportStatusMessage("Could not upload \"" + f.name + "\" - unsupported type", false));

    // N.B: Content must be saved before upload
    if (this.state.username !== null && this.state.saved) {
      if (validFiles.length > 0) {
        if (this.state.galleryUpload && validFiles.length > 1) {
          if (validFiles.length > MAX_IN_GALLERY) {
            this.reportStatusMessage("Cannot create gallery of more than " + MAX_IN_GALLERY + " items", false);
            return;
          }
          uploadUserGallery(
            validFiles,
            this.state.username,
            this.state.backendAddress,
            // progress callback
            this.uploadProgressUpdate.bind(this),
            // callback
            this.uploadCompleteCallback.bind(this)
          );
        } else {
          this.setState({'uploading': true, 'uploadPercent': 0});
          uploadUserMedia(
            validFiles,
            this.state.username,
            this.state.backendAddress,
            // progress callback
            this.uploadProgressUpdate.bind(this),
            // callback
            this.uploadCompleteCallback.bind(this)
          );
        }
      }
    } else {
      // Should never be reached as inputs are disabled in this case
      this.reportStatusMessage("Something went wrong, please try again", false);
      // N.B: uploading has not been set to true, so we do not need to set it to false here
    }

    // Remove any file from selection
    // Causes confusing behaviour when selecting the same file twice in a row otherwise due to onChange
    e.target.value = null;
  }

  // Main render method
  render() {
    // Prepare image upload button and functionality
    var imageUploadButton = (
      <span>
        <button
          id='upload-button'
          onClick={() => this.fileUploaderRef.current.click()}
        >
          Upload
        </button>
        <input
          type="file" multiple
          id="add-file"
          ref={this.fileUploaderRef}
          style={{display: "none"}}
          disabled={this.state.username === null || !this.state.saved || this.state.uploading || this.state.editingIndex !== NONE_INDEX}
          onChange={this.handleFilesSelected.bind(this)}
        />
      </span>
    );

    var topBar = (
      <div className="top-bar">
        <div className="admin-bar">
          <span className="backend-address-input">
            Backend Address:
            <input
              type="text"
              disabled={this.state.uploading || this.state.editingIndex !== NONE_INDEX}
              onKeyDown={
                function(e){
                  if (e.keyCode === ENTER_KEY) {
                    var ports = getBackendPorts();
                    var backendAddress = e.target.value + ':' + ports.backend;
                    var imageHostAddress = e.target.value + ':' + ports.imageHost;
                    this.setState(
                      {
                        'backendAddress': backendAddress,
                        'imageHostAddress': imageHostAddress
                      }
                    );
                    // Populate state with list of users
                    listUsers(backendAddress, function(users){
                      this.setState({'users':users})
                    }.bind(this));
                  }
                }.bind(this)}
              onFocus={function(e){
                // Deselect item on focus so that arrow key events only affect the input
                this.deselectSelectedItem();
              }.bind(this)}
            />
          </span>
          <span className='account-select'>
            Account:
            <select
              ref={this.accountSelectorRef}
              disabled={this.state.backendAddress === null || this.state.uploading || this.state.editingIndex !== NONE_INDEX}
              onChange={(e) => this.handleAccountSelect(e.target.value)}
            >
              <option value=''>None selected</option>
              {this.state.users.map(username =>
                (<option key={username} value={username}>{username}</option>)
              )}
              <option value='create-new'>+ New account</option>
            </select>
            <img
              id='account-delete-icon'
              src={binIcon}
              onClick={function() {
                if (this.state.backendAddress !== null && this.state.username !== null && !this.state.uploading && this.state.editingIndex === NONE_INDEX) {
                  if (window.confirm("Are you sure you want to delete \"" + this.state.username + "\" from the organiser")) {
                    // Delete account, reread list of users and set current user to null user and content empty
                    deleteAccount(this.state.username, this.state.backendAddress, function() {
                      listUsers(this.state.backendAddress, (users) => {
                        this.setState({'users': users, 'username': null, 'content': []});
                        this.accountSelectorRef.current.value = '';
                      });
                    }.bind(this));
                  }
                }
              }.bind(this)}
            />
          </span>
        </div>
        <div className='upload-status-bar'>
          <ToggleSwitch
            initial={false}
            text={"Gallery upload: "}
            onChange={checked => this.setState({'galleryUpload': checked})}
          />
          {imageUploadButton}
          <div className="progress-bar-container">
            <Progress max="100" color="success" striped value={this.state.uploadPercent}>{Math.round(this.state.uploadPercent, 2)}%</Progress>
          </div>
          {this.state.statusMessages.map((message, index) =>
            <StatusMessage
              text={message.text}
              positive={message.positive}
              handleDismiss={function(){
                this.setState({'statusMessages': this.state.statusMessages.filter((m, i) => i !== index)});
              }.bind(this)}
            />
          )}
        </div>
      </div>
    );

    // Prepare main gridContent for display when appropriate
    // N.B: hide content whilst uploading to prevent race conditions
    var gridContent = (
      <div id='main-grid' className='App' style={{'display': this.state.uploading ? 'none' : 'table'}}>
      <h2>{this.state.saved ? "Content is saved and up-to-date" : "Saving"}</h2>
      <Grid
        cols={NUM_COLS}
        gridContent={this.state.content.map((c, index) => (
          <ImageSquare
            media={c.media}
            mediaType={c.mediaType}
            captioned={c.caption !== ''}
            thumbnail={c.thumbnail}
            selected={this.state.selectedIndex === index}
            locked={c.locked}
            toggleLock={function(e) {
              // Disabled when editing - otherwise lock up to here
              e.stopPropagation();
              if (this.state.editingIndex === NONE_INDEX) {
                this.lockContentAfterIndex(index);
              }
            }.bind(this)}
            handleClick={function() {
              // Disabled when editing, else if not locked, select item
              if (this.state.editingIndex === NONE_INDEX) {
                if (!this.isContentLocked(index)) {
                  if (this.state.selectedIndex === index) {
                    this.deselectSelectedItem();
                  } else {
                    this.setState({selectedIndex: index});
                  }
                }
              }
            }.bind(this)}
            handleEditClick={function(e) {
              // If not editing something else, choose this for editing
              e.stopPropagation();
              if (this.state.editingIndex === NONE_INDEX) {
                this.setState({'editingIndex': index, 'selectedIndex': NONE_INDEX})
              }
            }.bind(this)}
          />
        ))}
      />
      </div>
    );

    // Content to render when there is no grid to show (no account selected)
    var noGridContent = (
      <div className='empty-content'>
        Please connect backend and select an account
      </div>
    );

    return (
      <div>
        {topBar}
        <div className='page-content'>

          {
            (this.state.backendAddress !== null && this.state.username !== null)
              ? gridContent
              : noGridContent
          }

          {
            this.state.editingIndex !== NONE_INDEX &&
            <EditPage
              text={this.state.content[this.state.editingIndex].caption}
              media={this.state.content[this.state.editingIndex].media}
              mediaType={this.state.content[this.state.editingIndex].mediaType}
              closePage={() => this.setState({'editingIndex': NONE_INDEX})}
              saveCaption={(text) => this.saveCaption(text, this.state.editingIndex)}
              deleteImage={function() {
                if (window.confirm("Delete image?")) {
                  this.deleteImage(this.state.editingIndex);
                  this.setState({'editingIndex': NONE_INDEX});
                }
              }.bind(this)}
            />
          }

        </div>
      </div>
    );
  }
}

export default App;
