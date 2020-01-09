import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  topBar: {
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 5,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default
  },
  adminBar: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  gridContent: {
    textAlign: 'center',
    fontSize: 0,
    width: '40%',
    '@media(max-aspect-ratio: 11/10)' : {
      width: '95%'
    }
  },
  gridPaper: {
    padding: theme.spacing(2)
  },
  statusText: {
    marginBottom: theme.spacing(2)
  },
  snackbarInfo: {
    backgroundColor: theme.palette.primary.main
  },
  snackbarSuccess: {
    backgroundColor: theme.palette.success.main
  },
  snackbarError: {
    backgroundColor: theme.palette.error.main
  }
}))

export default useStyles
