import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function FAQ() {
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
      <Card sx={{ maxWidth: 900, width: '100%', p: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            UnMute FAQ
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {`
1. What is UnMute?
UnMute is a platform for sharing thoughts and emotions anonymously, allowing users to express themselves freely in a safe environment.

2. How do I create an account?
Simply enter your mobile number and verify it with an OTP.

3. Why does UnMute require my mobile number?
Your mobile number is used only for authentication and security purposes.

4. Can other users see my phone number or identity?
No. Your identity remains anonymous unless you choose to disclose it.

5. Can I delete my account?
Yes. You can delete your account from the app settings, and all associated data will be removed.

6. Are my messages and posts private?
Yes. Your posts are anonymous and cannot be traced back to you.

7. Can I turn off comments on my posts?
Yes. You can toggle the "Allow Comments" option in settings.

8. What happens if someone posts harmful content?
Users can report posts, and our moderation team will take action.

9. Is UnMute free to use?
Yes, UnMute is completely free.

10. How can I contact support?
For any issues, email us at [support@unmute.com].
            `}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
