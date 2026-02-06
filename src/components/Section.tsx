import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import MarkdownRender from './MarkdownRender';

export interface SectionProps {
  contents: Array<string>;
}

const useStyles = makeStyles<Theme>((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(2, 0),
  },
}));

const Section: React.FC<SectionProps> = (props) => {
  const classes = useStyles();
  const { contents } = props;

  const [fetchedContents, setFetchedContents] = useState<Array<string>>([]);

  useEffect(() => {
    let cancelled = false;

    // Clear previous page content immediately
    setFetchedContents([]);

    Promise.all(contents.map((c) => fetch(c).then((response) => response.text())))
      .then((responses) => {
        if (!cancelled) {
          setFetchedContents(responses);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFetchedContents(['']);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contents]);

  return (
    <Grid item xs={12} md={12}>
      {fetchedContents.map((md: string, idx) => (
        <div key={`${contents[idx]}-${md.substring(0, 20)}`}>
          <MarkdownRender className={classes.markdown}>{md}</MarkdownRender>
        </div>
      ))}
    </Grid>
  );
};

export default Section;
