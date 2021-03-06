import React, { useState } from 'react';
import { withFirebase } from '../Firebase';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function AddRoutine(props) {
  const classes = useStyles();

  const { authUser, firebase, setOpenSnackbar, setSnackbarMsg } = props;
  const uid = authUser.uid;

  // Set default activity object
  const defaultActivity = {
    name: '',
    type: 1,
    duration: 60,
    day: 0
  }

  const [activity, setActivity] = useState(defaultActivity);
  const [displayMetric, setDisplayMetric] = useState('Duration')

  function DisplayMetric(type) {
    let displayType = ""
    switch (type) {
      case 1:
        displayType = "Repetitions";
        break;
      case 2:
        displayType = "Duration";
        break;
      case 3:
        displayType = "Duration";
        break;
      case 4:
        displayType = "Repetitions"
        break;
      default:
        displayType = "Not set";
    };

    return displayType + " : "
  }

  const handleChange = e => {
    const {name, value} = e.target
    if (name === 'type')
      setDisplayMetric(DisplayMetric(value))
    setActivity({
      ...activity,
      [name]: value
    });

  }

  const handleSlider = e => {
    const duration = e.target.getAttribute('aria-valuenow');
    setActivity({ ...activity, duration: duration });
  }

  const isValid = activity.name === '';



  // Add the activity to firebase via the API made in this app
  const handleSubmit = () => {
    if (authUser) {
      firebase.addRoutine(uid, activity);
      setActivity(defaultActivity);
      // Show notification
      setOpenSnackbar(true);
      setSnackbarMsg('Added routine.');
      setTimeout(() => {
        setOpenSnackbar(false)
      }, 3000)
    }
  }

  return (
    <form noValidate onSubmit={e => e.preventDefault()}>
      <FormControl className={classes.formControl}>
        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
            <FormControl className={classes.formControl}>
            <Typography id="discrete-slider" gutterBottom>
              Day
            </Typography>
            <Select
              labelId="demo-simple-day-select-label"
              value={activity.day}
              style={{ minWidth: '100%' }}
              inputProps={{
                name: 'day',
                id: 'day-native-simple',
              }}
              onChange={handleChange}
            >
              <MenuItem value={0}>Sunday</MenuItem>
              <MenuItem value={1}>Monday</MenuItem>
              <MenuItem value={2}>Tueday</MenuItem>
              <MenuItem value={3}>Wednesday</MenuItem>
              <MenuItem value={4}>Thursday</MenuItem>
              <MenuItem value={5}>Friday</MenuItem>
              <MenuItem value={6}>Saturday</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TextField
          style={{ marginTop: '5px' }}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Activity name"
          value={activity.name}
          name="name"
          onChange={handleChange}
        />
        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
          <Typography id="discrete-slider" gutterBottom>
            Type
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={activity.type}
            style={{ minWidth: '100%' }}
            name="type"
            onChange={handleChange}
          >
            <MenuItem value={1}>Lifting Weights</MenuItem>
            <MenuItem value={2}>Running</MenuItem>
            <MenuItem value={3}>Cycling</MenuItem>
            <MenuItem value={4}>Free Weights</MenuItem>
          </Select>
        </div>
        <Typography id="discrete-slider" gutterBottom>
          {displayMetric}
        </Typography>
        <FormControl className={classes.formControl}>
          <Slider
            defaultValue={activity.duration}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={120}
            name="duration"
            onChange={handleSlider}
            style={{ marginBottom: '20px' }}
          />
        </FormControl>
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isValid}
      >
        Add routine
      </Button>
    </form>
  )
};

export default withFirebase(AddRoutine);