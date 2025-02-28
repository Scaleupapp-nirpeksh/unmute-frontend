import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OTPInput from '../../components/Auth/OTPInput';
import { authService } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  // Initialize phone with '+' so it always starts with a plus sign
  const [phone, setPhone] = useState('+');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);

  // Profile fields
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      // Ensure phone always starts with '+'
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      await authService.requestOTP(formattedPhone);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      setLoading(true);
      setError('');
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const { data } = await authService.verifyOTP(formattedPhone, otp);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      setResendDisabled(true);
      await authService.requestOTP(phone);
      startResendCooldown();
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  // 30-second cooldown for resending OTP
  const startResendCooldown = () => {
    setResendDisabled(true);
    setTimeout(() => setResendDisabled(false), 30000);
  };

  // --- Step 3: Complete Profile ---
  const handleProfileSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Update username if provided
      if (username && username.trim() !== "") {
        await authService.changeUsername(username);
      }

      // Prepare other profile details
      const details = {
        bio,
        interests,
        likes,
        dislikes,
        preferences
      };
      const { data } = await authService.updateUserDetails(details);

      // Update context with new user data
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        // Teal-to-purple gradient referencing the Unmute logo colors
        background: 'linear-gradient(135deg, #80DEEA, #CE93D8)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 2 
      }}
    >
      <Card 
        sx={{ 
          width: { xs: '100%', sm: 460 }, 
          borderRadius: '20px', 
          p: 4, 
          textAlign: 'center' 
        }}
        elevation={6}
      >
        <CardContent>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#333', mb: 2 }}>
            {step === 1 ? "Get Started" : step === 2 ? "Verify OTP" : "Complete Your Profile"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* --- Step 1: Phone Number --- */}
          {step === 1 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 3, color: '#555' }}>
                Enter your phone number to sign up.
              </Typography>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={(value) => setPhone(value.startsWith('+') ? value : `+${value}`)}
                inputStyle={{ width: '100%', height: '40px', fontSize: '1rem' }}
                containerStyle={{ marginBottom: 24 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSendOTP}
                disabled={loading || !phone}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </>
          )}

          {/* --- Step 2: OTP Verification --- */}
          {step === 2 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 3, color: '#555' }}>
                Enter the 6-digit OTP sent to your phone.
              </Typography>
              <OTPInput 
                length={6} 
                onComplete={handleVerifyOTP}
                disabled={loading}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: '#777' }}>
                  Didn’t receive code?
                </Typography>
                <Button 
                  size="small" 
                  onClick={handleResendOTP}
                  disabled={resendDisabled || loading}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Resend {resendDisabled && '(30s)'}
                </Button>
              </Box>
            </>
          )}

          {/* --- Step 3: Profile Completion --- */}
          {step === 3 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 3, color: '#555' }}>
                Complete Your Profile (Optional)
              </Typography>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="Choose a username"
                disabled={loading}
                inputProps={{ maxLength: 20 }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Bio"
                variant="outlined"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                disabled={loading}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Interests"
                variant="outlined"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., sports, music, tech"
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Likes"
                variant="outlined"
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                placeholder="What do you like?"
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Dislikes"
                variant="outlined"
                value={dislikes}
                onChange={(e) => setDislikes(e.target.value)}
                placeholder="What do you dislike?"
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Preferences"
                variant="outlined"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Your preferences (e.g., communication style)"
                disabled={loading}
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleProfileSubmit}
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Complete Profile'}
              </Button>
              <Button
                fullWidth
                variant="text"
                size="small"
                onClick={() => navigate('/')}
                sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
                disabled={loading}
              >
                Skip
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
