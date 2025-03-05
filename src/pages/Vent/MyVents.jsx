// src/pages/Vent/MyVents.jsx
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, CircularProgress, Grid, Alert, Button, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Tooltip, Autocomplete, ToggleButton, ToggleButtonGroup, Pagination, Snackbar } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
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

  // User vents state
  const [vents, setVents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ventsPerPage = 5;
  const [sortType, setSortType] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline Create Vent state
  const [newVentTitle, setNewVentTitle] = useState('');
  const [newVentText, setNewVentText] = useState('');
  const [newVentEmotion, setNewVentEmotion] = useState('');
  const [newVentHashtags, setNewVentHashtags] = useState('');
  const [createVentLoading, setCreateVentLoading] = useState(false);
  const [createVentError, setCreateVentError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  // Report Dialog state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportVentId, setReportVentId] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportOtherText, setReportOtherText] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const reportReasons = ['Inappropriate Content', 'Harassment', 'Spam', 'Other'];

  // Comment Dialog state
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [activeCommentVent, setActiveCommentVent] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Fetch My Vents (filtering by current user)
  const fetchMyVents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ventService.getVents({ sort: sortType, page: currentPage, limit: 50 });
      if (res.data && res.data.vents) {
        // Compare using vent.userId._id (assuming populated user)
        const myVents = res.data.vents.filter((vent) => vent.userId && vent.userId._id === user._id);
        setVents(myVents);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your vents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchMyVents();
    }
  }, [user, currentPage, sortType]);

  // Delete vent handler
  const handleDelete = async (ventId) => {
    if (window.confirm('Are you sure you want to delete this vent?')) {
      try {
        await ventService.deleteVent(ventId);
        fetchMyVents();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete vent');
      }
    }
  };

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setCurrentPage(1);
      fetchMyVents();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await ventService.searchVents({ query: searchQuery });
      if (res.data && res.data.vents) {
        const myVents = res.data.vents.filter((vent) => vent.userId && vent.userId._id === user._id);
        setVents(myVents);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Reaction handler
  const handleReaction = async (ventId, reactionType) => {
    try {
      await ventService.reactToVent({ ventId, reactionType });
      fetchMyVents();
    } catch (err) {
      console.error('Error reacting to vent:', err);
    }
  };

  // Report dialog handlers
  const openReportDialog = (ventId) => {
    setReportVentId(ventId);
    setReportReason('');
    setReportOtherText('');
    setReportError('');
    setReportOpen(true);
  };

  const closeReportDialog = () => {
    setReportOpen(false);
  };

  const handleReport = async () => {
    if (!reportReason) {
      setReportError('Please select a reason for reporting.');
      return;
    }
    const finalReason =
      reportReason === 'Other'
        ? reportOtherText.trim() ? `Other: ${reportOtherText}` : 'Other'
        : reportReason;
    setReportLoading(true);
    setReportError('');
    try {
      await ventService.reportVent({ ventId: reportVentId, reason: finalReason });
      alert('Vent reported successfully.');
      setReportOpen(false);
    } catch (err) {
      setReportError(err.response?.data?.message || 'Failed to report vent.');
    } finally {
      setReportLoading(false);
    }
  };

  // Pagination handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Comment dialog handlers
  const openCommentDialog = (vent) => {
    setActiveCommentVent(vent);
    setCommentText('');
    setCommentError('');
    setCommentDialogOpen(true);
  };

  const closeCommentDialog = () => {
    setCommentDialogOpen(false);
    setActiveCommentVent(null);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      setCommentError('Please enter a comment.');
      return;
    }
    setCommentLoading(true);
    setCommentError('');
    try {
      await ventService.addComment({ ventId: activeCommentVent._id, text: commentText });
      // Refresh vents after adding comment
      const res = await ventService.getVents({ sort: sortType, page: currentPage, limit: 50 });
      if (res.data && res.data.vents) {
        const myVents = res.data.vents.filter((vent) => vent.userId && vent.userId._id === user._id);
        setVents(myVents);
        const updatedVent = myVents.find((v) => v._id === activeCommentVent._id);
        setActiveCommentVent(updatedVent);
      }
      setCommentText('');
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (ventId, commentId) => {
    try {
      await ventService.deleteComment(ventId, commentId);
      const res = await ventService.getVents({ sort: sortType, page: currentPage, limit: 50 });
      if (res.data && res.data.vents) {
        const myVents = res.data.vents.filter((vent) => vent.userId && vent.userId._id === user._id);
        setVents(myVents);
        const updatedVent = myVents.find((v) => v._id === ventId);
        setActiveCommentVent(updatedVent);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        No user details available.
      </Typography>
    );
  }

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

      {/* Search & Filter Bar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
          width: '100%',
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search your vents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }}>
          Search
        </Button>
      </Box>

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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', fontSize: '1.5rem' }}>
                      {vent.title}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#4a90e2', fontSize: '1rem' }}>
                      {formatDistanceToNow(new Date(vent.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  {/* Emotion & Hashtags */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
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
                  {/* Vent Text */}
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
                  {/* Reaction Buttons */}
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
                    {/* Comment Icon with Count */}
                    {vent.userId && vent.userId.allowComments && (
                      <Tooltip title="Comment">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              openCommentDialog(vent);
                            }}
                            size="small"
                          >
                            <ChatBubbleOutlineIcon />
                          </IconButton>
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            {vent.comments ? vent.comments.length : 0}
                          </Typography>
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                  {/* Delete Vent Button */}
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

      {/* Pagination */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={10} // Adjust this count as necessary
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>

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

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onClose={closeCommentDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {activeCommentVent ? `Comments for "${activeCommentVent.title}"` : 'Comments'}
        </DialogTitle>
        <DialogContent dividers>
          {activeCommentVent && activeCommentVent.comments && activeCommentVent.comments.length > 0 ? (
            activeCommentVent.comments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #ddd', position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar
                    src={comment.userId.profilePic || '/default-avatar.png'}
                    sx={{ width: 30, height: 30, mr: 1 }}
                  >
                    {comment.userId.username ? comment.userId.username.charAt(0).toUpperCase() : ''}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {comment.userId.username || 'Anonymous'}
                  </Typography>
                  <Typography variant="caption" sx={{ ml: 1, color: '#777' }}>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Typography>
                  {/* Delete Comment Button (available for my vents) */}
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', right: 0, top: 0 }}
                    onClick={() => handleCommentDelete(activeCommentVent._id, comment._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2">{comment.text}</Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#777' }}>
              No comments yet.
            </Typography>
          )}
          {commentError && <Alert severity="error" sx={{ mt: 2 }}>{commentError}</Alert>}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCommentDialog} disabled={commentLoading}>
            Close
          </Button>
          <Button onClick={handleCommentSubmit} variant="contained" disabled={commentLoading}>
            {commentLoading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        message="Vent created successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
