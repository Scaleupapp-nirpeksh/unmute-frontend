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
  Grid
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, login } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [user, navigate]);

  const handleOpenSettings = () => {
    // Pre-fill fields with current details
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
      // If username changed, update it.
      if (formUsername !== userDetails.username && formUsername.trim() !== "") {
        const resUsername = await authService.changeUsername(formUsername);
        if (resUsername.data && resUsername.data.user) {
          setUserDetails(resUsername.data.user);
        }
      }
      // Prepare updated details for the rest of the profile.
      const updateData = {
        bio: formBio,
        interests: formInterests,  // Already an array
        likes: formLikes,
        dislikes: formDislikes,
        preferences: {
          matchPreference: formMatchPreference,
          anonymousChat: formAnonymousChat,
        },
      };
      const resDetails = await authService.updateUserDetails(updateData);
      if (resDetails.data && resDetails.data.user) {
        // Continue using the original token.
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
    <Box sx={{ 
      p: 3, 
      minHeight: '100vh', 
      // Use the same teal-to-purple gradient as Login/Signup
      background: 'linear-gradient(135deg, #80DEEA, #CE93D8)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center'
    }}>
      <Card 
        elevation={6} 
        sx={{ 
          borderRadius: '20px', 
          p: 4, 
          position: 'relative', 
          maxWidth: 900, 
          width: '100%', 
          backgroundColor: '#fff'
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
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                {userDetails.username}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#777' }}>
                {userDetails.bio || 'No bio provided.'}
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h5" sx={{ color: '#555', mb: 1 }}>Interests</Typography>
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
              <Typography variant="h5" sx={{ color: '#555', mb: 1 }}>Likes</Typography>
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
              <Typography variant="h5" sx={{ color: '#555', mb: 1 }}>Dislikes</Typography>
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
            <Typography variant="h5" sx={{ color: '#555', mb: 1 }}>Preferences</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#555', mr: 2 }}>
                Match Preference:
              </Typography>
              <Chip 
                label={userDetails.preferences?.matchPreference || 'Not specified'}
                sx={{ backgroundColor: '#D1C4E9', color: '#333' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#555', mr: 2 }}>
                Anonymous Chat:
              </Typography>
              <Chip 
                label={userDetails.preferences?.anonymousChat ? "Enabled" : "Disabled"}
                icon={<ChatBubbleOutlineIcon />}
                sx={{ 
                  backgroundColor: userDetails.preferences?.anonymousChat ? '#B2DFDB' : '#FFCDD2', 
                  color: '#333' 
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

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
          <Button onClick={handleCloseSettings} disabled={saving}>Cancel</Button>
          <Button onClick={handleSettingsSave} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
