// src/pages/Home/Home.jsx
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
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
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

// Define a mapping for emotions with their colors and icons
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

  // Latest vents state (preview: limit 5)
  const [vents, setVents] = useState([]);
  const [ventsLoading, setVentsLoading] = useState(true);
  const [ventsError, setVentsError] = useState('');

  // Report dialog state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportVentId, setReportVentId] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportOtherText, setReportOtherText] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  // Typical reasons for reporting a vent
  const reportReasons = ['Inappropriate Content', 'Harassment', 'Spam', 'Other'];

  // Fetch user details
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

  // Fetch latest vents (preview: limit 5)
  useEffect(() => {
    const fetchVents = async () => {
      setVentsLoading(true);
      setVentsError('');
      try {
        const res = await ventService.getVents({ sort: 'recent', page: 1, limit: 5 });
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
  }, []);

  const handleOpenSettings = () => {
    setFormUsername(userDetails.username || '');
    setFormBio(userDetails.bio || '');
    setFormInterests(Array.isArray(userDetails.interests) ? userDetails.interests : []);
    setFormLikes(Array.isArray(userDetails.likes) ? userDetails.likes : []);
    setFormDislikes(Array.isArray(userDetails.dislikes) ? userDetails.dislikes : []);
    const prefs = userDetails.preferences || {};
    setFormMatchPreference(prefs.matchPreference || '');
    setFormAnonymousChat(!!prefs.anonymousChat);
    setSettingsError('');
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleSettingsSave = async () => {
    setSaving(true);
    setSettingsError('');
    try {
      if (formUsername !== userDetails.username && formUsername.trim() !== '') {
        const resUsername = await authService.changeUsername(formUsername);
        if (resUsername.data && resUsername.data.user) {
          setUserDetails(resUsername.data.user);
        }
      }
      const updateData = {
        bio: formBio,
        interests: formInterests,
        likes: formLikes,
        dislikes: formDislikes,
        preferences: {
          matchPreference: formMatchPreference,
          anonymousChat: formAnonymousChat,
        },
      };
      const resDetails = await authService.updateUserDetails(updateData);
      if (resDetails.data && resDetails.data.user) {
        login(localStorage.getItem('token'), resDetails.data.user);
        setUserDetails(resDetails.data.user);
      }
      setOpenSettings(false);
    } catch (err) {
      setSettingsError(err.response?.data?.message || err.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleReaction = async (ventId, reactionType) => {
    try {
      await ventService.reactToVent({ ventId, reactionType });
      // Refresh vents after reaction to update counts
      const res = await ventService.getVents({ sort: 'recent', page: 1, limit: 5 });
      if (res.data && res.data.vents) {
        setVents(res.data.vents);
      }
    } catch (err) {
      console.error('Error reacting to vent:', err);
    }
  };

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

  // If user details are loading, show a spinner
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
      {/* User Profile Card */}
      <Card
        elevation={6}
        sx={{
          borderRadius: '20px',
          p: 4,
          position: 'relative',
          maxWidth: 900,
          width: '100%',
          backgroundColor: '#fff',
          mb: 4,
        }}
      >
        <IconButton
          onClick={handleOpenSettings}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#1976d2' }}
          aria-label="settings"
        >
          <SettingsIcon fontSize="large" />
        </IconButton>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={userDetails.profilePic || '/default-avatar.png'}
              sx={{ width: 120, height: 120, mr: 3, border: '4px solid #1976d2' }}
            >
              {userDetails.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#333', mb: 1, fontSize: '2rem' }}>
                {userDetails.username}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#777', fontSize: '1.2rem' }}>
                {userDetails.bio || 'No bio provided.'}
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5" sx={{ color: '#555', mb: 1, fontSize: '1.3rem' }}>Interests</Typography>
              {userDetails.interests && userDetails.interests.length > 0 ? (
                userDetails.interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    sx={{ backgroundColor: '#FFDEE9', color: '#333', mb: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Not specified.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5" sx={{ color: '#555', mb: 1, fontSize: '1.3rem' }}>Likes</Typography>
              {userDetails.likes && userDetails.likes.length > 0 ? (
                userDetails.likes.map((like, index) => (
                  <Chip
                    key={index}
                    label={like}
                    sx={{ backgroundColor: '#B5FFFC', color: '#333', mb: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Not specified.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5" sx={{ color: '#555', mb: 1, fontSize: '1.3rem' }}>Dislikes</Typography>
              {userDetails.dislikes && userDetails.dislikes.length > 0 ? (
                userDetails.dislikes.map((dislike, index) => (
                  <Chip
                    key={index}
                    label={dislike}
                    sx={{ backgroundColor: '#FFE7A6', color: '#333', mb: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Not specified.
                </Typography>
              )}
            </Grid>
          </Grid>
          <Box>
            <Typography variant="h5" sx={{ color: '#555', mb: 1, fontSize: '1.3rem' }}>Preferences</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#555', mr: 2 }}>
                Match Preference:
              </Typography>
              <Chip
                label={userDetails.preferences?.matchPreference || 'Not specified'}
                sx={{ backgroundColor: '#D1C4E9', color: '#333', fontSize: '1.1rem' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#555', mr: 2 }}>
                Anonymous Chat:
              </Typography>
              <Chip
                label={userDetails.preferences?.anonymousChat ? 'Enabled' : 'Disabled'}
                icon={<ChatBubbleOutlineIcon />}
                sx={{
                  backgroundColor: userDetails.preferences?.anonymousChat ? '#B2DFDB' : '#FFCDD2',
                  color: '#333',
                  fontSize: '1.1rem',
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Vent Preview Section */}
      <Box sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
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
          <Grid container spacing={2} sx={{ maxWidth: 900, mx: 'auto' }}>
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', fontSize: '1.5rem', textAlign: 'left' }}>
                        {vent.title}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#4a90e2', fontSize: '1rem', textAlign: 'right' }}>
                        {formatDistanceToNow(new Date(vent.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                    {/* Emotion & Hashtags */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 1 }}>
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
                    {/* Vent Text in a Vertically Scrollable Container */}
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
                    {/* Reaction Buttons */}
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
                    {/* Report Button (if vent not by current user) */}
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
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/vents')} sx={{ textTransform: 'none', fontSize: '1.2rem', px: 3, py: 1 }}>
            Vent Page
          </Button>
        </Box>
      </Box>

      {/* Settings Dialog */}
      <Dialog open={openSettings} onClose={handleCloseSettings} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          {settingsError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {settingsError}
            </Typography>
          )}
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Bio"
            fullWidth
            multiline
            rows={3}
            value={formBio}
            onChange={(e) => setFormBio(e.target.value)}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formInterests}
            onChange={(event, newValue) => setFormInterests(newValue)}
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Interests" fullWidth />
            )}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formLikes}
            onChange={(event, newValue) => setFormLikes(newValue)}
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Likes" fullWidth />
            )}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={formDislikes}
            onChange={(event, newValue) => setFormDislikes(newValue)}
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Dislikes" fullWidth />
            )}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Match Preference
            </Typography>
            <ToggleButtonGroup
              color="primary"
              value={formMatchPreference}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) setFormMatchPreference(newValue);
              }}
              fullWidth
            >
              <ToggleButton value="Similar Emotions">Similar Emotions</ToggleButton>
              <ToggleButton value="Different Emotions">Different Emotions</ToggleButton>
              <ToggleButton value="Balanced">Balanced</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>Anonymous Chat</Typography>
            <Switch
              checked={formAnonymousChat}
              onChange={(e) => setFormAnonymousChat(e.target.checked)}
              color="primary"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSettingsSave} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

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
