// src/pages/Vent/VentLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

export default function VentLayout() {
  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: 'linear-gradient(135deg, #80DEEA, #CE93D8)' }}>
      {/* Vent Sub‑Navigation */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button component={Link} to="/vents" variant="contained" sx={{ backgroundColor: '#4a90e2' }}>
          Vent Feed
        </Button>
        <Button component={Link} to="/vent/create" variant="contained" sx={{ backgroundColor: '#4a90e2' }}>
          Create Vent
        </Button>
        <Button component={Link} to="/vent/search" variant="contained" sx={{ backgroundColor: '#4a90e2' }}>
          Search Vents
        </Button>
        <Button component={Link} to="/myvents" variant="contained" sx={{ backgroundColor: '#4a90e2' }}>
          My Vents
        </Button>
      </Box>
      {/* Render nested vent pages */}
      <Outlet />
    </Box>
  );
}
