// src/pages/Vent/SearchVents.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Alert, Grid, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ventService } from '../../services/vent';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, IconButton } from '@mui/material';

export default function SearchVents() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [vents, setVents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await ventService.searchVents({ query });
      if (res.data && res.data.vents) {
        setVents(res.data.vents);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #80DEEA, #CE93D8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ maxWidth: 600, width: '100%', mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search vents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ mt: 2, backgroundColor: '#4a90e2' }}>
          Search
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={2} sx={{ maxWidth: 900 }}>
          {vents.map((vent) => (
            <Grid item xs={12} key={vent._id}>
              <Grow in timeout={600}>
                <Card
                  sx={{ borderRadius: '16px', p: 2, cursor: 'pointer' }}
                  onClick={() => navigate(`/vent/${vent._id}`)}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {vent.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {vent.text}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(vent.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
