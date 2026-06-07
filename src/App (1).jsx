import { useState, useEffect, useRef } from "react";
import { Calendar, Utensils, Settings, MessageCircle, Plus, X, RefreshCw, Check, Target, Trash2, Zap, Search } from "lucide-react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Instrument+Sans:wght@400;500;600&family=Spectral:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400;500&display=swap');`;

const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
.app { font-family:'Instrument Sans',sans-serif; min-height:100vh; color:#1F2937; background-color:#F2F6F1; background-image:radial-gradient(ellipse 65% 40% at 0% 0%,rgba(22,163,74,.1) 0%,transparent 60%),radial-gradient(ellipse 50% 35% at 100% 100%,rgba(13,102,64,.07) 0%,transparent 55%),radial-gradient(circle,rgba(0,0,0,.038) 1px,transparent 1px); background-size:auto,auto,22px 22px; }
.syn { font-family:'Syne',sans-serif; }
.mono { font-family:'JetBrains Mono',monospace; }
.hdr { padding:14px 20px 0; background-color:rgba(255,255,255,.94); border-bottom:1px solid #DDE8DA; position:sticky; top:0; z-index:20; backdrop-filter:blur(14px); }
.hdr-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.logo { font-family:'Syne',sans-serif; font-weight:800; font-size:16px; letter-spacing:.15em; color:#0A5C38; user-select:none; display:flex; align-items:center; gap:8px; }
.logo::before { content:''; display:block; width:3px; height:16px; background:#0A5C38; border-radius:2px; flex-shrink:0; }
.logo em { color:#111827; font-style:normal; }
.hdr-date { font-family:'JetBrains Mono',monospace; font-size:10px; color:#9CA3AF; letter-spacing:.07em; margin-top:2px; }
.nav { display:flex; gap:1px; overflow-x:auto; scrollbar-width:none; }
.nav::-webkit-scrollbar { display:none; }
.nb { padding:7px 13px 11px; background:none; border:none; border-bottom:2px solid transparent; color:#9CA3AF; font-family:'Instrument Sans',sans-serif; font-size:12.5px; font-weight:500; cursor:pointer; white-space:nowrap; transition:color .2s,border-color .2s; display:flex; align-items:center; gap:5px; }
.nb:hover { color:#4B5563; }
.nb.on { color:#111827; border-bottom-color:#16A34A; }
.nb svg { opacity:.5; }
.nb.on svg { opacity:1; }
.pg { padding:20px 20px 90px; max-width:700px; margin:0 auto; }
.card { background:#FFFFFF; border:1px solid #DDE8DA; border-radius:13px; padding:15px; margin-bottom:11px; box-shadow:0 1px 3px rgba(0,0,0,.04); transition:border-color .22s,box-shadow .22s,transform .22s; }
.card:hover { border-color:#BED4BA; box-shadow:0 4px 16px rgba(22,163,74,.07); transform:translateY(-1px); }
.card-hdr { display:flex; justify-content:space-between; align-items:center; margin-bottom:13px; }
.ctitle { font-family:'Syne',sans-serif; font-weight:700; font-size:10px; letter-spacing:.16em; text-transform:uppercase; color:#9CA3AF; display:flex; align-items:center; gap:6px; }
.cdot { width:5px; height:5px; border-radius:50%; }
.btn { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:7px; border:none; font-family:'Instrument Sans',sans-serif; font-weight:500; font-size:12px; cursor:pointer; transition:all .18s; }
.btn-gold { background:#16A34A; color:#FFFFFF; }
.btn-gold:hover { background:#15803D; transform:translateY(-1px); box-shadow:0 4px 12px rgba(22,163,74,.3); }
.btn-gold:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-ghost { background:transparent; border:1px solid #D1D5DB; color:#4B5563; }
.btn-ghost:hover { background:#F3F4F3; color:#111827; border-color:#9CA3AF; }
.btn-ghost:disabled { opacity:.5; cursor:not-allowed; }
.btn-danger { background:transparent; border:1px solid rgba(220,38,38,.22); color:#DC2626; }
.btn-danger:hover { background:rgba(220,38,38,.05); }
.btn-sm { padding:4px 10px; font-size:11px; }
.ibtn { width:30px; height:30px; border-radius:7px; background:#F6FAF5; border:1px solid #D1D5DB; color:#4B5563; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .18s; flex-shrink:0; }
.ibtn:hover { background:#ECF4EA; color:#111827; border-color:#9CA3AF; }
.sg { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:11px; }
.sc { background:#FFFFFF; border:1px solid #DDE8DA; border-radius:10px; padding:12px 10px; position:relative; overflow:hidden; box-shadow:0 1px 2px rgba(0,0,0,.03); transition:border-color .22s,transform .2s,box-shadow .22s; }
.sc::after { content:''; position:absolute; top:0; left:0; right:0; height:2.5px; background:var(--accent,transparent); border-radius:10px 10px 0 0; opacity:.75; }
.sc:hover { border-color:#BED4BA; transform:translateY(-2px); box-shadow:0 4px 10px rgba(0,0,0,.06); }
.sc-lbl { font-family:'JetBrains Mono',monospace; font-size:8.5px; text-transform:uppercase; letter-spacing:.14em; color:#9CA3AF; margin-bottom:7px; }
.sc-val { font-family:'Syne',sans-serif; font-weight:800; font-size:26px; line-height:1; margin-bottom:2px; }
.sc-sub { font-family:'JetBrains Mono',monospace; font-size:9px; color:#9CA3AF; }
.brief-wrap { position:relative; padding-left:18px; }
.brief-wrap::before { content:''; position:absolute; left:0; top:4px; bottom:4px; width:2px; background:rgba(10,92,56,.4); border-radius:2px; }
.brief-text { font-family:'Spectral',Georgia,serif; font-size:14.5px; line-height:1.85; color:#374151; white-space:pre-wrap; letter-spacing:.01em; }
.empty { text-align:center; padding:16px 8px; color:#9CA3AF; font-size:12.5px; }
.empty svg { opacity:.35; margin-bottom:8px; }

/* ── Events ──────────────────────────────────────────────────────────────── */
.ev { display:flex; align-items:center; gap:8px; padding:9px 0; border-bottom:1px solid #EEF3EC; }
.ev:last-child { border-bottom:none; }
.ev-times { display:flex; flex-direction:column; width:40px; flex-shrink:0; }
.ev-time { font-family:'JetBrains Mono',monospace; font-size:10px; color:#9CA3AF; line-height:1.3; }
.ev-time-end { font-family:'JetBrains Mono',monospace; font-size:9px; color:#C4CDD8; line-height:1.3; }
.ev-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.ev-name { font-size:13px; flex:1; color:#1F2937; }
.ev-pill { font-family:'JetBrains Mono',monospace; font-size:8.5px; text-transform:uppercase; letter-spacing:.05em; padding:2px 6px; border-radius:4px; }
.ev-del { background:none; border:none; color:#C8D4C4; cursor:pointer; padding:2px; opacity:0; transition:opacity .18s; display:flex; align-items:center; }
.ev:hover .ev-del { opacity:1; }
.gcal-badge { font-family:'JetBrains Mono',monospace; font-size:8px; color:#0F9D58; background:rgba(15,157,88,.1); border:1px solid rgba(15,157,88,.2); padding:1px 5px; border-radius:3px; flex-shrink:0; }

/* ── Goals ───────────────────────────────────────────────────────────────── */
.gl { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid #EEF3EC; }
.gl:last-child { border-bottom:none; }
.gl-ck { width:17px; height:17px; border-radius:50%; border:1.5px solid #D1D5DB; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .18s; }
.gl-ck:hover { border-color:#16A34A; box-shadow:0 0 8px rgba(22,163,74,.22); }
.gl-ck.done { background:#16A34A; border-color:#16A34A; }
.gl-txt { flex:1; font-size:13px; color:#1F2937; }
.gl-txt.done { text-decoration:line-through; color:#9CA3AF; }
.gl-del { background:none; border:none; color:#C8D4C4; cursor:pointer; padding:2px; opacity:0; transition:opacity .18s; display:flex; align-items:center; }
.gl:hover .gl-del { opacity:1; }
.prog-bar { height:5px; background:#E8F0E5; border-radius:3px; overflow:hidden; }
.prog-fill { height:100%; border-radius:3px; transition:width .5s cubic-bezier(.4,0,.2,1); }
.food-row { display:flex; align-items:center; gap:8px; padding:7px 0; border-bottom:1px solid #EEF3EC; }
.food-row:last-child { border-bottom:none; }
.food-del { background:none; border:none; color:#C8D4C4; cursor:pointer; padding:2px; opacity:0; transition:opacity .18s; display:flex; align-items:center; flex-shrink:0; }
.food-row:hover .food-del { opacity:1; }
.meal-lbl { font-family:'JetBrains Mono',monospace; font-size:9px; text-transform:uppercase; letter-spacing:.14em; color:#9CA3AF; margin-bottom:5px; padding-top:10px; }
.meal-lbl:first-child { padding-top:0; }
.sr { padding:8px 0; border-bottom:1px solid #EEF3EC; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:10px; transition:opacity .15s; }
.sr:hover { opacity:.65; }
.sr:last-child { border-bottom:none; }
.chat-bg { position:fixed; inset:0; background:rgba(0,0,0,.38); z-index:50; display:flex; align-items:flex-end; backdrop-filter:blur(4px); }
.chat-pnl { width:100%; height:78vh; background:#FFFFFF; border:1px solid #DDE8DA; border-bottom:none; border-radius:16px 16px 0 0; box-shadow:0 -4px 24px rgba(0,0,0,.08); display:flex; flex-direction:column; max-width:720px; margin:0 auto; }
.chat-hdr { padding:13px 17px; border-bottom:1px solid #E8EEE5; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; }
.chat-msgs { flex:1; overflow-y:auto; padding:13px 17px; display:flex; flex-direction:column; gap:9px; scrollbar-width:thin; scrollbar-color:#D1D5DB transparent; }
.msg { max-width:83%; padding:10px 14px; border-radius:10px; font-size:13px; line-height:1.65; white-space:pre-wrap; }
.msg-u { background:rgba(22,163,74,.08); border:1px solid rgba(22,163,74,.14); align-self:flex-end; color:#1F2937; }
.msg-a { background:#F7FAF6; border:1px solid #E4EDE1; align-self:flex-start; color:#374151; }
.chat-in { padding:10px 13px; border-top:1px solid #E8EEE5; display:flex; gap:8px; flex-shrink:0; }
.cin { flex:1; background:#F7FAF6; border:1px solid #D8E4D4; border-radius:8px; padding:8px 11px; color:#1F2937; font-family:'Instrument Sans',sans-serif; font-size:13px; outline:none; resize:none; transition:border-color .2s; }
.cin:focus { border-color:rgba(22,163,74,.4); }
.cin::placeholder { color:#9CA3AF; }
.fab { position:fixed; bottom:22px; right:22px; width:48px; height:48px; border-radius:50%; background:#16A34A; border:none; color:#FFFFFF; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(22,163,74,.38); z-index:40; transition:all .22s; }
.fab:hover { background:#15803D; transform:scale(1.1); box-shadow:0 6px 28px rgba(22,163,74,.52); }
.modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.38); z-index:60; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
.modal { background:#FFFFFF; border:1px solid #DDE8DA; border-radius:14px; padding:20px; width:100%; max-width:380px; box-shadow:0 8px 32px rgba(0,0,0,.1); }
.modal h3 { font-family:'Syne',sans-serif; font-weight:700; font-size:14.5px; margin-bottom:13px; color:#111827; }
.inp { width:100%; background:#F7FAF6; border:1px solid #D1D5DB; border-radius:7px; padding:8px 11px; color:#1F2937; font-family:'Instrument Sans',sans-serif; font-size:13px; outline:none; margin-bottom:8px; transition:border-color .2s; }
.inp:focus { border-color:rgba(22,163,74,.38); }
.inp::placeholder { color:#9CA3AF; }
.inp-row { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; }
.inp-row .inp { margin-bottom:0; }
.inp-lbl { font-size:10px; color:#9CA3AF; font-family:'JetBrains Mono',monospace; text-transform:uppercase; letter-spacing:.1em; margin-bottom:3px; }
.sel { width:100%; background:#F7FAF6; border:1px solid #D1D5DB; border-radius:7px; padding:8px 11px; color:#1F2937; font-family:'Instrument Sans',sans-serif; font-size:13px; outline:none; margin-bottom:8px; cursor:pointer; }
.row-btns { display:flex; justify-content:flex-end; gap:7px; margin-top:3px; }
.setup { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:40px 24px; text-align:center; }
.setup-logo { font-family:'Syne',sans-serif; font-weight:800; font-size:42px; letter-spacing:.14em; color:#0A5C38; margin-bottom:4px; display:flex; align-items:center; gap:10px; }
.setup-logo::before { content:''; display:block; width:4px; height:32px; background:#0A5C38; border-radius:2px; flex-shrink:0; }
.setup-logo em { color:#111827; font-style:normal; }
.step { display:flex; gap:11px; padding:9px 0; border-bottom:1px solid #EEF3EC; }
.step:last-child { border-bottom:none; }
.snum { width:21px; height:21px; border-radius:50%; background:#F3F7F2; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:9px; color:#9CA3AF; flex-shrink:0; margin-top:2px; }
.stitle { font-weight:600; font-size:12px; margin-bottom:3px; color:#111827; }
.sdesc { font-size:11px; color:#6B7280; line-height:1.6; }
.badge { display:inline-flex; padding:2px 7px; border-radius:20px; font-family:'JetBrains Mono',monospace; font-size:9px; text-transform:uppercase; letter-spacing:.07em; font-weight:500; }
.bg-gold { background:rgba(22,163,74,.1); color:#15803D; border:1px solid rgba(22,163,74,.22); }
.bg-grn  { background:rgba(22,163,74,.1); color:#15803D; border:1px solid rgba(22,163,74,.2); }
.bg-blu  { background:rgba(37,99,235,.07); color:#1D4ED8; border:1px solid rgba(37,99,235,.18); }
.bg-pur  { background:rgba(109,40,217,.07); color:#6D28D9; border:1px solid rgba(109,40,217,.18); }
.bg-gray { background:#F3F4F3; color:#6B7280; border:1px solid #D1D5DB; }
.bg-warn { background:rgba(180,83,9,.07); color:#92400E; border:1px solid rgba(180,83,9,.18); }
.info-box { background:rgba(37,99,235,.05); border:1px solid rgba(37,99,235,.14); border-radius:8px; padding:10px 13px; font-size:11.5px; color:#1D4ED8; line-height:1.65; margin-bottom:11px; }
.sh { font-family:'Syne',sans-serif; font-weight:800; font-size:19px; color:#111827; margin-bottom:3px; }
.ss { font-size:12px; color:#9CA3AF; margin-bottom:16px; }
.planner { height:calc(100vh - 125px); display:flex; flex-direction:column; }
.plan-msgs { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:9px; padding-bottom:9px; scrollbar-width:thin; scrollbar-color:#D1D5DB transparent; }
@keyframes bl { 0%,80%,100%{opacity:.15} 40%{opacity:1} }
.d1{animation:bl 1.4s infinite 0s;display:inline-block;margin:0 1px}
.d2{animation:bl 1.4s infinite .2s;display:inline-block;margin:0 1px}
.d3{animation:bl 1.4s infinite .4s;display:inline-block;margin:0 1px}
@keyframes fi { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:none} }
.fi>* { animation:fi .3s cubic-bezier(.4,0,.2,1) both; }
.fi>*:nth-child(1){animation-delay:0ms}
.fi>*:nth-child(2){animation-delay:70ms}
.fi>*:nth-child(3){animation-delay:140ms}
.fi>*:nth-child(4){animation-delay:210ms}
.fi>*:nth-child(5){animation-delay:280ms}
.fi>*:nth-child(6){animation-delay:350ms}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:#C8D8C4;border-radius:2px}
`;

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const store = {
  async get(key) {
    try { const v=localStorage.getItem(key); return v?{value:v}:null; } catch { return null; }
  },
  async set(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  },
  async delete(key) {
    try { localStorage.removeItem(key); } catch {}
  },
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EV_COLORS = {
  work:'#2563EB', personal:'#7C3AED', fitness:'#059669',
  health:'#DC2626', social:'#D97706', calendar:'#0F9D58'
};
const MEALS      = ['breakfast','lunch','dinner','snacks'];
const MEAL_ICONS = { breakfast:'🌅', lunch:'☀️', dinner:'🌙', snacks:'🍎' };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtTime = (dt) => {
  if (!dt) return '';
  try {
    return new Date(dt).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  } catch { return ''; }
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function LifeOS() {
  const [view, setView]               = useState('today');
  const [ready, setReady]             = useState(false);
  const [nameIn, setNameIn]           = useState('');
  const [name, setName]               = useState('');
  const [brief, setBrief]             = useState('');
  const [briefLoad, setBriefLoad]     = useState(false);
  const [goals, setGoals]             = useState([]);
  const [events, setEvents]           = useState([]);
  const [chat, setChat]               = useState([]);
  const [chatIn, setChatIn]           = useState('');
  const [chatLoad, setChatLoad]       = useState(false);
  const [showChat, setShowChat]       = useState(false);
  const [showAddEv, setShowAddEv]     = useState(false);
  const [showAddGl, setShowAddGl]     = useState(false);
  // ── updated evForm now includes endTime ────────────────────────────────────
  const [evForm, setEvForm]           = useState({ title:'', time:'', endTime:'', type:'work' });
  const [glIn, setGlIn]               = useState('');
  const [foodLog, setFoodLog]         = useState([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [showAddFood, setShowAddFood] = useState(false);
  const [addMode, setAddMode]         = useState('manual');
  const [foodQuery, setFoodQuery]     = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus]   = useState('idle');
  const [selectedFood, setSelectedFood]   = useState(null);
  const [portionG, setPortionG]           = useState('');
  const [searchMeal, setSearchMeal]       = useState('lunch');
  const [manualFood, setManualFood]       = useState({ name:'', calories:'', protein:'', carbs:'', fat:'', meal:'lunch' });
  // ── Google Calendar ────────────────────────────────────────────────────────
  const [gcalToken, setGcalToken]     = useState(null);
  const [gcalExpiry, setGcalExpiry]   = useState(null);
  const [gcalRefresh, setGcalRefresh] = useState(null);
  const [gcalEvents, setGcalEvents]   = useState([]);
  const [gcalStatus, setGcalStatus]   = useState('disconnected'); // disconnected | loading | connected | error
  const chatBot = useRef(null);
  const planBot = useRef(null);
  const inited  = useRef(false);

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;
    (async () => {
      // Check URL for Google OAuth token (returned after OAuth callback)
      const params = new URLSearchParams(window.location.search);
      const urlToken   = params.get('gcal_token');
      const urlExpiry  = params.get('gcal_expiry');
      const urlRefresh = params.get('gcal_refresh');
      if (urlToken) {
        localStorage.setItem('los_gcal_token',   urlToken);
        if (urlExpiry)  localStorage.setItem('los_gcal_expiry',  urlExpiry);
        if (urlRefresh) localStorage.setItem('los_gcal_refresh', urlRefresh);
        window.history.replaceState({}, '', window.location.pathname);
      }

      // Load stored data
      try { const r=await store.get('los_p');   if(r){const p=JSON.parse(r.value);setName(p.n);setReady(true);} } catch {}
      try { const r=await store.get('los_g');   if(r) setGoals(JSON.parse(r.value)); } catch {}
      try { const r=await store.get('los_e');   if(r) setEvents(JSON.parse(r.value)); } catch {}
      try { const r=await store.get('los_b');   if(r){const b=JSON.parse(r.value);if(b.d===new Date().toDateString())setBrief(b.t);} } catch {}
      try { const r=await store.get('los_c');   if(r) setChat(JSON.parse(r.value)); } catch {}
      try { const r=await store.get('los_f');   if(r) setFoodLog(JSON.parse(r.value)); } catch {}
      try { const r=await store.get('los_cal'); if(r) setCalorieGoal(JSON.parse(r.value)); } catch {}

      // Load Google Calendar token
      const storedToken   = localStorage.getItem('los_gcal_token');
      const storedExpiry  = localStorage.getItem('los_gcal_expiry');
      const storedRefresh = localStorage.getItem('los_gcal_refresh');
      if (storedToken) {
        setGcalToken(storedToken);
        setGcalExpiry(storedExpiry ? parseInt(storedExpiry) : null);
        if (storedRefresh) setGcalRefresh(storedRefresh);
      }
    })();
  }, []);

  // ── Fetch Google Calendar events whenever token changes ────────────────────
  useEffect(() => {
    if (!gcalToken) return;
    const expiry = gcalExpiry || parseInt(localStorage.getItem('los_gcal_expiry') || '0');
    if (expiry && Date.now() > expiry - 60000) {
      // Token expires within 1 minute — refresh first
      handleTokenRefresh();
    } else {
      fetchGcalEvents(gcalToken);
    }
  }, [gcalToken]);

  useEffect(() => { chatBot.current?.scrollIntoView({behavior:'smooth'}); }, [chat, chatLoad]);
  useEffect(() => { planBot.current?.scrollIntoView({behavior:'smooth'}); }, [chat, chatLoad]);

  // ── Google Calendar functions ──────────────────────────────────────────────
  const fetchGcalEvents = async (token) => {
    if (!token) return;
    setGcalStatus('loading');
    try {
      const now     = new Date();
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const dayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(dayStart)}&timeMax=${encodeURIComponent(dayEnd)}&singleEvents=true&orderBy=startTime`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        // Token expired — try refresh
        const refreshed = await handleTokenRefresh();
        if (!refreshed) {
          setGcalStatus('error');
          setGcalToken(null);
        }
        return;
      }

      const data = await res.json();
      const items = (data.items || [])
        .filter(e => e.start?.dateTime) // skip all-day events
        .map(e => ({
          id:      'gcal_' + e.id,
          title:   e.summary || '(No title)',
          time:    fmtTime(e.start.dateTime),
          endTime: fmtTime(e.end?.dateTime),
          type:    'calendar',
          source:  'google',
          date:    e.start.dateTime,
        }));

      setGcalEvents(items);
      setGcalStatus('connected');
    } catch {
      setGcalStatus('error');
    }
  };

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem('los_gcal_refresh');
    if (!refreshToken) return false;
    try {
      const res  = await fetch('/api/google-refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const data = await res.json();
      if (data.access_token) {
        const newExpiry = Date.now() + data.expires_in * 1000;
        localStorage.setItem('los_gcal_token',  data.access_token);
        localStorage.setItem('los_gcal_expiry', newExpiry.toString());
        setGcalToken(data.access_token);
        setGcalExpiry(newExpiry);
        await fetchGcalEvents(data.access_token);
        return true;
      }
    } catch {}
    return false;
  };

  const connectGcal   = () => { window.location.href = '/api/google-auth?action=init'; };
  const disconnectGcal = () => {
    ['los_gcal_token','los_gcal_expiry','los_gcal_refresh'].forEach(k => localStorage.removeItem(k));
    setGcalToken(null); setGcalExpiry(null); setGcalRefresh(null);
    setGcalEvents([]); setGcalStatus('disconnected');
  };
  const refreshGcal = () => {
    if (gcalToken) fetchGcalEvents(gcalToken);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const doSetup = async () => {
    const n=nameIn.trim(); if(!n) return;
    await store.set('los_p', JSON.stringify({n}));
    setName(n); setReady(true);
  };

  const todayEvs = () => {
    const td = new Date().toDateString();
    return events
      .filter(e => !e.date || new Date(e.date).toDateString() === td)
      .sort((a,b) => (a.time||'').localeCompare(b.time||''));
  };
  const todayFoods = () => {
    const td = new Date().toDateString();
    return foodLog.filter(f => new Date(f.date).toDateString() === td);
  };

  const now         = new Date();
  const greeting    = now.getHours()<12?'morning':now.getHours()<18?'afternoon':'evening';
  const dateStr     = now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const activeGoals = goals.filter(g=>!g.done);
  const doneGoals   = goals.filter(g=>g.done);

  // Merge local + Google Calendar events, sorted by time
  const localTe = todayEvs();
  const allTe   = [...localTe, ...gcalEvents].sort((a,b) => (a.time||'').localeCompare(b.time||''));

  const tf           = todayFoods();
  const todayCals    = tf.reduce((s,f)=>s+(f.calories||0),0);
  const todayProtein = tf.reduce((s,f)=>s+(f.protein||0),0);
  const todayCarbs   = tf.reduce((s,f)=>s+(f.carbs||0),0);
  const todayFat     = tf.reduce((s,f)=>s+(f.fat||0),0);
  const calPct  = Math.min(100,Math.round((todayCals/calorieGoal)*100));
  const calOver = todayCals>=calorieGoal;

  // ── AI ─────────────────────────────────────────────────────────────────────
  const aiCall = async (body) => {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const genBrief = async () => {
    setBriefLoad(true);
    try {
      const evStr = allTe.length
        ? allTe.map(e=>`${e.time||'?'}${e.endTime?'–'+e.endTime:''} ${e.title}`).join('; ')
        : 'none';
      const d = await aiCall({
        model:'claude-sonnet-4-20250514', max_tokens:450,
        messages:[{role:'user',content:
          `Write a warm personal morning brief for ${name} in 2–3 short paragraphs. No bullet points.\n\nDate: ${dateStr}\nEvents today: ${evStr}\nGoals: ${activeGoals.length?activeGoals.map(g=>g.text).join('; '):'none set'}\nCalories so far: ${todayCals}/${calorieGoal} kcal\n\nPara 1: warm greeting + day overview. Para 2: key focus. Para 3: one practical tip + motivating close.`
        }]
      });
      const t = d.content?.[0]?.text || 'Could not generate brief.';
      setBrief(t);
      await store.set('los_b', JSON.stringify({t,d:new Date().toDateString()}));
    } catch { setBrief('Error — please try again.'); }
    setBriefLoad(false);
  };

  const sendChat = async (override) => {
    const msg=(override||chatIn).trim(); if(!msg||chatLoad) return;
    const msgs=[...chat,{role:'user',content:msg}];
    setChat(msgs); setChatIn(''); setChatLoad(true);
    try {
      const evStr = allTe.map(e=>`${e.time||''}${e.endTime?'–'+e.endTime:''} ${e.title}`).join(', ')||'none';
      const d = await aiCall({
        model:'claude-sonnet-4-20250514', max_tokens:600,
        system:`You are a personal life planning assistant for ${name}. Be concise, warm and practical.\nToday: ${dateStr}\nGoals: ${activeGoals.map(g=>g.text).join(', ')||'none'}\nEvents: ${evStr}\nCalories: ${todayCals}/${calorieGoal}`,
        messages:msgs.map(m=>({role:m.role,content:m.content}))
      });
      const reply = d.content?.[0]?.text || "Couldn't respond, try again.";
      const final = [...msgs,{role:'assistant',content:reply}];
      setChat(final);
      await store.set('los_c', JSON.stringify(final.slice(-30)));
    } catch { setChat([...msgs,{role:'assistant',content:'Connection error — try again.'}]); }
    setChatLoad(false);
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const addEvent=async()=>{ if(!evForm.title.trim())return; const u=[...events,{id:Date.now(),...evForm,date:new Date().toISOString()}]; await store.set('los_e',JSON.stringify(u)); setEvents(u); setEvForm({title:'',time:'',endTime:'',type:'work'}); setShowAddEv(false); };
  const delEvent=async(id)=>{ const u=events.filter(e=>e.id!==id); await store.set('los_e',JSON.stringify(u)); setEvents(u); };
  const addGoal=async()=>{ if(!glIn.trim())return; const u=[...goals,{id:Date.now(),text:glIn.trim(),done:false}]; await store.set('los_g',JSON.stringify(u)); setGoals(u); setGlIn(''); setShowAddGl(false); };
  const toggleGoal=async(id)=>{ const u=goals.map(g=>g.id===id?{...g,done:!g.done}:g); await store.set('los_g',JSON.stringify(u)); setGoals(u); };
  const delGoal=async(id)=>{ const u=goals.filter(g=>g.id!==id); await store.set('los_g',JSON.stringify(u)); setGoals(u); };

  // ── Nutrition ──────────────────────────────────────────────────────────────
  const searchFoods=async()=>{ if(!foodQuery.trim())return; setSearchStatus('loading'); setSearchResults([]); try { const res=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodQuery)}&search_simple=1&action=process&json=1&page_size=12&fields=product_name,nutriments`); const data=await res.json(); const results=(data.products||[]).filter(p=>p.product_name?.trim()&&(p.nutriments?.['energy-kcal_100g']||0)>0).slice(0,7).map(p=>({name:p.product_name.trim(),cal:Math.round(p.nutriments['energy-kcal_100g']||0),prot:Math.round(p.nutriments['proteins_100g']||0),carb:Math.round(p.nutriments['carbohydrates_100g']||0),fat:Math.round(p.nutriments['fat_100g']||0)})); setSearchResults(results); setSearchStatus(results.length>0?'done':'empty'); } catch { setSearchStatus('error'); } };
  const addSearchedFood=async()=>{ if(!selectedFood||!portionG)return; const g=parseFloat(portionG); if(isNaN(g)||g<=0)return; const food={id:Date.now(),name:`${selectedFood.name} (${portionG}g)`,calories:Math.round(selectedFood.cal*g/100),protein:Math.round(selectedFood.prot*g/100),carbs:Math.round(selectedFood.carb*g/100),fat:Math.round(selectedFood.fat*g/100),meal:searchMeal,date:new Date().toISOString()}; const u=[...foodLog,food]; await store.set('los_f',JSON.stringify(u)); setFoodLog(u); closeAddFood(); };
  const addManualFood=async()=>{ if(!manualFood.name.trim()||!manualFood.calories)return; const food={id:Date.now(),name:manualFood.name.trim(),calories:parseInt(manualFood.calories)||0,protein:parseFloat(manualFood.protein)||0,carbs:parseFloat(manualFood.carbs)||0,fat:parseFloat(manualFood.fat)||0,meal:manualFood.meal,date:new Date().toISOString()}; const u=[...foodLog,food]; await store.set('los_f',JSON.stringify(u)); setFoodLog(u); setManualFood({name:'',calories:'',protein:'',carbs:'',fat:'',meal:'lunch'}); setShowAddFood(false); };
  const delFood=async(id)=>{ const u=foodLog.filter(f=>f.id!==id); await store.set('los_f',JSON.stringify(u)); setFoodLog(u); };
  const updateGoalCalories=async()=>{ const val=parseInt(prompt('Daily calorie goal (kcal):',calorieGoal)); if(!isNaN(val)&&val>0){await store.set('los_cal',JSON.stringify(val));setCalorieGoal(val);} };
  const closeAddFood=()=>{ setShowAddFood(false); setSelectedFood(null); setPortionG(''); setFoodQuery(''); setSearchResults([]); setSearchStatus('idle'); };

  // ── Reusable event row ─────────────────────────────────────────────────────
  const EventRow = ({ ev }) => (
    <div className="ev">
      <div className="ev-times">
        <span className="ev-time">{ev.time||'—:——'}</span>
        {ev.endTime && <span className="ev-time-end">{ev.endTime}</span>}
      </div>
      <span className="ev-dot" style={{background:EV_COLORS[ev.type]||'#6B7280'}}/>
      <span className="ev-name">{ev.title}</span>
      {ev.source === 'google'
        ? <span className="gcal-badge">gcal</span>
        : <span className="ev-pill" style={{background:(EV_COLORS[ev.type]||'#6B7280')+'15',color:EV_COLORS[ev.type]||'#6B7280'}}>{ev.type}</span>
      }
      {ev.source !== 'google' &&
        <button className="ev-del" onClick={()=>delEvent(ev.id)}><X size={12}/></button>
      }
    </div>
  );

  // ── Setup screen ───────────────────────────────────────────────────────────
  if (!ready) return (
    <div className="app">
      <style>{FONTS+CSS}</style>
      <div className="setup">
        <div className="setup-logo">LIFE<em>OS</em></div>
        <p style={{color:'#6B7280',fontSize:'13.5px',fontFamily:'Spectral,Georgia,serif',fontStyle:'italic',maxWidth:'260px',lineHeight:1.75,marginBottom:'36px'}}>
          Your personal command centre,<br/>powered by Claude AI.
        </p>
        <div style={{width:'100%',maxWidth:'290px'}}>
          <p style={{fontSize:'11px',color:'#9CA3AF',marginBottom:'9px',textAlign:'left',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'.1em'}}>What should I call you?</p>
          <input className="inp" placeholder="First name…" value={nameIn} onChange={e=>setNameIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&doSetup()} autoFocus style={{fontSize:'15px',padding:'11px 12px',marginBottom:'10px'}}/>
          <button className="btn btn-gold" onClick={doSetup} style={{width:'100%',justifyContent:'center',padding:'11px',fontSize:'13px'}}>Begin →</button>
        </div>
      </div>
    </div>
  );

  const ChatMessages = ({endRef}) => (
    <>
      {chat.length===0&&<div style={{textAlign:'center',padding:'22px 8px',color:'#9CA3AF',fontSize:'12.5px'}}>Ask me anything about planning your day, week or goals.</div>}
      {chat.map((m,i)=><div key={i} className={`msg ${m.role==='user'?'msg-u':'msg-a'}`}>{m.content}</div>)}
      {chatLoad&&<div className="msg msg-a" style={{color:'#9CA3AF'}}>Thinking<span className="d1">.</span><span className="d2">.</span><span className="d3">.</span></div>}
      <div ref={endRef}/>
    </>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <style>{FONTS+CSS}</style>

      <div className="hdr">
        <div className="hdr-row">
          <div>
            <div className="logo">LIFE<em>OS</em></div>
            <div className="hdr-date">{dateStr}</div>
          </div>
          <button className="ibtn" onClick={()=>setView('settings')}><Settings size={14}/></button>
        </div>
        <div className="nav">
          {[['today','Today',<Calendar size={12}/>],['nutrition','Nutrition',<Utensils size={12}/>],['goals','Goals',<Target size={12}/>],['planner','Planner',<Zap size={12}/>],['settings','Setup',<Settings size={12}/>]].map(([id,lbl,icon])=>(
            <button key={id} className={`nb${view===id?' on':''}`} onClick={()=>setView(id)}>{icon}{lbl}</button>
          ))}
        </div>
      </div>

      <div className="pg">

        {/* ═══ TODAY ══════════════════════════════════════════════════════ */}
        {view==='today'&&(
          <div className="fi">
            <div style={{marginBottom:'18px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                <div style={{width:3,height:22,background:'#0A5C38',borderRadius:2,flexShrink:0,opacity:.75}}/>
                <h1 className="syn" style={{fontSize:'20px',fontWeight:'800',color:'#111827'}}>Good {greeting}, {name}</h1>
              </div>
              <p className="mono" style={{fontSize:'11px',color:'#9CA3AF',paddingLeft:13}}>{dateStr}</p>
            </div>

            <div className="sg">
              <div className="sc" style={{'--accent':'#2563EB'}}>
                <div className="sc-lbl">Events</div>
                <div className="sc-val" style={{color:'#2563EB'}}>{allTe.length}</div>
                <div className="sc-sub">today</div>
              </div>
              <div className="sc" style={{'--accent':calOver?'#DC2626':'#16A34A'}}>
                <div className="sc-lbl">Calories</div>
                <div className="sc-val" style={{color:calOver?'#DC2626':'#16A34A'}}>{todayCals}</div>
                <div className="sc-sub">of {calorieGoal}</div>
              </div>
              <div className="sc" style={{'--accent':'#7C3AED'}}>
                <div className="sc-lbl">Goals</div>
                <div className="sc-val" style={{color:'#7C3AED'}}>{activeGoals.length}</div>
                <div className="sc-sub">{doneGoals.length} done</div>
              </div>
            </div>

            {/* AI Brief */}
            <div className="card">
              <div className="card-hdr">
                <div className="ctitle" style={{color:'#15803D'}}><span className="cdot" style={{background:'#16A34A'}}/>AI Daily Brief</div>
                <button className="btn btn-ghost btn-sm" onClick={genBrief} disabled={briefLoad}>
                  {briefLoad?<><span className="d1">●</span><span className="d2">●</span><span className="d3">●</span></>:<><RefreshCw size={10}/> Generate</>}
                </button>
              </div>
              {briefLoad
                ?<p style={{color:'#9CA3AF',fontSize:'13px'}}>Claude is crafting your brief<span className="d1">.</span><span className="d2">.</span><span className="d3">.</span></p>
                :brief
                  ?<div className="brief-wrap"><p className="brief-text">{brief}</p></div>
                  :<div className="empty">
                    <div style={{fontSize:'28px',marginBottom:10}}>🌿</div>
                    <p style={{marginBottom:10,fontFamily:'Spectral,Georgia,serif',fontStyle:'italic',fontSize:'13.5px',color:'#6B7280',lineHeight:1.7}}>Generate your personal daily brief<br/>to start the day with clarity.</p>
                    <button className="btn btn-gold btn-sm" onClick={genBrief}>Generate My Brief</button>
                  </div>
              }
            </div>

            {/* Schedule */}
            <div className="card">
              <div className="card-hdr">
                <div className="ctitle" style={{color:'#1D4ED8'}}>
                  <span className="cdot" style={{background:'#2563EB'}}/>
                  Today's Schedule
                  {gcalStatus==='connected'&&<span className="gcal-badge">+gcal</span>}
                </div>
                <div style={{display:'flex',gap:5}}>
                  {gcalStatus==='connected'&&<button className="btn btn-ghost btn-sm" onClick={refreshGcal}><RefreshCw size={10}/></button>}
                  <button className="btn btn-ghost btn-sm" onClick={()=>setShowAddEv(true)}><Plus size={10}/> Add</button>
                </div>
              </div>
              {allTe.length===0
                ?<div className="empty"><Calendar size={22}/><p style={{marginBottom:9}}>No events yet.</p><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddEv(true)}>+ Add Event</button></div>
                :allTe.map(ev=><EventRow key={ev.id} ev={ev}/>)
              }
              {gcalStatus==='loading'&&<p style={{fontSize:'11px',color:'#9CA3AF',marginTop:8,textAlign:'center'}}>Syncing Google Calendar<span className="d1">.</span><span className="d2">.</span><span className="d3">.</span></p>}
            </div>
          </div>
        )}

        {/* ═══ NUTRITION ══════════════════════════════════════════════════ */}
        {view==='nutrition'&&(
          <div className="fi">
            <div style={{marginBottom:'16px'}}><h1 className="sh">Nutrition</h1><p className="ss">{dateStr}</p></div>
            <div className="card">
              <div className="card-hdr"><div className="ctitle" style={{color:'#15803D'}}><span className="cdot" style={{background:'#16A34A'}}/>Calories Today</div><button className="btn btn-ghost btn-sm" onClick={updateGoalCalories}>Goal: {calorieGoal} kcal ✎</button></div>
              <div style={{display:'flex',alignItems:'baseline',gap:7,marginBottom:10}}>
                <span className="syn" style={{fontSize:42,fontWeight:800,lineHeight:1,color:calOver?'#DC2626':'#16A34A'}}>{todayCals}</span>
                <span style={{color:'#9CA3AF',fontSize:13}}>/ {calorieGoal} kcal</span>
                <span style={{marginLeft:'auto',fontSize:11,fontFamily:'JetBrains Mono,monospace',color:calOver?'#DC2626':'#16A34A'}}>{calPct}%</span>
              </div>
              <div className="prog-bar" style={{marginBottom:16}}><div className="prog-fill" style={{width:`${calPct}%`,background:calOver?'#DC2626':'#16A34A'}}/></div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                {[['Protein','#2563EB',todayProtein,150],['Carbs','#D97706',todayCarbs,250],['Fat','#7C3AED',todayFat,70]].map(([lbl,col,val,goal])=>(
                  <div key={lbl}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                      <span className="mono" style={{fontSize:9,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.13em'}}>{lbl}</span>
                      <span className="mono" style={{fontSize:9,color:col}}>{val}g</span>
                    </div>
                    <div className="prog-bar" style={{height:4,background:'#EEF3EC'}}><div className="prog-fill" style={{width:`${Math.min(100,Math.round(val/goal*100))}%`,background:col}}/></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-hdr"><div className="ctitle" style={{color:'#15803D'}}><span className="cdot" style={{background:'#16A34A'}}/>Today's Log</div><button className="btn btn-gold btn-sm" onClick={()=>setShowAddFood(true)}><Plus size={10}/> Log Food</button></div>
              {tf.length===0
                ?<div className="empty"><Utensils size={22}/><p style={{marginBottom:9}}>Nothing logged yet.</p><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddFood(true)}>+ Log First Meal</button></div>
                :MEALS.map(meal=>{ const items=tf.filter(f=>f.meal===meal); if(!items.length) return null; const mc=items.reduce((s,f)=>s+(f.calories||0),0); return(<div key={meal}><div className="meal-lbl">{MEAL_ICONS[meal]} {meal} · <span style={{color:'#6B7280'}}>{mc} kcal</span></div>{items.map(food=>(<div key={food.id} className="food-row"><span style={{flex:1,fontSize:13,color:'#1F2937'}}>{food.name}</span><span className="mono" style={{fontSize:10,color:'#16A34A',flexShrink:0}}>{food.calories} kcal</span>{food.protein>0&&<span className="mono" style={{fontSize:9,color:'#2563EB',flexShrink:0}}>{food.protein}g P</span>}<button className="food-del" onClick={()=>delFood(food.id)}><X size={11}/></button></div>))}</div>); })}
            </div>
          </div>
        )}

        {/* ═══ GOALS ══════════════════════════════════════════════════════ */}
        {view==='goals'&&(
          <div className="fi">
            <div style={{marginBottom:'16px'}}><h1 className="sh">Goals</h1><p className="ss">Track what matters and stay accountable</p></div>
            <div className="card">
              <div className="card-hdr"><div className="ctitle" style={{color:'#15803D'}}><span className="cdot" style={{background:'#16A34A'}}/>Active ({activeGoals.length})</div><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddGl(true)}><Plus size={10}/> Add</button></div>
              {activeGoals.length===0
                ?<div className="empty"><Target size={22}/><p style={{marginBottom:9}}>No active goals yet.</p><button className="btn btn-gold btn-sm" onClick={()=>setShowAddGl(true)}>+ Add First Goal</button></div>
                :activeGoals.map(g=>(<div key={g.id} className="gl"><div className="gl-ck" onClick={()=>toggleGoal(g.id)}/><span className="gl-txt">{g.text}</span><button className="gl-del" onClick={()=>delGoal(g.id)}><Trash2 size={12}/></button></div>))}
            </div>
            {doneGoals.length>0&&(<div className="card"><div className="card-hdr"><div className="ctitle"><span className="cdot"/>Completed ({doneGoals.length})</div></div>{doneGoals.map(g=>(<div key={g.id} className="gl"><div className="gl-ck done" onClick={()=>toggleGoal(g.id)}><Check size={9} color="#FFFFFF"/></div><span className="gl-txt done">{g.text}</span><button className="gl-del" onClick={()=>delGoal(g.id)}><Trash2 size={12}/></button></div>))}</div>)}
            <div className="card" style={{borderColor:'rgba(124,58,237,.2)'}}><div className="card-hdr"><div className="ctitle" style={{color:'#6D28D9'}}><span className="cdot" style={{background:'#7C3AED'}}/>Get AI Goal Ideas</div></div><p style={{fontSize:'12px',color:'#6B7280',marginBottom:'10px',lineHeight:1.65}}>Ask Claude to help you define meaningful goals around fitness, nutrition, career or wellbeing.</p><button className="btn btn-ghost btn-sm" onClick={()=>{setView('planner');sendChat('Help me set meaningful goals for this month');}}>Ask Claude →</button></div>
          </div>
        )}

        {/* ═══ PLANNER ════════════════════════════════════════════════════ */}
        {view==='planner'&&(
          <div className="fi planner">
            <div style={{marginBottom:'13px'}}><h1 className="sh">AI Planner</h1><p className="ss">Plan your days, weeks and months with Claude</p></div>
            <div className="plan-msgs">
              {chat.length===0&&(<div style={{textAlign:'center',padding:'28px 12px',color:'#9CA3AF'}}><Zap size={30} style={{marginBottom:10,opacity:.3}}/><p style={{fontSize:'13.5px',marginBottom:'18px',lineHeight:1.75,fontFamily:'Spectral,Georgia,serif',fontStyle:'italic',color:'#6B7280'}}>Ask me to plan your day, build routines,<br/>set weekly goals, or hold you accountable.</p><div style={{display:'flex',flexDirection:'column',gap:'6px',maxWidth:'310px',margin:'0 auto'}}>{['Plan my ideal morning routine','Help me plan this week productively','What habits should I build?','Create a workout and nutrition schedule'].map(s=>(<button key={s} className="btn btn-ghost" style={{justifyContent:'flex-start',fontSize:'12px',textAlign:'left'}} onClick={()=>sendChat(s)}>{s}</button>))}</div></div>)}
              <ChatMessages endRef={planBot}/>
            </div>
            <div style={{display:'flex',gap:'8px',paddingTop:'11px',borderTop:'1px solid #E8EEE5',flexShrink:0}}>
              <textarea className="cin" rows={2} placeholder="Ask Claude to plan your day, week, or help with goals… (Enter to send)" value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}}} style={{resize:'none'}}/>
              <button className="btn btn-gold" onClick={()=>sendChat()} disabled={chatLoad} style={{alignSelf:'flex-end',padding:'8px 13px'}}>→</button>
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══════════════════════════════════════════════════ */}
        {view==='settings'&&(
          <div className="fi">
            <div style={{marginBottom:'16px'}}><h1 className="sh">Setup Guide</h1><p className="ss">Host online and connect your data sources</p></div>

            {/* Profile */}
            <div className="card">
              <div className="card-hdr"><div className="ctitle" style={{color:'#15803D'}}><span className="cdot" style={{background:'#16A34A'}}/>Profile</div></div>
              <p style={{fontSize:'12.5px',color:'#4B5563',marginBottom:'10px'}}>Name: <strong style={{color:'#111827'}}>{name}</strong></p>
              <button className="btn btn-ghost btn-sm" onClick={async()=>{const n=prompt('Your name:',name);if(n?.trim()){await store.set('los_p',JSON.stringify({n:n.trim()}));setName(n.trim());}}}>Edit Name</button>
            </div>

            {/* Google Calendar — live connection UI */}
            <div className="card" style={{borderColor: gcalStatus==='connected'?'rgba(15,157,88,.3)':'rgba(37,99,235,.25)'}}>
              <div className="card-hdr">
                <div className="ctitle" style={{color: gcalStatus==='connected'?'#0F9D58':'#1D4ED8'}}>
                  <span className="cdot" style={{background: gcalStatus==='connected'?'#0F9D58':'#2563EB'}}/>
                  📅 Google Calendar
                </div>
                <span className={`badge ${gcalStatus==='connected'?'bg-grn':'bg-blu'}`}>
                  {gcalStatus==='connected' ? 'Connected' : 'Phase 2'}
                </span>
              </div>

              {gcalStatus==='connected' ? (
                <div>
                  <p style={{fontSize:'12.5px',color:'#15803D',marginBottom:'4px',fontWeight:500}}>✓ Connected to Google Calendar</p>
                  <p style={{fontSize:'11.5px',color:'#6B7280',marginBottom:'12px',lineHeight:1.6}}>
                    Pulling {gcalEvents.length} event{gcalEvents.length!==1?'s':''} from your calendar today. Events labelled <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'#0F9D58',background:'rgba(15,157,88,.1)',padding:'1px 5px',borderRadius:3}}>gcal</span> in your schedule come from Google Calendar.
                  </p>
                  <div style={{display:'flex',gap:7}}>
                    <button className="btn btn-ghost btn-sm" onClick={refreshGcal}><RefreshCw size={10}/> Refresh Events</button>
                    <button className="btn btn-danger btn-sm" onClick={disconnectGcal}>Disconnect</button>
                  </div>
                </div>
              ) : gcalStatus==='loading' ? (
                <p style={{fontSize:'12px',color:'#9CA3AF'}}>Connecting<span className="d1">.</span><span className="d2">.</span><span className="d3">.</span></p>
              ) : gcalStatus==='error' ? (
                <div>
                  <p style={{fontSize:'12px',color:'#DC2626',marginBottom:'10px'}}>Connection error — your token may have expired.</p>
                  <button className="btn btn-gold btn-sm" onClick={connectGcal}>Reconnect Google Calendar →</button>
                </div>
              ) : (
                <div>
                  <p style={{fontSize:'12px',color:'#6B7280',marginBottom:'10px',lineHeight:1.6}}>Connect your Google Calendar to automatically pull today's events into your dashboard.</p>
                  <button className="btn btn-gold btn-sm" onClick={connectGcal}>Connect Google Calendar →</button>
                </div>
              )}
            </div>

            {/* Other integrations */}
            {[{title:'🏃 Strava',color:'#059669',badge:'bg-grn',label:'Phase 3',desc:'Pulls in your runs, rides and activities.',steps:[{t:'Create a Strava API app',d:'strava.com/settings/api → Create App → use your Vercel URL.'},{t:'Note your credentials',d:'Copy Client ID and Client Secret.'},{t:'Add to Vercel',d:'Environment Variables → STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET.'},{t:'Ask Claude to add it',d:'Tell Claude: "Add Strava OAuth to my LifeOS."'}]},
              {title:'💼 RotaCloud',color:'#7C3AED',badge:'bg-pur',label:'Phase 4',desc:'Syncs your work shifts into your daily schedule.',steps:[{t:'Get your RotaCloud API key',d:'Settings → Integrations → API Key → Generate.'},{t:'Add to Vercel',d:'Environment Variables → ROTACLOUD_API_KEY.'},{t:'Ask Claude to add it',d:'Tell Claude: "Add RotaCloud to my LifeOS."'}]},
              {title:'🎙 Telegram Voice Notes',color:'#D97706',badge:'bg-warn',label:'Phase 5',desc:'Send voice notes to a Telegram bot — Claude transcribes them and adds events, goals and notes automatically.',steps:[{t:'Create a Telegram bot',d:'Message @BotFather on Telegram → /newbot → copy your bot token.'},{t:'Sign up for Make.com',d:'make.com → Free account.'},{t:'Build the scenario',d:'Telegram trigger → OpenAI Whisper (transcribe) → Claude (extract data) → Supabase (store).'},{t:'Ask Claude to connect Life OS',d:'Tell Claude: "Update my LifeOS to read from Supabase in addition to localStorage."'}]}
            ].map(int=>(
              <div key={int.title} className="card" style={{borderColor:int.color+'28'}}>
                <div className="card-hdr"><div className="ctitle" style={{color:int.color}}><span className="cdot" style={{background:int.color}}/>{int.title}</div><span className={`badge ${int.badge}`}>{int.label}</span></div>
                <p style={{fontSize:'12px',color:'#6B7280',marginBottom:'10px',lineHeight:1.6}}>{int.desc}</p>
                {int.steps.map((s,i)=>(<div key={i} className="step"><div className="snum">{i+1}</div><div><div className="stitle">{s.t}</div><div className="sdesc">{s.d}</div></div></div>))}
              </div>
            ))}

            {/* Reset */}
            <div className="card">
              <div className="card-hdr"><div className="ctitle"><span className="cdot"/>Reset</div></div>
              <p style={{fontSize:'11.5px',color:'#9CA3AF',marginBottom:'10px'}}>Clear all saved data. Cannot be undone.</p>
              <button className="btn btn-danger btn-sm" onClick={()=>{if(confirm('Reset all data?')){['los_p','los_g','los_e','los_b','los_c','los_f','los_cal','los_gcal_token','los_gcal_expiry','los_gcal_refresh'].forEach(k=>localStorage.removeItem(k));window.location.reload();}}}><Trash2 size={11}/> Reset LifeOS</button>
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      {view!=='planner'&&<button className="fab" onClick={()=>setShowChat(true)}><MessageCircle size={20}/></button>}

      {/* CHAT OVERLAY */}
      {showChat&&(<div className="chat-bg" onClick={e=>{if(e.target===e.currentTarget)setShowChat(false);}}><div className="chat-pnl"><div className="chat-hdr"><div><div className="syn" style={{fontWeight:700,fontSize:'13.5px',color:'#111827'}}>Quick Planner</div><div className="mono" style={{fontSize:'9.5px',color:'#9CA3AF'}}>Powered by Claude</div></div><button className="ibtn" onClick={()=>setShowChat(false)}><X size={13}/></button></div><div className="chat-msgs"><ChatMessages endRef={chatBot}/></div><div className="chat-in"><textarea className="cin" rows={2} placeholder="Plan my day, set goals, review my week…" value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}}} style={{resize:'none'}}/><button className="btn btn-gold" onClick={()=>sendChat()} disabled={chatLoad} style={{alignSelf:'flex-end'}}>→</button></div></div></div>)}

      {/* ADD EVENT — with start + end time */}
      {showAddEv&&(<div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)setShowAddEv(false);}}><div className="modal">
        <h3>Add Event</h3>
        <input className="inp" placeholder="Event title…" value={evForm.title} onChange={e=>setEvForm(f=>({...f,title:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addEvent()} autoFocus/>
        <div className="inp-row">
          <div>
            <div className="inp-lbl">Start time</div>
            <input className="inp" type="time" value={evForm.time} onChange={e=>setEvForm(f=>({...f,time:e.target.value}))}/>
          </div>
          <div>
            <div className="inp-lbl">End time</div>
            <input className="inp" type="time" value={evForm.endTime} onChange={e=>setEvForm(f=>({...f,endTime:e.target.value}))}/>
          </div>
        </div>
        <select className="sel" value={evForm.type} onChange={e=>setEvForm(f=>({...f,type:e.target.value}))}>
          <option value="work">💼 Work</option><option value="personal">🏠 Personal</option>
          <option value="fitness">🏃 Fitness</option><option value="health">❤️ Health</option><option value="social">👥 Social</option>
        </select>
        <div className="row-btns"><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddEv(false)}>Cancel</button><button className="btn btn-gold btn-sm" onClick={addEvent}>Add</button></div>
      </div></div>)}

      {/* ADD GOAL */}
      {showAddGl&&(<div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)setShowAddGl(false);}}><div className="modal"><h3>Add Goal</h3><input className="inp" placeholder="e.g. Run 3× per week…" value={glIn} onChange={e=>setGlIn(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addGoal()} autoFocus/><div className="row-btns"><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddGl(false)}>Cancel</button><button className="btn btn-gold btn-sm" onClick={addGoal}>Add Goal</button></div></div></div>)}

      {/* ADD FOOD */}
      {showAddFood&&(<div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)closeAddFood();}}><div className="modal" style={{maxWidth:400}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:13}}><h3 style={{margin:0}}>Log Food</h3><div style={{display:'flex',gap:5}}><button className={`btn btn-sm ${addMode==='search'?'btn-gold':'btn-ghost'}`} onClick={()=>{setAddMode('search');setSelectedFood(null);setPortionG('');}}><Search size={10}/> Search</button><button className={`btn btn-sm ${addMode==='manual'?'btn-gold':'btn-ghost'}`} onClick={()=>setAddMode('manual')}>✎ Manual</button></div></div>
        {addMode==='search'&&!selectedFood&&(<><div style={{display:'flex',gap:7,marginBottom:9}}><input className="inp" placeholder="Search foods…" value={foodQuery} onChange={e=>setFoodQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchFoods()} autoFocus style={{margin:0,flex:1}}/><button className="btn btn-ghost btn-sm" onClick={searchFoods} disabled={searchStatus==='loading'} style={{flexShrink:0}}>{searchStatus==='loading'?<><span className="d1">●</span><span className="d2">●</span><span className="d3">●</span></>:<Search size={12}/>}</button></div><p style={{fontSize:'10.5px',color:'#9CA3AF',marginBottom:9,lineHeight:1.5}}>Powered by Open Food Facts. Use Manual for fresh ingredients.</p>{searchStatus==='done'&&searchResults.map((r,i)=>(<div key={i} className="sr" onClick={()=>setSelectedFood(r)}><span style={{fontSize:12,flex:1,lineHeight:1.4,color:'#1F2937'}}>{r.name}</span><span className="mono" style={{fontSize:9.5,color:'#16A34A',flexShrink:0}}>{r.cal} kcal/100g</span></div>))}{searchStatus==='empty'&&<p style={{fontSize:'12px',color:'#9CA3AF',padding:'8px 0'}}>No results — try different terms or use Manual.</p>}{searchStatus==='error'&&<p style={{fontSize:'12px',color:'#DC2626',padding:'8px 0'}}>Search failed — use Manual entry.</p>}<div className="row-btns" style={{marginTop:6}}><button className="btn btn-ghost btn-sm" onClick={closeAddFood}>Cancel</button></div></>)}
        {addMode==='search'&&selectedFood&&(<><div style={{background:'#F7FAF6',border:'1px solid #DDE8DA',borderRadius:8,padding:'10px 12px',marginBottom:11}}><div style={{fontSize:12.5,fontWeight:600,marginBottom:4,color:'#111827'}}>{selectedFood.name}</div><div className="mono" style={{fontSize:9.5,color:'#9CA3AF'}}>Per 100g: {selectedFood.cal} kcal · {selectedFood.prot}g P · {selectedFood.carb}g C · {selectedFood.fat}g F</div></div><input className="inp" type="number" placeholder="Portion size (grams)" value={portionG} onChange={e=>setPortionG(e.target.value)} autoFocus min="1"/>{portionG&&parseFloat(portionG)>0&&(<div style={{background:'rgba(22,163,74,.07)',border:'1px solid rgba(22,163,74,.18)',borderRadius:7,padding:'8px 11px',marginBottom:8}}><span className="mono" style={{fontSize:11,color:'#16A34A'}}>→ {Math.round(selectedFood.cal*portionG/100)} kcal · {Math.round(selectedFood.prot*portionG/100)}g P · {Math.round(selectedFood.carb*portionG/100)}g C · {Math.round(selectedFood.fat*portionG/100)}g F</span></div>)}<select className="sel" value={searchMeal} onChange={e=>setSearchMeal(e.target.value)}>{MEALS.map(m=><option key={m} value={m}>{MEAL_ICONS[m]} {m.charAt(0).toUpperCase()+m.slice(1)}</option>)}</select><div className="row-btns"><button className="btn btn-ghost btn-sm" onClick={()=>{setSelectedFood(null);setPortionG('');}}>← Back</button><button className="btn btn-gold btn-sm" onClick={addSearchedFood} disabled={!portionG||parseFloat(portionG)<=0}>Add Food</button></div></>)}
        {addMode==='manual'&&(<><input className="inp" placeholder="Food name…" value={manualFood.name} onChange={e=>setManualFood(f=>({...f,name:e.target.value}))} autoFocus/><input className="inp" type="number" placeholder="Calories (kcal) *" value={manualFood.calories} onChange={e=>setManualFood(f=>({...f,calories:e.target.value}))} min="0"/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:7,marginBottom:8}}>{[['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([k,ph])=>(<input key={k} className="inp" type="number" placeholder={ph} value={manualFood[k]} onChange={e=>setManualFood(f=>({...f,[k]:e.target.value}))} style={{margin:0}} min="0"/>))}</div><select className="sel" value={manualFood.meal} onChange={e=>setManualFood(f=>({...f,meal:e.target.value}))}>{MEALS.map(m=><option key={m} value={m}>{MEAL_ICONS[m]} {m.charAt(0).toUpperCase()+m.slice(1)}</option>)}</select><div className="row-btns"><button className="btn btn-ghost btn-sm" onClick={()=>setShowAddFood(false)}>Cancel</button><button className="btn btn-gold btn-sm" onClick={addManualFood} disabled={!manualFood.name.trim()||!manualFood.calories}>Add Food</button></div></>)}
      </div></div>)}
    </div>
  );
}
