import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Terms() {
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
            UnMute Terms and Conditions
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            <strong>Effective Date:</strong> [Insert Date]
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {`
Welcome to UnMute! These Terms and Conditions ("Terms") govern your access and use of the UnMute mobile application and associated services (collectively, the "Platform"). By using UnMute, you agree to comply with these Terms. If you do not agree, please do not use our services.

1. Introduction
UnMute is a platform designed to provide a safe and anonymous space for users to express their thoughts, emotions, and experiences. We are committed to fostering a positive, inclusive, and secure environment.

2. Eligibility
To use UnMute, you must:
- Be at least 18 years old or have parental/guardian consent.
- Provide a valid mobile number for authentication.
- Agree to these Terms and our Privacy Policy.

3. User Conduct
By using UnMute, you agree to:
- Respect other users and their experiences.
- Not engage in harassment, hate speech, or harmful content.
- Avoid impersonating others or spreading false information.
- Not share personal information of others.
- Follow all applicable laws and regulations.

4. Data Collection & Privacy
- We collect and store only your mobile number for authentication purposes.
- Your activity on the platform is anonymous; no personal details are shared publicly.
- We do not sell, rent, or distribute your mobile number to third parties.
- For more details, see our Privacy Policy below.

5. Content & Intellectual Property
- Users retain ownership of their posted content but grant UnMute a license to use it for platform functionality and improvements.
- UnMute reserves the right to remove any content that violates these Terms.

6. Account Suspension & Termination
- We reserve the right to suspend or terminate accounts that violate our policies.
- Users may request account deletion via the app settings.

7. Disclaimers & Limitation of Liability
- UnMute is provided "as is" without warranties of any kind.
- We are not responsible for user-generated content.
- We are not liable for damages resulting from the use of our platform.

8. Changes to Terms
- We may update these Terms periodically. Continued use of UnMute after changes constitutes acceptance of the new Terms.

9. Contact Us
For any queries regarding these Terms, contact us at [support@unmute.com].
            `}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
