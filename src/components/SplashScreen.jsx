import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import unmuteLogo from '../assets/logo.png';

/* --- 1) Container Fade-Out ---
   Fades the entire splash screen after the set duration.
*/
const fadeOutContainer = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`;

/* --- 2) Logo Bounce-In ---
   A fun, bouncy entrance animation for the logo.
*/
const bounceInLogo = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(200px);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) translateY(-20px);
  }
  70% {
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

/* --- 3) Tagline Fade-In/Up ---
   Gently fades in text from below.
*/
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* --- 4) Floating Particle Animation ---
   Applies to both bubbles and emoji particles.
*/
const bubbleFloat = keyframes`
  0% {
    transform: translateY(0) scale(0.9);
    opacity: 0;
  }
  20% {
    opacity: 0.3;
  }
  60% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) scale(1.1);
    opacity: 0;
  }
`;

/*
  BUBBLES: Simple circular particles.
*/
const BUBBLES = [
  { left: '8%',  size: 50, delay: '0s',  duration: '14s', color: 'rgba(255, 255, 255, 0.15)' },
  { left: '20%', size: 70, delay: '2s',  duration: '16s', color: 'rgba(255, 255, 255, 0.2)'  },
  { left: '40%', size: 60, delay: '4s',  duration: '18s', color: 'rgba(255, 255, 255, 0.15)' },
  { left: '65%', size: 80, delay: '3s',  duration: '20s', color: 'rgba(255, 255, 255, 0.12)' },
  { left: '85%', size: 40, delay: '1s',  duration: '15s', color: 'rgba(255, 255, 255, 0.25)' },
];

/*
  EXTRA_PARTICLES: Additional emoji particles to evoke happiness and celebration.
  Feel free to change these emojis as desired.
*/
const EXTRA_PARTICLES = [
  { left: '15%', size: 40, delay: '1s', duration: '16s', content: '😊' },
  { left: '35%', size: 50, delay: '0s', duration: '18s', content: '👏' },
  { left: '60%', size: 40, delay: '2s', duration: '15s', content: '🎉' },
  { left: '80%', size: 45, delay: '3s', duration: '17s', content: '💖' },
];

export default function SplashScreen({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Display splash for 5 seconds, then fade out for 1 second
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onFinish();
      }, 1000);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        /*
          Radial Gradient:
          - The center is your logo’s color (#4a90e2) so that it blends perfectly around the logo.
          - From 40% onward, it gradually transitions into a lighter complementary tone (#80DEEA).
        */
        background: 'radial-gradient(circle at center, #4a90e2 0%, #4a90e2 40%, #80DEEA 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 },
        ...(fadeOut && {
          animation: `${fadeOutContainer} 1s forwards ease-in-out`,
        }),
      }}
    >
      {/* Render Bubbles */}
      {BUBBLES.map((bubble, index) => (
        <Box
          key={`bubble-${index}`}
          sx={{
            position: 'absolute',
            bottom: '-60px',
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            backgroundColor: bubble.color,
            animation: `${bubbleFloat} ${bubble.duration} ease-out infinite`,
            animationDelay: bubble.delay,
            zIndex: 1,
          }}
        />
      ))}

      {/* Render Extra Emoji Particles */}
      {EXTRA_PARTICLES.map((particle, index) => (
        <Typography
          key={`emoji-${index}`}
          sx={{
            position: 'absolute',
            bottom: '-60px',
            left: particle.left,
            fontSize: particle.size,
            animation: `${bubbleFloat} ${particle.duration} ease-out infinite`,
            animationDelay: particle.delay,
            zIndex: 1,
          }}
        >
          {particle.content}
        </Typography>
      ))}

      {/* Logo (responsive sizes) */}
      <Box
        component="img"
        src={unmuteLogo}
        alt="Unmute Logo"
        sx={{
          width: { xs: 150, sm: 200, md: 300 },
          mb: { xs: 2, sm: 3 },
          opacity: 0,
          animation: `${bounceInLogo} 1.8s forwards ease-out`,
          zIndex: 2,
        }}
      />

      {/* Primary Tagline */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: '"Comic Neue", "Comic Sans MS", cursive',
          fontWeight: 700,
          color: '#fff',
          textAlign: 'center',
          mb: { xs: 1, sm: 2 },
          opacity: 0,
          animation: `${fadeInUp} 1.5s forwards ease-in-out`,
          animationDelay: '1.8s',
          zIndex: 2,
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
        }}
      >
        Speak Freely, Heal Faster
      </Typography>

      {/* Secondary Tagline */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Comic Neue", "Comic Sans MS", cursive',
          fontWeight: 500,
          color: '#fff',
          textAlign: 'center',
          px: { xs: 1, sm: 3 },
          opacity: 0,
          animation: `${fadeInUp} 1.5s forwards ease-in-out`,
          animationDelay: '2.5s',
          zIndex: 2,
          fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
        }}
      >
        Because silence shouldn't be the only option.
      </Typography>
    </Box>
  );
}
