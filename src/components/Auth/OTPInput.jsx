import { Box, TextField } from '@mui/material';
import { useState, useRef } from 'react';

export default function OTPInput({ length = 6, onComplete, disabled = false }) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.every(num => num !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, justifyContent: 'center' }}>
      {Array.from({ length }).map((_, index) => (
        <TextField
          key={index}
          inputRef={el => inputs.current[index] = el}
          value={otp[index]}
          onChange={(e) => handleChange(e.target.value, index)}
          inputProps={{
            maxLength: 1,
            disabled: disabled  
          }}
          sx={{
            width: { xs: 60, sm: 70 },
            '& input': { 
              textAlign: 'center', 
              fontSize: { xs: 24, sm: 28 },
              cursor: disabled ? 'not-allowed' : 'text'
            }
          }}
        />
      ))}
    </Box>
  );
}
