import React from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

export interface BannerProps {
  contents: {
    title?: string;
    date?: string;
    description?: string;
    image?: string;
    imageText?: string;
    linkTarget?: string;
    linkText?: string;
  };
}

const useStyles = makeStyles<Theme>((theme) => ({
  banner: {
    position: 'relative',
    marginBottom: theme.spacing(1),
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
    backgroundPosition: 'center right -10%',
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    textShadow: '#bbb 0px 0px 3px, #bbb 0px 0px 3px, #bbb 0px 0px 3px, #bbb 0px 0px 3px',
    '-webkit-font-smoothing': 'antialiased',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  bannerContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
}));

const Banner: React.FC<BannerProps> = (props) => {
  const classes = useStyles();
  const { contents } = props;
  return (
    <Paper className={classes.banner} style={{ backgroundImage: `url(${contents.image})` }}>
      {/* Increase the priority of the hero background image */}
      <img style={{ display: 'none' }} src={contents.image} alt={contents.imageText} />
      <div className={classes.overlay} />
      <Grid container>
        <Grid item md={6}>
          <div className={classes.bannerContent}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              {contents.title}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              {contents.description}
            </Typography>
            <Link variant="subtitle1" color="textSecondary" href={contents.linkTarget}>
              {contents.linkText}
            </Link>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Banner;
