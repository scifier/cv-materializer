import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Custom Material UI Theme
export default createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});
