import React from 'react'

import useStyles from './style'

import { Close as CloseIcon } from '@material-ui/icons'
import {
  Paper,
  Typography,
  Grid
} from '@material-ui/core'

const StatusMessage = ({text, positive, handleDismiss}) => {

  const classes = useStyles()

  return (
    <Paper className={classes.statusMessage}>
      <Grid container>
        <Grid item xs={11}>
          <Typography className={positive ? classes.positive : classes.negative}>
            {text}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <CloseIcon className={classes.dismissIcon} onClick={handleDismiss} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default StatusMessage
