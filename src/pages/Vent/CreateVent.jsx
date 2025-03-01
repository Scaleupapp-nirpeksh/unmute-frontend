// src/pages/Vent/CreateVent.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Alert, Grow } from '@mui/material';
import { ventService } from '../../services/vent';
import { useNavigate } from 'react-router-dom';

export default function CreateVent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    try {
      setLoading(true);
      setError('');
      const ventData = {
        title,
        text,
        emotion,
        hashtags: hashtags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      const res = await ventService.createVent(ventData);
      if (res.data.success) {
        navigate('/vents');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create vent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #80DEEA, #CE93D8)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 2 
      }}
    >
      <Grow in timeout={600}>
        <Card 
          sx={{ 
            width: { xs: '100%', sm: 460 }, 
            borderRadius: '20px', 
            p: 4, 
            textAlign: 'center',
            backgroundColor: '#fff'
          }}
          elevation={6}
        >
          <CardContent>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#333', mb: 3 }}>
              Create New Vent
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="What's on your mind?"
            />
            <TextField
              fullWidth
              label="Text"
              variant="outlined"
              multiline
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Share your feelings..."
            />
            <TextField
              select
              fullWidth
              label="Emotion"
              variant="outlined"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="">Select an emotion</option>
              {['Happy', 'Sad', 'Angry', 'Anxious', 'Neutral', 'Burnout'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Hashtags (comma separated)"
              variant="outlined"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              sx={{ mb: 3 }}
              placeholder="#vent, #life"
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCreate}
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem', backgroundColor: '#4a90e2' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Vent'}
            </Button>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
}
