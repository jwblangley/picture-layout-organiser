import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme => ({
  imageSquare: {
    display: 'inline-block',
    width: '100%',
    paddingTop: '100%',
    overflow: 'hidden',
    border: '1px solid black',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    cursor: 'pointer',
    position: 'relative'
  },
  icon: {
    margin: theme.spacing(1),
    width: '10%'
  },
  clickable: {
    '&:hover': {
      transform: 'scale(1.15)'
    }
  },
  lockRing: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  mediaTypeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0
  }
}))

export default useStyles
