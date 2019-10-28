# Backend

Edit the file `backend/.config/directory.txt` to change working directory location. By default this is the folder `plo-data` in the home directory

If required edit the port number in `run.sh`. This should match the port number needed entered in the front end config.

<hr>
Requires `ffmpeg` to be installed.
<hr>

Run `npm start` to start the server

# Frontend
Before running this project, create a `.env` file in the frontend directory with the contents:

```REACT_APP_BACKEND_PORT_BASE=<backend port number>```.

The default backend port number is 8008 (N.B: The backend actually uses two successive ports starting with the given port number).

<hr>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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
