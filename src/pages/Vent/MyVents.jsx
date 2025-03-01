// src/pages/Vent/MyVents.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import HearingIcon from '@mui/icons-material/Hearing';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useNavigate } from 'react-router-dom';
import { ventService } from '../../services/vent';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

// Define a mapping for emotions with colors and icons
const emotionMapping = {
  Happy: {
    color: '#FFD700',
    icon: <EmojiEmotionsIcon sx={{ color: '#FFD700', verticalAlign: 'middle' }} />,
  },
  Sad: {
    color: '#2196F3',
    icon: <MoodBadIcon sx={{ color: '#2196F3', verticalAlign: 'middle' }} />,
  },
  Angry: {
    color: '#F44336',
    icon: <WhatshotIcon sx={{ color: '#F44336', verticalAlign: 'middle' }} />,
  },
  Anxious: {
    color: '#FF9800',
    icon: <SentimentDissatisfiedIcon sx={{ color: '#FF9800', verticalAlign: 'middle' }} />,
  },
  Neutral: {
    color: '#9E9E9E',
    icon: <SentimentNeutralIcon sx={{ color: '#9E9E9E', verticalAlign: 'middle' }} />,
  },
  Burnout: {
    color: '#6D4C41',
    icon: <LocalFireDepartmentIcon sx={{ color: '#6D4C41', verticalAlign: 'middle' }} />,
  },
};

export default function MyVents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vents, setVents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user._id) {
      fetchMyVents();
    }
  }, [user]);

  const fetchMyVents = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch vents using the same endpoint as VentFeed
      const res = await ventService.getVents({ sort: 'recent', page: 1, limit: 50 });
      if (res.data && res.data.vents) {
        // Filter vents to only include those created by the current user.
        const myVents = res.data.vents.filter((vent) => vent.userId === user._id);
        setVents(myVents);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your vents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ventId) => {
    if (window.confirm('Are you sure you want to delete this vent?')) {
      try {
        await ventService.deleteVent(ventId);
        // Refetch vents after deletion
        fetchMyVents();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete vent');
      }
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #80DEEA, #CE93D8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4, color: '#333', fontWeight: 700 }}>
        My Vents
      </Typography>

      {/* Vents Grid */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : vents.length === 0 ? (
        <Typography variant="body1" sx={{ color: '#555', mb: 3, fontSize: '1.2rem' }}>
          You haven't created any vents yet.
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ maxWidth: 900 }}>
          {vents.map((vent) => (
            <Grid item xs={12} key={vent._id}>
              <Card
                sx={{
                  borderRadius: '16px',
                  p: 2,
                  position: 'relative',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                }}
                onClick={() => navigate(`/vent/${vent._id}`)}
              >
                <CardContent>
                  {/* Title and Relative Time */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', fontSize: '1.5rem' }}>
                      {vent.title}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#4a90e2', fontSize: '1rem' }}>
                      {formatDistanceToNow(new Date(vent.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>

                  {/* Emotion and Hashtags */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {vent.emotion && emotionMapping[vent.emotion] && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {emotionMapping[vent.emotion].icon}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: emotionMapping[vent.emotion].color,
                            fontSize: '1.2rem',
                          }}
                        >
                          {vent.emotion}
                        </Typography>
                      </Box>
                    )}
                    {vent.hashtags && vent.hashtags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {vent.hashtags.map((tag, index) => (
                          <Chip key={index} label={`#${tag}`} size="small" sx={{ backgroundColor: '#e1bee7', color: '#333' }} />
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Vent Text Container */}
                  <Box
                    sx={{
                      maxHeight: 150,
                      overflowY: 'auto',
                      mb: 2,
                      textAlign: 'left',
                      backgroundColor: '#f5f5f5',
                      p: 1,
                      borderRadius: '8px',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                    }}
                  >
                    <Typography variant="body1">{vent.text}</Typography>
                  </Box>

                  {/* Reaction Counts */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FavoriteIcon color="error" />
                      <Typography variant="caption">{vent.reactions?.heart || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SentimentVerySatisfiedIcon color="primary" />
                      <Typography variant="caption">{vent.reactions?.hug || 0}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <HearingIcon color="action" />
                      <Typography variant="caption">{vent.reactions?.listen || 0}</Typography>
                    </Box>
                  </Box>

                  {/* Delete Button */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(vent._id);
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    aria-label="delete"
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create New Vent Button */}
      <Button
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: '#4a90e2',
          textTransform: 'none',
          fontSize: '1.2rem',
          px: 3,
          py: 1,
        }}
        onClick={() => navigate('/vent/create')}
      >
        Create New Vent
      </Button>
    </Box>
  );
}
