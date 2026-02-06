import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import { me, experience, projects, contacts } from '../assets';
import Header from './Header';
import Banner from './Banner';
import Section from './Section';
import Footer from './Footer';

const projectsDisabled = ['1', 'true', 'yes'].includes(
  String(process.env.REACT_APP_PROJECTS_DISABLED).toLowerCase(),
);

const useStyles = makeStyles<Theme>((theme) => ({
  aboveFold: {
    minHeight: '100vh', // forces footer below the first screen
    display: 'flex',
    flexDirection: 'column',
  },
  mainGrid: {
    marginTop: theme.spacing(1),
  },
}));

const sections = [{ title: 'About me', url: '/me', contents: [me] }];

if (!projectsDisabled) {
  sections.push({ title: 'My projects', url: '/projects', contents: [projects] });
}

sections.push(
  { title: 'My experience', url: '/experience', contents: [experience] },
  { title: 'My contacts', url: '/contacts', contents: [contacts] },
);

const AppInner: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  const experienceUrl = '/experience';
  const aboutUrl = '/me';

  const isOnExperience = location.pathname.startsWith(experienceUrl);

  const bannerContents = {
    title: process.env.REACT_APP_WELCOME_MESSAGE,
    description: process.env.REACT_APP_DESCRIPTION,
    image: `${process.env.PUBLIC_URL}/logo.png`,
    imageText: process.env.REACT_APP_NAME,
    // Hero link: Experience on all pages, About only on Experience page
    linkTarget: isOnExperience ? aboutUrl : experienceUrl,
    linkText: isOnExperience ? 'About me' : 'My experience',
  };

  return (
    <>
      {/* Everything above the footer takes at least 1 viewport height */}
      <div className={classes.aboveFold}>
        <Container maxWidth="lg">
          <Header title={process.env.REACT_APP_DOMAIN} sections={sections} />
          <main>
            <Banner contents={bannerContents} />
            <Grid container spacing={5} className={classes.mainGrid}>
              <Routes>
                {sections.map((s) => (
                  <Route
                    key={`route-${s.url}`}
                    path={s.url}
                    element={<Section contents={s.contents} />}
                  />
                ))}
                <Route path="/" element={<Navigate to={sections[0].url} replace />} />
              </Routes>
            </Grid>
          </main>
        </Container>
      </div>

      {/* Footer is always below the first screen */}
      <Footer title={`${process.env.REACT_APP_NAME} Portfolio`} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Router>
        <AppInner />
      </Router>
    </>
  );
};

export default App;
