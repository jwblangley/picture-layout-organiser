import { makeStyles } from '@material-ui/core/index'

const useStyles = makeStyles(theme => {
    console.log(theme)
    return ({
      button: {
        marginRight: theme.spacing(2)
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
      },
      mainGrid: {
        display: 'table',
        margin: 'auto',
        textAlign: 'center'
      },
      emptyContent: {
        margin: 'auto',
        textAlign: 'center'
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
      },
      uploadStatusBar: {
        textAlign: 'center',
        backgroundColor: 'white',
        width: '100%',
        padding: '2vmin',
        borderBottom: 'solid 0.1vmin black'
      },
      downloadButton: {
        padding: '2vmin',
        textAlign: 'center',
        borderBottom: 'solid 0.1vmin black',
        backgroundColor: 'white'
      },
      statusMessageContainer: {
        borderBottom: 'solid 0.1vmin black',
        padding: '1vmin',
        backgroundColor: 'white'
      },
      uploadButton: {
        marginRight: '2vmin',
        verticalAlign: 'middle'
      },
      progressBarContainer: {
        display: 'inlineBlock',
        width: '75vw'
      },
      pageContent: {
        marginTop: '2vmin'
      },
      accountSelect: {
        verticalAlign: 'middle'
      },
      accountDeleteIcon: {
        width: '1.5rem',
        cursor: 'pointer',
        margin: '0.5vmin'
      }


    })
}
)

export default useStyles
