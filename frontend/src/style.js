import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme =>
    ({
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
        textAlign: 'center'
      }
    })
)

export default useStyles
