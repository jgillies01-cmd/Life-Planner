// Called when the Google access token has expired.
// Uses the stored refresh token to silently get a new access token.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ error: 'refresh_token required' });

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token,
        client_id:     process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type:    'refresh_token',
      }),
    });

    const data = await tokenRes.json();
    if (!data.access_token) {
      return res.status(400).json({ error: 'Token refresh failed', detail: data });
    }

    res.json({
      access_token: data.access_token,
      expires_in:   data.expires_in,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
