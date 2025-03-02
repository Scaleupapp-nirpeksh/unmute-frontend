// src/pages/Matches/Matches.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../../services/match';
import { authService } from '../../services/auth';

// Define a mapping for emotions with their colors and labels
const emotionMapping = {
  Happy: { color: '#FFD700', label: 'Happy' },
  Sad: { color: '#2196F3', label: 'Sad' },
  Angry: { color: '#F44336', label: 'Angry' },
  Anxious: { color: '#FF9800', label: 'Anxious' },
  Neutral: { color: '#9E9E9E', label: 'Neutral' },
  Burnout: { color: '#6D4C41', label: 'Burnout' },
};

export default function Matches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [pendingMatches, setPendingMatches] = useState({ received: [], sent: [] });
  const [history, setHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // State for the profile dialog pop-up
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Fetch match data once the user is available
  useEffect(() => {
    if (user && user._id) {
      fetchMatchSuggestions();
      fetchPendingMatches();
      fetchMatchHistory();
    }
  }, [user]);

  // Fetch suggestions from the backend then filter out any match where the logged in user has accepted.
  const fetchMatchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await matchService.getMatchSuggestions();
      if (res.data && res.data.matches) {
        // Filter out matches that the logged in user has already accepted.
        const filteredMatches = res.data.matches.filter(match => {
          // If user is user1, ensure user1Accepted is false.
          if (match.user1._id === user._id) {
            return !match.user1Accepted;
          } else {
            // Otherwise, user is user2: ensure user2Accepted is false.
            return !match.user2Accepted;
          }
        });
        setMatches(filteredMatches);
      }
    } catch (error) {
      console.error('Error fetching match suggestions', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingMatches = async () => {
    try {
      const res = await matchService.getPendingMatches();
      if (res.data && res.data.success) {
        setPendingMatches({
          received: res.data.receivedMatches,
          sent: res.data.sentMatches,
        });
      }
    } catch (error) {
      console.error('Error fetching pending matches', error);
    }
  };

  const fetchMatchHistory = async () => {
    try {
      const res = await matchService.getMatchHistory();
      if (res.data && res.data.history) {
        setHistory(res.data.history);
      }
    } catch (error) {
      console.error('Error fetching match history', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      const res = await matchService.acceptMatch({ matchId });
      if (res.data && res.data.success) {
        setSnackbar({ open: true, message: 'Match accepted!', severity: 'success' });
        // Refresh the lists
        fetchMatchSuggestions();
        fetchPendingMatches();
      }
    } catch (error) {
      console.error('Error accepting match', error);
      setSnackbar({ open: true, message: 'Failed to accept match', severity: 'error' });
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      const res = await matchService.rejectMatch({ matchId });
      if (res.data && res.data.success) {
        setSnackbar({ open: true, message: 'Match rejected', severity: 'success' });
        // Refresh the lists
        fetchMatchSuggestions();
        fetchPendingMatches();
      }
    } catch (error) {
      console.error('Error rejecting match', error);
      setSnackbar({ open: true, message: 'Failed to reject match', severity: 'error' });
    }
  };

  // Open profile dialog by fetching user details using authService
  const handleOpenProfile = async (userId) => {
    try {
      const res = await authService.getUserDetails(userId);
      if (res.data && res.data.user) {
        setProfileData(res.data.user);
        setOpenProfileDialog(true);
      }
    } catch (error) {
      console.error('Error fetching profile details', error);
    }
  };

  const handleCloseProfileDialog = () => {
    setOpenProfileDialog(false);
    setProfileData(null);
  };

  // Render a match suggestion card with enhanced visuals
  const renderMatchCard = (match) => {
    // Determine the matched user (the other user)
    let matchedUser = match.user1._id === user._id ? match.user2 : match.user1;
    return (
      <Grid item xs={12} sm={6} md={4} key={match._id}>
        <Card
          sx={{
            borderRadius: '16px',
            p: 2,
            mb: 2,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar
                src={matchedUser.profilePic || '/default-avatar.png'}
                sx={{ width: 56, height: 56, mr: 2, cursor: 'pointer' }}
                onClick={() => handleOpenProfile(matchedUser._id)}
              >
                {matchedUser.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': { color: 'primary.main' },
                }}
                onClick={() => handleOpenProfile(matchedUser._id)}
              >
                {matchedUser.username}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Match Score: {match.matchScore.toFixed(2)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={match.matchScore * 100}
              sx={{ height: 8, borderRadius: 4, mb: 1 }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: 1 }}>
              {match.commonEmotions &&
                match.commonEmotions.map((emotion, idx) => {
                  const emotionData = emotionMapping[emotion] || { color: '#000', label: emotion };
                  return (
                    <Chip
                      key={idx}
                      label={emotionData.label}
                      size="small"
                      sx={{ backgroundColor: emotionData.color, color: '#fff' }}
                    />
                  );
                })}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" onClick={() => handleAcceptMatch(match._id)}>
                Accept
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleRejectMatch(match._id)}>
                Reject
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // Render pending and history cards similarly
  const renderPendingCard = (match, type) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={match.matchId}>
        <Card
          sx={{
            borderRadius: '16px',
            p: 2,
            mb: 2,
            boxShadow: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' },
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={() => handleOpenProfile(type === 'received' ? match.fromId : match.toId)}
            >
              {type === 'received' ? `From: ${match.from}` : `To: ${match.to}`}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Match Score: {match.matchScore.toFixed(2)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={match.matchScore * 100}
              sx={{ height: 8, borderRadius: 4, mb: 1 }}
            />
            <Chip label={match.status} size="small" />
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const renderHistoryCard = (entry) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={entry.matchId}>
        <Card
          sx={{
            borderRadius: '16px',
            p: 2,
            mb: 2,
            boxShadow: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' },
          }}
        >
          <CardContent>
            <Typography variant="h6">{entry.user1} & {entry.user2}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Score: {entry.matchScore.toFixed(2)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={entry.matchScore * 100}
              sx={{ height: 8, borderRadius: 4, mb: 1 }}
            />
            <Typography variant="body2">Status: {entry.status}</Typography>
            <Typography variant="caption">{new Date(entry.timestamp).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: 'linear-gradient(135deg, #80DEEA, #CE93D8)' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#333', textAlign: 'center' }}>
        Matches
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Suggestions" />
        <Tab label="Pending" />
        <Tab label="History" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <Grid container spacing={2} justifyContent="center">
              {matches.length > 0 ? (
                matches.map(renderMatchCard)
              ) : (
                <Typography variant="body1" sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                  No match suggestions available.
                </Typography>
              )}
            </Grid>
          )}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Received Matches</Typography>
              <Grid container spacing={2} justifyContent="center">
                {pendingMatches.received && pendingMatches.received.length > 0 ? (
                  pendingMatches.received.map((match) => renderPendingCard(match, 'received'))
                ) : (
                  <Typography variant="body1" sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    No pending received matches.
                  </Typography>
                )}
              </Grid>
              <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>Sent Matches</Typography>
              <Grid container spacing={2} justifyContent="center">
                {pendingMatches.sent && pendingMatches.sent.length > 0 ? (
                  pendingMatches.sent.map((match) => renderPendingCard(match, 'sent'))
                ) : (
                  <Typography variant="body1" sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    No pending sent matches.
                  </Typography>
                )}
              </Grid>
            </Box>
          )}
          {tabValue === 2 && (
            <Grid container spacing={2} justifyContent="center">
              {history.length > 0 ? (
                history.map(renderHistoryCard)
              ) : (
                <Typography variant="body1" sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                  No match history available.
                </Typography>
              )}
            </Grid>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* User Profile Dialog */}
      <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog} fullWidth maxWidth="sm">
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {profileData ? (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Avatar
                src={profileData.profilePic || '/default-avatar.png'}
                sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
              >
                {profileData.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {profileData.username}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {profileData.bio || 'No bio provided.'}
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Interests</Typography>
                {profileData.interests && profileData.interests.length > 0 ? (
                  profileData.interests.map((interest, idx) => (
                    <Chip key={idx} label={interest} sx={{ m: 0.5 }} />
                  ))
                ) : (
                  <Typography variant="body2">Not specified.</Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Likes</Typography>
                {profileData.likes && profileData.likes.length > 0 ? (
                  profileData.likes.map((like, idx) => (
                    <Chip key={idx} label={like} sx={{ m: 0.5, backgroundColor: '#B5FFFC' }} />
                  ))
                ) : (
                  <Typography variant="body2">Not specified.</Typography>
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle1">Dislikes</Typography>
                {profileData.dislikes && profileData.dislikes.length > 0 ? (
                  profileData.dislikes.map((dislike, idx) => (
                    <Chip key={idx} label={dislike} sx={{ m: 0.5, backgroundColor: '#FFE7A6' }} />
                  ))
                ) : (
                  <Typography variant="body2">Not specified.</Typography>
                )}
              </Box>
            </Box>
          ) : (
            <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
