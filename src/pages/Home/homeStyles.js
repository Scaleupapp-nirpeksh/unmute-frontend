import { alpha } from '@mui/material/styles';

export const homeStyles = () => ({
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    position: 'sticky',
    top: 0,
    backgroundColor: alpha('#fff', 0.8),
    backdropFilter: 'blur(10px)',
    zIndex: 1000
  },
  logo: {
    height: '40px'
  },
  heroImage: {
    height: '500px',
    borderRadius: '20px',
    background: `linear-gradient(45deg, ${alpha('#2196F3', 0.1)}, ${alpha('#21CBF3', 0.1)}),
    url('https://source.unsplash.com/random?mindfulness') center/cover`
  }
});