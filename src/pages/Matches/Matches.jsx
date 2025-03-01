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
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../../services/match';

export default function Matches() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [pendingMatches, setPendingMatches] = useState({ received: [], sent: [] });
  const [history, setHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch match data once the user is available
  useEffect(() => {
    if (user && user._id) {
      fetchMatchSuggestions();
      fetchPendingMatches();
      fetchMatchHistory();
    }
  }, [user]);

  const fetchMatchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await matchService.getMatchSuggestions();
      if (res.data && res.data.matches) {
        setMatches(res.data.matches);
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

  // Render a match suggestion card with actions for accept/reject
  const renderMatchCard = (match) => {
    // Determine the matched user (the other user)
    let matchedUser = {};
    if (match.user1._id === user._id) {
      matchedUser = match.user2;
    } else {
      matchedUser = match.user1;
    }
    return (
      <Grid item xs={12} sm={6} md={4} key={match._id}>
        <Card sx={{ borderRadius: '16px', p: 2, mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={matchedUser.profilePic || '/default-avatar.png'}
                sx={{ width: 56, height: 56, mr: 2 }}
              >
                {matchedUser.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6">{matchedUser.username}</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Match Score: {match.matchScore.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {match.commonEmotions && match.commonEmotions.map((emotion, idx) => (
                <Chip key={idx} label={emotion} size="small" />
              ))}
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

  // Render cards for pending matches (received and sent)
  const renderPendingCard = (match, type) => {
    // type: "received" or "sent"
    return (
      <Grid item xs={12} sm={6} md={4} key={match.matchId}>
        <Card sx={{ borderRadius: '16px', p: 2, mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {type === 'received' ? `From: ${match.from}` : `To: ${match.to}`}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Match Score: {match.matchScore.toFixed(2)}
            </Typography>
            <Chip label={match.status} size="small" />
          </CardContent>
        </Card>
      </Grid>
    );
  };

  // Render cards for match history
  const renderHistoryCard = (entry) => {
    return (
      <Grid item xs={12} sm={6} md={4} key={entry.matchId}>
        <Card sx={{ borderRadius: '16px', p: 2, mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {entry.user1} & {entry.user2}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Score: {entry.matchScore.toFixed(2)}
            </Typography>
            <Typography variant="body2">Status: {entry.status}</Typography>
            <Typography variant="caption">
              {new Date(entry.timestamp).toLocaleString()}
            </Typography>
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
            <Grid container spacing={2}>
              {matches.length > 0 ? matches.map(renderMatchCard) : (
                <Typography variant="body1" sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                  No match suggestions available.
                </Typography>
              )}
            </Grid>
          )}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Received Matches</Typography>
              <Grid container spacing={2}>
                {pendingMatches.received && pendingMatches.received.length > 0 ? pendingMatches.received.map(match => renderPendingCard(match, 'received')) : (
                  <Typography variant="body1" sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    No pending received matches.
                  </Typography>
                )}
              </Grid>
              <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>Sent Matches</Typography>
              <Grid container spacing={2}>
                {pendingMatches.sent && pendingMatches.sent.length > 0 ? pendingMatches.sent.map(match => renderPendingCard(match, 'sent')) : (
                  <Typography variant="body1" sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
                    No pending sent matches.
                  </Typography>
                )}
              </Grid>
            </Box>
          )}
          {tabValue === 2 && (
            <Grid container spacing={2}>
              {history.length > 0 ? history.map(renderHistoryCard) : (
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
    </Box>
  );
}
