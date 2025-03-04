import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OTPInput from '../../components/Auth/OTPInput';
import { authService } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('+');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
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

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #80DEEA, #CE93D8)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: { xs: 2, sm: 3 }
      }}
    >
      <Card 
        sx={{ 
          width: { xs: '100%', sm: 400 }, 
          borderRadius: '20px', 
          p: { xs: 3, sm: 4 }, 
          textAlign: 'center' 
        }}
        elevation={6}
      >
        <CardContent>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#333', mb: { xs: 2, sm: 3 } }}>
            Welcome Back
          </Typography>

          {step === 1 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: { xs: 2, sm: 3 }, color: '#555' }}>
                Enter your phone number to receive an OTP.
              </Typography>
              {error && <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>{error}</Alert>}
              <PhoneInput
                country={'in'}
                value={phone}
                onChange={(value) =>
                  setPhone(value.startsWith('+') ? value : `+${value}`)
                }
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
              <Typography variant="body2" sx={{ mt: 2, color: '#777' }}>
                New here?{' '}
                <Button 
                  variant="text" 
                  onClick={() => navigate('/signup')} 
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                  disabled={loading}
                >
                  Create account
                </Button>
              </Typography>
            </>
          )}

          {step === 2 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: { xs: 2, sm: 3 }, color: '#555' }}>
                Enter the 6-digit OTP sent to your phone.
              </Typography>
              {error && <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>{error}</Alert>}
              <OTPInput 
                length={6} 
                onComplete={handleVerifyOTP}
                disabled={loading}
              />
              <Typography variant="body2" sx={{ mt: 2, color: '#777' }}>
                Didn’t receive an OTP?{' '}
                <Button 
                  variant="text" 
                  onClick={handleSendOTP} 
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                  disabled={loading}
                >
                  Resend OTP
                </Button>
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
