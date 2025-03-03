import { Box, Container, Typography } from '@mui/material';
import unmuteLogo from '../../assets/unmute.png';

export const AuthLayout = ({ children, title }) => (
  <Container maxWidth="xs" sx={{ 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    py: { xs: 4, sm: 8 }
  }}>
    <Box sx={{ 
      textAlign: 'center', 
      mb: { xs: 3, sm: 4 },
      animation: 'fadeIn 0.5s ease-in',
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(-20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' }
      }
    }}>
      <img src={unmuteLogo} alt="Unmute" style={{ width: '100px', maxWidth: '120px', marginBottom: '1rem' }} />
      <Typography variant="h4" sx={{ 
        fontWeight: 700,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: { xs: '1.8rem', sm: '2.2rem' }
      }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Container>
);
