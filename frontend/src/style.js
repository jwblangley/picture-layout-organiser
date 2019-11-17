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
    selectEmpty: {
      margin: theme.spacing(1),
      minWidth: 120,
  }
}))

export default useStyles
