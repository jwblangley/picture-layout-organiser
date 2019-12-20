import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme => ({
  imageSquare: {
    display: 'inline-block',
    width: '15vw',
    height: '15vw',
    overflow: 'hidden',
    border: '1px solid black',
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    cursor: 'pointer',
    position: 'relative'
  },
  icon: {
    margin: theme.spacing(1),
    width: '15%'
  },
  clickable: {
    '&:hover': {
      transform: 'scale(1.15)'
    }
  },
  lockRing: {
    position: 'absolute',
    right: 0
  },
  editIcon: {
    display: 'block'
  },
  mediaTypeIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0
  }
}))

export default useStyles
