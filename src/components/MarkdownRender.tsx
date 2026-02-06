import React from 'react';
import Markdown from 'markdown-to-jsx';
import { withStyles, WithStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link, { LinkProps } from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import PublicIcon from '@mui/icons-material/Public';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const styles = (theme: Theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const decorableLinks = [
  { name: 'email', icon: EmailIcon, prefix: /^mailto:/i },
  { name: 'github', icon: GitHubIcon, prefix: /^(https?:\/\/)?(www.)?github.com\//i },
  { name: 'linkedin', icon: LinkedInIcon, prefix: /^(https?:\/\/)?(www.)?linkedin.com\/in\//i },
  { name: 'facebook', icon: FacebookIcon, prefix: /^(https?:\/\/)?(www.)?facebook.com\//i },
  { name: 'website', icon: PublicIcon, prefix: /^(https:\/\/)(www.)?/i },
];

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h5' },
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h6' },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: 'caption', paragraph: true },
    },
    p: {
      component: Typography,
      props: { paragraph: true },
    },
    a: {
      component: (props: LinkProps & { href: string; children: Array<string> }): JSX.Element => {
        const decorableLink = decorableLinks.find(({ name }) => name === props.title);
        if (
          decorableLink &&
          decorableLink.prefix.test(props.href) &&
          new RegExp(`${props.children[0]}$`, 'i').test(props.href)
        ) {
          return (
            <Grid container spacing={1} key={props.title} alignItems="stretch">
              <Grid item>
                <decorableLink.icon />
              </Grid>
              <Grid item>
                <Link
                  display="block"
                  variant="body1"
                  href={props.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.children[0]}
                </Link>
              </Grid>
            </Grid>
          );
        }
        return <Link target="_blank" rel="noopener noreferrer" {...props} />;
      },
    },
    li: {
      component: withStyles(styles)(({ classes, ...props }: WithStyles<typeof styles>) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      )),
    },
  },
};

interface MarkdownRenderProps extends React.PropsWithChildren {
  className?: string;
}

const MarkdownRender: React.FC<MarkdownRenderProps> = ({ className, children }) => {
  return (
    <div className={className}>
      <Markdown options={options}>{children as string}</Markdown>
    </div>
  );
};

export default MarkdownRender;
