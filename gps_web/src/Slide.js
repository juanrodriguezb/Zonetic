import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  root: {width: 300, }, margin: {height: theme.spacing(3),},
}));

const marks = [
  { value: 0, label: '0°C',},{value: 20, label: '20°C',},{value: 37, label: '37°C', }, {value: 100,label: '100°C',},
];


function valuetext(value) {
  return `${value}`;
}

export default function DiscreteSlider({marks, visible, step, getAriaValueText}) {
  const classes = useStyles();
  console.log('marks')
  console.log(marks)

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-always" gutterBottom>
        Always visible
      </Typography>
      <Slider
        //defaultValue={80}
        visible={visible}
        getAriaValueText={getAriaValueText}
        aria-labelledby="discrete-slider-always"
        step={step}
        marks={marks}
        valueLabelDisplay="on"
      />
    </div>
  );
}