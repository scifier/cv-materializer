import React from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export interface FooterProps {
  title: string;
}

const Description: React.FC = () => (
  <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
    {'Built with '}
    <Link color="textPrimary" href="https://github.com/scifier/cv-materializer">
      cv-materializer
    </Link>
  </Typography>
);

const Copyright: React.FC = () => (
  <Typography variant="body2" color="textSecondary" align="center">
    {`Copyright © ${new Date().getFullYear()} `}
    <Link color="textPrimary" href="https://scifier.dev">
      scifier.dev
    </Link>
  </Typography>
);

const useStyles = makeStyles<Theme>((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(6),
  },
}));

const Footer: React.FC<FooterProps> = (props) => {
  const classes = useStyles();
  const { title } = props;

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
        <Description />
        <Copyright />
      </Container>
    </footer>
  );
};

export default Footer;
