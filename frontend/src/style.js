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
        zIndex: 5
      },
      adminBar: {
        backgroundColor: theme.palette.primary.light,
        padding: '2vmin',
        marginBottom: '2vmin'
      }
    })
)

export default useStyles
