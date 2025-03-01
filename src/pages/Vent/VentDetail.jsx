// src/pages/Vent/VentDetail.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Button, 
  CircularProgress, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions, 
  MenuItem 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import HearingIcon from '@mui/icons-material/Hearing';
import DeleteIcon from '@mui/icons-material/Delete';
import ReportIcon from '@mui/icons-material/Report';
import { useParams, useNavigate } from 'react-router-dom';
import { ventService } from '../../services/vent';
import { useAuth } from '../../contexts/AuthContext';

export default function VentDetail() {
  const { ventId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [vent, setVent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Report dialog state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportOtherText, setReportOtherText] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  // Typical reasons for reporting a vent
  const reportReasons = [
    'Inappropriate Content',
    'Harassment',
    'Spam',
    'Other'
  ];

  useEffect(() => {
    fetchVent();
    // eslint-disable-next-line
  }, [ventId]);

  const fetchVent = async () => {
    setLoading(true);
    setError('');
    try {
      // If you have a dedicated endpoint for a single vent, use it here.
      // Otherwise, fetch a list and filter by ventId.
      const res = await ventService.getVents({ page: 1, limit: 100 });
      if (res.data && res.data.vents) {
        const found = res.data.vents.find((v) => v._id === ventId);
        if (found) {
          setVent(found);
        } else {
          setError('Vent not found.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vent.');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (reactionType) => {
    try {
      await ventService.reactToVent({ ventId, reactionType });
      fetchVent(); // Refresh vent details to update reaction counts
    } catch (err) {
      console.error("Error reacting to vent:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vent?')) {
      try {
        await ventService.deleteVent(ventId);
        navigate('/myvents'); // Or navigate to VentFeed if preferred
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete vent.');
      }
    }
  };

  const openReportDialog = () => {
    setReportOpen(true);
    setReportReason('');
    setReportOtherText('');
    setReportError('');
  };

  const closeReportDialog = () => {
    setReportOpen(false);
  };

  const handleReport = async () => {
    if (!reportReason) {
      setReportError("Please select a reason for reporting.");
      return;
    }
    const finalReason = reportReason === 'Other'
      ? reportOtherText.trim() ? `Other: ${reportOtherText}` : 'Other'
      : reportReason;
      
    setReportLoading(true);
    setReportError('');
    try {
      await ventService.reportVent({ ventId, reason: finalReason });
      alert("Vent reported successfully.");
      setReportOpen(false);
    } catch (err) {
      setReportError(err.response?.data?.message || 'Failed to report vent.');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!vent) return null;

  return (
    <Box sx={{ p: 3, minHeight: '100vh', background: 'linear-gradient(135deg, #80DEEA, #CE93D8)' }}>
      <Card sx={{ maxWidth: 800, mx: 'auto', borderRadius: '20px', p: 3, backgroundColor: '#fff' }}>
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            {vent.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {vent.text}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Emotion:</strong> {vent.emotion}
          </Typography>
          {vent.hashtags && vent.hashtags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Hashtags:</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {vent.hashtags.map((tag, index) => (
                  <Typography key={index} variant="caption" sx={{ backgroundColor: '#E0F7FA', p: 0.5, borderRadius: '4px' }}>
                    #{tag}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
            {new Date(vent.createdAt).toLocaleString()}
          </Typography>
          {/* Reaction Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <IconButton onClick={() => handleReaction('heart')} size="small">
              <FavoriteIcon color="error" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {vent.reactions?.heart || 0}
              </Typography>
            </IconButton>
            <IconButton onClick={() => handleReaction('hug')} size="small">
              <SentimentVerySatisfiedIcon color="primary" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {vent.reactions?.hug || 0}
              </Typography>
            </IconButton>
            <IconButton onClick={() => handleReaction('listen')} size="small">
              <HearingIcon color="action" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {vent.reactions?.listen || 0}
              </Typography>
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {user._id === vent.userId ? (
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete Vent
              </Button>
            ) : (
              <Button variant="outlined" color="warning" startIcon={<ReportIcon />} onClick={openReportDialog}>
                Report Vent
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <Dialog open={reportOpen} onClose={closeReportDialog} fullWidth maxWidth="sm">
        <DialogTitle>Report Vent</DialogTitle>
        <DialogContent>
          {reportError && <Alert severity="error" sx={{ mb: 2 }}>{reportError}</Alert>}
          <TextField
            select
            fullWidth
            label="Reason"
            variant="outlined"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            sx={{ mb: 2 }}
          >
            {reportReasons.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {reportReason === 'Other' && (
            <TextField
              fullWidth
              label="Additional Details"
              variant="outlined"
              value={reportOtherText}
              onChange={(e) => setReportOtherText(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReportDialog} disabled={reportLoading}>
            Cancel
          </Button>
          <Button onClick={handleReport} variant="contained" disabled={reportLoading}>
            {reportLoading ? <CircularProgress size={24} /> : 'Submit Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
