import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Privacy() {
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
            UnMute Privacy Policy
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <strong>Effective Date:</strong> [Insert Date]
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {`
Your privacy is important to us. This Privacy Policy explains how UnMute collects, uses, and protects your information.

1. Information We Collect
- Mobile Number: Used for authentication and security.
- Usage Data: Includes interactions with the platform but is anonymized.

2. How We Use Your Information
- To verify your identity and enable secure access.
- To improve and personalize your experience on UnMute.
- To detect and prevent fraud or abuse.

3. Data Protection & Security
- We use encryption and secure protocols to protect user data.
- No personal messages or content are shared outside the platform.

4. Data Retention
- Mobile numbers are stored securely and used solely for authentication.
- Users can request account deletion via settings.

5. Third-Party Services
- We do not sell or share user data with advertisers or third parties.
- Some external tools may be used for platform analytics (without personally identifying users).

6. User Rights
- Users can request data access or deletion.
- Users can opt-out of platform communications.

7. Changes to Privacy Policy
- We may update this policy, and users will be notified of significant changes.

For privacy concerns, contact [privacy@unmute.com].
            `}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
