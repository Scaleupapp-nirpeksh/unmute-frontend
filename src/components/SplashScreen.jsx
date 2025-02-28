import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import unmuteLogo from '../assets/unmute.png';

// Container fade-out after some delay
const fadeOutContainer = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

// Logo fade-in (with scale)
const fadeInLogo = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

// Tagline fade-in (slight upward motion)
const fadeInTagline = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show the splash for ~3 seconds, then fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Additional delay for fade-out
      setTimeout(() => {
        onFinish(); 
      }, 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Box
      sx={{
        // Full screen overlay
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#4a90e2', // from your updated logo color
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        // Fade out the entire container if fadeOut is true
        animation: fadeOut
          ? `${fadeOutContainer} 0.8s forwards ease-in-out`
          : 'none',
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src={unmuteLogo}
        alt="Unmute Logo"
        sx={{
          // 50% bigger than the previous ~160/220
          width: { xs: 240, sm: 330 },
          mb: 2,
          opacity: 0, // Start hidden
          animation: `${fadeInLogo} 1s forwards ease-in-out`,
        }}
      />

      {/* Tagline */}
      <Typography
        variant="h4"
        sx={{
          // Use a handwritten font, e.g. 'Dancing Script', ensure it's imported
          fontFamily: '"Dancing Script", cursive',
          fontWeight: 600,
          color: '#fff',
          textAlign: 'center',
          px: 3,
          opacity: 0,
          animation: `${fadeInTagline} 1s forwards ease-in-out`,
          animationDelay: '0.7s',
        }}
      >
        Because silence shouldn't be the only option
      </Typography>
    </Box>
  );
}
