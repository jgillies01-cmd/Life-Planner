// Handles two things:
// 1. ?action=init  → redirects user to Google OAuth consent screen
// 2. ?code=...     → Google's callback — exchanges code for tokens, redirects back to app

export default async function handler(req, res) {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri  = 'https://life-planner-two-gilt.vercel.app/auth/google/callback';

  if (!clientId || !clientSecret) {
    return res.status(500).send('Google OAuth credentials not configured in Vercel environment variables.');
  }

  const { action, code } = req.query;

  // ── Step 1: Start OAuth flow ───────────────────────────────────────────────
  if (action === 'init') {
    const scope = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ].join(' ');

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline` +
      `&prompt=consent`;

    return res.redirect(authUrl);
  }

  // ── Step 2: Handle Google's callback ──────────────────────────────────────
  if (code) {
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id:     clientId,
          client_secret: clientSecret,
          redirect_uri:  redirectUri,
          grant_type:    'authorization_code',
        }),
      });

      const token = await tokenRes.json();

      if (!token.access_token) {
        return res.status(400).send('Failed to get access token from Google. Please try connecting again.');
      }

      const expiry = Date.now() + token.expires_in * 1000;
      const params = new URLSearchParams({
        gcal_token:  token.access_token,
        gcal_expiry: expiry.toString(),
      });
      if (token.refresh_token) params.set('gcal_refresh', token.refresh_token);

      return res.redirect(`https://life-planner-two-gilt.vercel.app?${params.toString()}`);
    } catch (err) {
      return res.status(500).send('OAuth exchange failed: ' + err.message);
    }
  }

  return res.status(400).send('Invalid request.');
}
