import React from 'react';
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CreateIcon from '@mui/icons-material/Create';
import GetAppIcon from '@mui/icons-material/GetApp';
import MenuIcon from '@mui/icons-material/Menu';

interface Section {
  title: string;
  url: string;
}

export interface HeaderProps {
  sections: Array<Section>;
  title?: string;
}

const projectsDisabled = ['1', 'true', 'yes'].includes(
  String(process.env.REACT_APP_PROJECTS_DISABLED).toLowerCase(),
);

const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

type MenuItemLinkProps = Omit<NavLinkProps, 'className'> & {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

const MenuItemLink = React.forwardRef<HTMLAnchorElement, MenuItemLinkProps>(
  function MenuItemLink(props, ref) {
    const { children, selected, ...rest } = props;

    return (
      <MenuItem
        component={NavLink}
        ref={ref}
        selected={selected}
        {...rest}
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        {children}
      </MenuItem>
    );
  },
);

const useStyles = makeStyles<Theme>((theme) => ({
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    color: 'inherit',
    display: 'inline-block',
  },

  activeLink: {
    fontWeight: 700,
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },

  toolbarSingleRow: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 56, // fixed height across breakpoints
    padding: theme.spacing(0, 0), // do not change with breakpoints
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },

  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    flexWrap: 'nowrap',
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexShrink: 0,
    whiteSpace: 'nowrap',
    height: 56, // keep controls vertically aligned inside the fixed header
  },

  mobileLeft: {
    display: 'flex',
    alignItems: 'center',
  },

  menuButton: {
    padding: theme.spacing(0.25),
  },
}));

const Header: React.FC<HeaderProps> = ({ sections }) => {
  const classes = useStyles();
  const location = useLocation();

  // All hooks MUST be called unconditionally
  const isProjectsMobile = useMediaQuery(`(max-width: ${projectsDisabled ? 654 : 757}px)`);
  const isTightPhone = useMediaQuery('(max-width: 348px)');

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const writeMeHref = `mailto:${process.env.REACT_APP_EMAIL}`;
  const cvHref = `${process.env.PUBLIC_URL}/${process.env.REACT_APP_NAME} CV.pdf`;
  const cvFilename = `${process.env.REACT_APP_NAME} CV.pdf`;

  const writeMeLabel = 'Write me';
  const downloadCvLabel = isTightPhone ? 'My CV' : 'Download my CV';

  const currentPath = normalizePath(location.pathname);
  const isActivePath = (url: string) => normalizePath(url) === currentPath;

  const renderSectionLink = (section: Section) => (
    <NavLink
      key={section.title}
      to={section.url}
      className={({ isActive }) =>
        `${classes.toolbarLink} ${isActive ? classes.activeLink : ''}`
      }
      aria-current={isActivePath(section.url) ? 'page' : undefined}
    >
      {section.title}
    </NavLink>
  );

  if (isProjectsMobile) {
    return (
      <Toolbar className={classes.toolbarSingleRow} component="header" disableGutters>
        <div className={classes.mobileLeft}>
          <IconButton
            aria-label="menu"
            onClick={openMenu}
            size="small"
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </div>

        <div className={classes.actions}>
          <Button
            variant="outlined"
            size="small"
            endIcon={<CreateIcon />}
            component="a"
            href={writeMeHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {writeMeLabel}
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<GetAppIcon />}
            component="a"
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
            download={cvFilename}
          >
            {downloadCvLabel}
          </Button>
        </div>

        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {sections.map((s) => (
            <MenuItemLink
              key={s.title}
              to={s.url}
              onClick={closeMenu}
              selected={isActivePath(s.url)}
            >
              {s.title}
            </MenuItemLink>
          ))}
        </Menu>
      </Toolbar>
    );
  }

  return (
    <Toolbar className={classes.toolbarSingleRow} component="header" disableGutters>
      <div className={classes.nav}>{sections.map(renderSectionLink)}</div>

      <div className={classes.actions}>
        <Button
          variant="outlined"
          size="small"
          endIcon={<CreateIcon />}
          component="a"
          href={writeMeHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {writeMeLabel}
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<GetAppIcon />}
          component="a"
          href={cvHref}
          target="_blank"
          rel="noopener noreferrer"
          download={cvFilename}
        >
          {downloadCvLabel}
        </Button>
      </div>
    </Toolbar>
  );
};

export default Header;
