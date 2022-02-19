![](https://img.shields.io/badge/docker-compose-blue)
![](https://img.shields.io/badge/mongodb-%20-green)
![](https://img.shields.io/badge/node-js-blue)
![](https://img.shields.io/badge/express-js-black)
![](https://img.shields.io/badge/full-stack-black)

# Picture Layout Organiser

A picture organiser for grid layouts such as [Instagram](https://instagram.com).

Features include:
* Drag-and-drop upload
* Reordering
* Captioning
* Video Support
* Gallery Support
* One-click download
* Lock organisation to keep track of which photos have been posted

## Screenshots
<img src="screenshots/home.png" />
<br /><br />
<img src="screenshots/home2.png" />
<br /><br />
<img src="screenshots/changeaccounts.png" />
<br /><br />
<p float="center">
<img src="screenshots/phone-home.png" width=45% /><img src="screenshots/phone-selected.png" width=45% />
</p>
<br /><br />
<img src="screenshots/selected.png" />
<br /><br />
<img src="screenshots/filedrag.png" />
<br /><br />
<img src="screenshots/uploading.png" />
<br /><br />
<img src="screenshots/uploaded.png" />

# Backend

<a name="back-config"></a>

## Configuration

1. Ensure requirements are met: `bash` and `ffmpeg` are required. `mongo` needs to be set up, either locally or a remote instance.

    * If hosting mongo locally, ensure that the mongo data store path is set.
    This can be done with `mongod --dbpath <location>`. It is recommended to use `/data/db`.

1. Set the environment variable, `DATA_DIRECTORY`, to change the data directory location - this is where all uploaded media content will be stored.
By default this is the folder `.plo` in the home directory

1. Set the environment variable, `PORT_BASE`, to the first of two consecutive ports that will be used for the backend API.
The default is `8008`.

1. Set the environment variable, `MONGODB_LOCATION`, to the location of the mongodb instance being used.
The default is `127.0.0.1:27017`.

## Available Scripts

### `npm start`
Runs the backend application

### `plo-export`
Saves all stored content to an zip archive.

Usage: `./plo-export.sh export.zip`

### `plo-import`
Restores all content from a previous export.

Usage: `./plo-import.sh export.zip`

### `plo-compress-existing`
For existing applications prior to the introduction of image compression.
Compresses existing images in the application to be in line with newer versions.

Usage: `./plo-compress-existing.sh`


# Frontend

<a name="front-config"></a>
## Configuration
Set the following environment variables. Alternatively, create a `.env` file in the frontend directory with the contents:

```
REACT_APP_BACKEND_LOCATION=<location of backend, not including port number>
REACT_APP_BACKEND_PORT_BASE=<backend port number>
```

N.B. these arguments need to be available at build time to be embedded by webpack.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Runs the test suite.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Docker

The full stack application has been dockerized using `docker-compose`.
This dockerization is recommended for deployment rather than local development.

For a quick production-ready full-stack docker build, make a few simple edits to `docker-compose.yml`.

* Update any port mappings to your choice
    * Ensure the frontend build argument, `REACT_APP_BACKEND_PORT_BASE`, is updated to match your selection
* Update the frontend build argument, `REACT_APP_BACKEND_LOCATION`, to reachable location of the backend.
    * N.B. this location is backed into the frontend build.
    This is typically the IP of your docker host.
    Since this is a web application, the backend must be reachable from any client that can load the served frontend.
* (Optional) change the volumes to bind mounts to specify the location stored data.
