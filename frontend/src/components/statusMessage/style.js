import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme =>
    ({
      statusMessage: {
        margin: theme.spacing(2),
        padding: theme.spacing(1)
      },
      dismissIcon: {
        float: 'right',
        cursor: 'pointer'
      },
      positive: {
        color: theme.palette.success.dark
      },
      negative: {
        color: theme.palette.danger.dark
      }
    })
)

export default useStyles
