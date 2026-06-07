// ─── GOOGLE CALENDAR ──────────────────────────────────────────────────────────
const fetchGoogleCalendarEvents = async (accessToken) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay}&timeMax=${endOfDay}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error('Failed to fetch Google Calendar events:', err);
    return [];
  }
};

const startGoogleOAuth = () => {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // This will be replaced dynamically
  const redirectUri = 'https://life-planner-two-gilt.vercel.app/auth/google/callback';
  const scope = 'https://www.googleapis.com/auth/calendar.readonly';
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
  
  window.location.href = authUrl;
};
