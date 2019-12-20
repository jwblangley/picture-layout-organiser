import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme => ({
  carousel: {
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    alignItems: 'flex-start',
    display: 'flex'
  },
  carouselSlide: {
    display: 'inline-block',
    marginRight: theme.spacing(2)
  },
  warningMessage: {
    color: theme.palette.danger.dark,
    textAlign: 'center',
    width: '100%',
    height: '100%'
  }
}))

export default useStyles
