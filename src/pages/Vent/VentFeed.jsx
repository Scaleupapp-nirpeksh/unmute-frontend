// src/pages/Vent/VentFeed.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  Chip,
  Grid,
  Alert,
  MenuItem,
  Tooltip,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Snackbar,
  Grow,
  InputAdornment,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import HearingIcon from '@mui/icons-material/Hearing';
import ReportIcon from '@mui/icons-material/Report';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { ventService } from '../../services/vent';
import { useNavigate } from 'react-router-dom';

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

export default function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // User details state
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Settings dialog state
  const [openSettings, setOpenSettings] = useState(false);
  const [formUsername, setFormUsername] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formInterests, setFormInterests] = useState([]);
  const [formLikes, setFormLikes] = useState([]);
  const [formDislikes, setFormDislikes] = useState([]);
  const [formMatchPreference, setFormMatchPreference] = useState('');
  const [formAnonymousChat, setFormAnonymousChat] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // Latest vents state with pagination
  const [vents, setVents] = useState([]);
  const [ventsLoading, setVentsLoading] = useState(true);
  const [ventsError, setVentsError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ventsPerPage = 5;

  // Report dialog state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportVentId, setReportVentId] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportOtherText, setReportOtherText] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const reportReasons = ['Inappropriate Content', 'Harassment', 'Spam', 'Other'];

  // Success Snackbar state for vent creation
  const [successOpen, setSuccessOpen] = useState(false);

  // *** Missing state variables for search and sort ***
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('recent');

  // *** Missing settings handler ***
  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  // Fetch user details on mount
  useEffect(() => {
    if (!user || !user._id) {
      navigate('/login');
      return;
    }
    const fetchUserDetails = async () => {
      try {
        const res = await authService.getUserDetails(user._id);
        if (res.data && res.data.user) {
          setUserDetails(res.data.user);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [user, navigate]);

  // Fetch vents with pagination
  useEffect(() => {
    const fetchVents = async () => {
      setVentsLoading(true);
      setVentsError('');
      try {
        const res = await ventService.getVents({ sort: sortType, page: currentPage, limit: ventsPerPage });
        if (res.data && res.data.vents) {
          setVents(res.data.vents);
        }
      } catch (err) {
        setVentsError(err.response?.data?.message || 'Failed to fetch vents');
      } finally {
        setVentsLoading(false);
      }
    };
    fetchVents();
  }, [currentPage, sortType]);

  // Inline Create Vent Section state
  const [newVentTitle, setNewVentTitle] = useState('');
  const [newVentText, setNewVentText] = useState('');
  const [newVentEmotion, setNewVentEmotion] = useState('');
  const [newVentHashtags, setNewVentHashtags] = useState('');
  const [createVentLoading, setCreateVentLoading] = useState(false);
  const [createVentError, setCreateVentError] = useState('');

  // Inline Create Vent handler
  const handleCreateVent = async () => {
    if (!newVentTitle.trim() || !newVentText.trim() || !newVentEmotion) {
      setCreateVentError('Please fill in all required fields.');
      return;
    }
    setCreateVentLoading(true);
    setCreateVentError('');
    const ventData = {
      title: newVentTitle,
      text: newVentText,
      emotion: newVentEmotion,
      hashtags: newVentHashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    try {
      const res = await ventService.createVent(ventData);
      if (res.data.success) {
        // Show success message with animation
        setSuccessOpen(true);
        // Clear the creation form
        setNewVentTitle('');
        setNewVentText('');
        setNewVentEmotion('');
        setNewVentHashtags('');
        // Refresh vent feed
        setCurrentPage(1);
        const resVents = await ventService.getVents({ sort: sortType, page: 1, limit: ventsPerPage });
        if (resVents.data && resVents.data.vents) {
          setVents(resVents.data.vents);
        }
      }
    } catch (err) {
      setCreateVentError(err.response?.data?.message || 'Failed to create vent');
    } finally {
      setCreateVentLoading(false);
    }
  };

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setCurrentPage(1);
      const res = await ventService.getVents({ sort: sortType, page: 1, limit: ventsPerPage });
      if (res.data && res.data.vents) {
        setVents(res.data.vents);
      }
      return;
    }
    setVentsLoading(true);
    setVentsError('');
    try {
      const res = await ventService.searchVents({ query: searchQuery });
      if (res.data && res.data.vents) {
        setVents(res.data.vents);
      }
    } catch (err) {
      setVentsError(err.response?.data?.message || 'Search failed');
    } finally {
      setVentsLoading(false);
    }
  };

  // Reaction handler
  const handleReaction = async (ventId, reactionType) => {
    try {
      await ventService.reactToVent({ ventId, reactionType });
      const res = await ventService.getVents({ sort: sortType, page: currentPage, limit: ventsPerPage });
      if (res.data && res.data.vents) {
        setVents(res.data.vents);
      }
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

  // While loading user details, show spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
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
     

      {/* Inline Create Vent Section */}
      <Card
        elevation={6}
        sx={{
          borderRadius: '20px',
          p: 2,
          maxWidth: 900,
          width: '100%',
          backgroundColor: '#fff',
          mb: 4,
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', mb: 2, textAlign: 'center' }}>
            What's on your mind?
          </Typography>
          {createVentError && <Alert severity="error" sx={{ mb: 2 }}>{createVentError}</Alert>}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={newVentTitle}
            onChange={(e) => setNewVentTitle(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Enter a title"
          />
          <TextField
            fullWidth
            label="Vent Text"
            variant="outlined"
            multiline
            rows={4}
            value={newVentText}
            onChange={(e) => setNewVentText(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Share your feelings..."
          />
          <TextField
            select
            fullWidth
            label="Emotion"
            variant="outlined"
            value={newVentEmotion}
            onChange={(e) => setNewVentEmotion(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Select an emotion</MenuItem>
            {['Happy', 'Sad', 'Angry', 'Anxious', 'Neutral', 'Burnout'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Hashtags (comma separated)"
            variant="outlined"
            value={newVentHashtags}
            onChange={(e) => setNewVentHashtags(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="#vent, #life"
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCreateVent}
            disabled={createVentLoading}
            sx={{ py: 1.5, fontSize: '1rem', backgroundColor: '#4a90e2' }}
          >
            {createVentLoading ? <CircularProgress size={24} /> : 'Post Vent'}
          </Button>
        </CardContent>
      </Card>

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
          placeholder="Search vents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
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
        <Box>
          <Button
            variant={sortType === 'recent' ? 'contained' : 'outlined'}
            onClick={() => setSortType('recent')}
            sx={{ mr: 1 }}
          >
            Recent
          </Button>
          <Button
            variant={sortType === 'trending' ? 'contained' : 'outlined'}
            onClick={() => setSortType('trending')}
          >
            Trending
          </Button>
        </Box>
      </Box>

      {/* Vent Feed Section */}
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2, color: '#333', fontSize: '2rem' }}>
          Latest Vents
        </Typography>
        {ventsLoading ? (
          <CircularProgress />
        ) : ventsError ? (
          <Alert severity="error">{ventsError}</Alert>
        ) : vents.length === 0 ? (
          <Typography variant="body1" sx={{ color: '#555', mb: 3, fontSize: '1.2rem' }}>
            No vents available.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {vents.map((vent) => (
              <Grid item xs={12} key={vent._id}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    p: 2,
                    cursor: 'pointer',
                    position: 'relative',
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
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', fontSize: '1.5rem', textAlign: 'left' }}>
                        {vent.title}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#4a90e2', fontSize: '1rem', textAlign: 'right' }}>
                        {formatDistanceToNow(new Date(vent.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                    {/* Emotion & Hashtags */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {emotionMapping[vent.emotion] && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {emotionMapping[vent.emotion].icon}
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: emotionMapping[vent.emotion].color, fontSize: '1.2rem' }}>
                            {vent.emotion}
                          </Typography>
                        </Box>
                      )}
                      {vent.hashtags && vent.hashtags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
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
                      <Typography variant="body1">
                        {vent.text}
                      </Typography>
                    </Box>
                    {/* Reaction Buttons with Tooltips */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                      <Tooltip title="Heart: Shows love">
                        <IconButton onClick={() => handleReaction(vent._id, 'heart')} size="small">
                          <FavoriteIcon color="error" />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            {vent.reactions?.heart || 0}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hug: Shows support">
                        <IconButton onClick={() => handleReaction(vent._id, 'hug')} size="small">
                          <SentimentVerySatisfiedIcon color="primary" />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            {vent.reactions?.hug || 0}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Listen: Shows empathy">
                        <IconButton onClick={() => handleReaction(vent._id, 'listen')} size="small">
                          <HearingIcon color="action" />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            {vent.reactions?.listen || 0}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {/* Report Button (for vents not by current user) */}
                    {user._id !== vent.userId && (
                      <Button
                        variant="text"
                        color="warning"
                        startIcon={<ReportIcon />}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openReportDialog(vent._id);
                        }}
                      >
                        Report
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {/* Pagination */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={10} // Adjust count based on your backend's total pages
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/myvents')}
            sx={{ textTransform: 'none', fontSize: '1.2rem', px: 3, py: 1 }}
          >
            My Vents
          </Button>
        </Box>
      </Box>

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

      {/* Success Snackbar for vent creation */}
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
