import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    // ── Brand Palette Overrides ──
    primary: {
      main: '#1B4332',       // --brand-forest
      dark: '#2D6A4F',       // --brand-forest2
      light: '#40916C',      // --brand-forest3
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#84BC41',       // --brand-lime
      dark: '#A3CC6C',       // --brand-lime2
      light: '#C8E6A0',      // --brand-lime3
      contrastText: '#1B4332',
    },
    background: {
      default: '#F6F8F3',   // --brand-off (App body background)
      paper: '#FFFFFF',     // --brand-white (Cards, sidebar, modals)
    },
    text: {
      primary: '#1A2318',   // --brand-ink
      secondary: '#3D4F3A', // --brand-ink2
      disabled: '#9BAD98',  // --brand-ink4
    },
    // Custom Extended Palette Matching System Brand Tokens
    brand: {
      forest: '#1B4332',
      limeBg: '#F0F7E6',
      teal: '#099EC8',
      tealBg: '#E3F5FB',
      surface: '#FAFCF8',
      mapBg: '#E8F2EC',
      border: '#E4EDE1',
      border2: '#D0DEC9',
      ink3: '#6B7E68',
    },
    status: {
      amber: '#F4A522',
      amberBg: '#FEF3DA',
      red: '#E5363A',
      redBg: '#FDEDEF',
      blue: '#2F7BE8',
      blueBg: '#EBF2FD',
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'system-ui', sans-serif",
    h1: { fontSize: '19px', fontWeight: 800, letterSpacing: '-0.4px', color: '#1A2318' },
    h2: { fontSize: '13.5px', fontWeight: 700, letterSpacing: '-0.1px', color: '#1A2318' },
    body1: { fontSize: '12.5px', color: '#1A2318' },
    body2: { fontSize: '11.5px', color: '#6B7E68' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '12.5px' },
    caption: { fontSize: '10.5px', color: '#9BAD98' },
    mono: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '12px',
    },
  },
  shape: {
    borderRadius: 6, // Global generic curve limit matching sheet
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '7px 14px',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          backgroundColor: '#1B4332',
          '&:hover': { backgroundColor: '#2D6A4F' },
        },
        outlinedSecondary: {
          borderColor: '#D0DEC9',
          color: '#3D4F3A',
          backgroundColor: '#FFFFFF',
          '&:hover': { backgroundColor: '#F6F8F3', borderColor: '#6B7E68' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F6F8F3',
          color: '#9BAD98',
          fontSize: '10.5px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          borderBottom: '1px solid #E4EDE1',
        },
        body: {
          fontSize: '12.5px',
          color: '#1A2318',
          borderBottom: '1px solid #F0F5EE',
        },
      },
    },
  },
});

export default theme;