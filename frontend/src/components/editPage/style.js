import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme => ({
    gridContainer: {
        padding: theme.spacing(2)
    },
    rightIcon: {
        marginLeft: theme.spacing(2)
    },
    button: {
        marginRight: theme.spacing(2)
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(10)
    },
    container: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(4)
    },
    alignCenter: {
      display: 'flex',
      justifyContent: 'center'
    },
    editPage: {
      backgroundColor: theme.palette.background.paper,
      padding: '3vmin',
      zIndex: '5',
      border: 'solid 0.1vmin black',
      textAlign: 'center',
    },
    exitIcon: {
      width: '1.5rem',
      position: 'absolute',
      right: '0.5vmin',
      top: '0.5vmin',
      cursor: 'pointer'
    },
    mediaDeleteIcon: {
      width: '1.5rem',
      cursor: 'pointer',
      position: 'absolute',
      left: '0.5vmin',
      top: '0.5vmin',
    },
    imagePreview: {
      width: '52vmin',
      height: '52vmin',
      overflow: 'hidden',
      border: 'solid 0.1vmin black',
      backgroundPosition: '50% 50%',
      backgroundSize: 'cover',
      margin: 'auto'
    },
    videoPreview: {
      width: '52vmin',
      border: 'solid 0.1vmin black',
      outline: 'none'
    },
    captionInputArea: {
      width: '52vmin',
      height: 'calc(90vmin - (2 * 3vmin) - 2vmin - 52vmin - 3.5em)',
      padding: '0.5vmin',
      margin: 'auto',
      marginTop: '2vmin',
      border: 'solid 0.1vmin black'
    },
    saveCaptionButton: {
      width: '52vmin',
      marginTop: '1vmin'
    }
}))

export default useStyles
