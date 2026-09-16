import { useState, useEffect, useRef } from "react";
import { BedDouble, Camera, Sparkles, Home as HomeIcon, MessageSquare, Film, Mountain, MountainSnow, ShieldCheck, Recycle, MapPin, Phone, Mail, Clock, MessageCircle, Lock, CheckCircle2, Send, CalendarDays, Star, Handshake, UtensilsCrossed, Helicopter, CarFront, FlameKindling, SquareParking, Leaf, Sun, Flower2, Heart, ChevronLeft, ChevronRight, Users, ScrollText, CalendarX, Baby, PawPrint, Wrench, Ban, AlertTriangle } from "lucide-react";
// Web-optimized 720p copies (scripts/compress-videos.js) — originals kept in videos/
import homestayVideo from "./assets/videos-opt/homestay-tour.mp4";
import frontVideo from "./assets/videos-opt/front.mp4";
import videoInside from "./assets/videos-opt/1000143760.mp4";
import videoAround from "./assets/videos-opt/1000143765.mp4";
import logoImg from "./assets/images/logo-opt.png";
// ─── LOCAL IMAGES (optimized copies — see scripts/optimize-images.js) ──────
import imgGuest1 from "./assets/images/galllery-opt/guest1.jpg";
import imgGuest2 from "./assets/images/galllery-opt/guest2.jpg";
import imgGuest3 from "./assets/images/galllery-opt/guest3.jpg";
import imgGuest4 from "./assets/images/galllery-opt/guest4.jpg";
import imgIce1 from "./assets/images/galllery-opt/ice1.jpg";
import imgIce3 from "./assets/images/galllery-opt/ice3.jpg";
import imgIce4 from "./assets/images/galllery-opt/ice4.jpg";
import imgAround1 from "./assets/images/galllery-opt/img-20250324-112231-jpg.jpg";
import imgAround2 from "./assets/images/galllery-opt/img-20250324-112526-jpg.jpg";
import roomImg1 from "./assets/images/Rooms-opt/img-20250324-111957-jpg.jpg";
import roomImg2 from "./assets/images/Rooms-opt/img-20250324-112045-jpg.jpg";
import roomImg3 from "./assets/images/Rooms-opt/img-20250324-112130-jpg.jpg";
import roomImg4 from "./assets/images/Rooms-opt/img-20250324-112214-jpg.jpg";
import roomImg5 from "./assets/images/Rooms-opt/img-20250324-112335-jpg.jpg";
import roomImg6 from "./assets/images/Rooms-opt/img-20250324-112351-jpg.jpg";
import roomImg7 from "./assets/images/Rooms-opt/img-20250324-112626-jpg.jpg";
import roomImg8 from "./assets/images/Rooms-opt/img-20250324-112644-jpg.jpg";
import roomImg9 from "./assets/images/Rooms-opt/img-20250324-112649-jpg.jpg";
import roomImgHero from "./assets/images/Rooms-opt/hero.jpg";
import roomImg10 from "./assets/images/Rooms-opt/img-20250324-112231-jpg.jpg";
import roomImg11 from "./assets/images/Rooms-opt/img-20250324-112526-jpg.jpg";
// Room card images — one per room type, from Rooms/room_front (exact names kept)
import imgDelux from "./assets/images/Rooms-opt/room_front/delux.jpeg";
import imgSuperDelux from "./assets/images/Rooms-opt/room_front/superDelux.jpeg";
import imgStandard from "./assets/images/Rooms-opt/room_front/Standard.jpeg";
import imgShared from "./assets/images/Rooms-opt/room_front/shared.jpeg";
// Guest review avatars (src/assets/images/reviews — file name = reviewer name)
import reviewAmmi from "./assets/images/reviews/Ammi.jpeg";
import reviewJuliana from "./assets/images/reviews/juliana.jpeg";
import reviewPrashant from "./assets/images/reviews/prashant.jpeg";
import reviewPriya from "./assets/images/reviews/priya.jpeg";
import reviewSahil from "./assets/images/reviews/sahil.jpeg";
import reviewSweta from "./assets/images/reviews/Sweta.jpeg";
// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID       = "service_e4gi90r";          
const EMAILJS_PUBLIC_KEY       = "cqWBlZliX0aLNQQDB";        
const EMAILJS_BOOKING_TEMPLATE = "template_r4zfcvr"; 
const EMAILJS_CONTACT_TEMPLATE = "template_poipe2s"; 

// ─── WHATSAPP BOOKING ───────────────────────────────────────────────────────
const WA_NUMBER = "919084956304";
const WA_BOOKING_MESSAGE = [
  "Hello! I'd like to book a stay at Shivalik Ice Hills, Guptkashi.",
  "",
  "Room Type: ",
  "📅 Check-in: ",
  "📅 Check-out: ",
  "👥 Guests: ",
  "",
  "Please share availability and best rates. Thank you!"
].join("\n");
const WA_BOOKING_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_BOOKING_MESSAGE)}`;

// Exact Google Maps listing for the property (footer "Directions" + contact "Open in Google Maps")
const MAPS_URL = "https://www.google.com/maps/place/Shivalik+ice+hills/@30.5208225,79.0676562,15z/data=!4m14!1m7!3m6!1s0x39083528eb09d773:0x57460e45a1e158ae!2sShivalik+ice+hills!8m2!3d30.5207834!4d79.0676048!16s%2Fg%2F11s3bmcvr9!3m5!1s0x39083528eb09d773:0x57460e45a1e158ae!8m2!3d30.5207834!4d79.0676048!16s%2Fg%2F11s3bmcvr9";
// Opens Google's pre-filled "write a review" dialog directly (placeid verified
// against the Maps listing: Shivalik ice hills, Dewar, Guptkashi, Uttarakhand)
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJc9cJ6yg1CDkRrljhoUUORlc";

// Helper: sends email via EmailJS REST API (no npm package needed)
async function sendEmail(templateId, templateParams) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id:  EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id:     EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  });
  if (!res.ok) throw new Error("EmailJS failed: " + res.status);
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const ROOMS = [
  {
    id: 1, name: "Himalayan Suite", type: "Deluxe", price: 3500,
    available: true, maxGuests: 3,
    description: "Wake up to breathtaking Kedarnath peaks. Spacious suite with panoramic mountain views, premium bedding, and a private sit-out.",
    amenities: ["Mountain View", "WiFi", "Hot Water", "Heater", "Attached Bath", "Room Service"],
    images: [imgDelux],
    badge: "Most Popular"
  },
  {
    id: 2, name: "Valley Retreat", type: "Standard", price: 2200,
    available: true, maxGuests: 2,
    description: "Cozy, budget-friendly room overlooking the lush Mandakini valley. Perfect for couples seeking peace and warmth.",
    amenities: ["Valley View", "WiFi", "Hot Water", "Heater", "Attached Bath"],
    images: [imgStandard],
    badge: null
  },
  {
    id: 3, name: "Pilgrim's Nest", type: "Shared", price: 1400,
    available: true, maxGuests: 2,
    description: "Simple, warm and comfortable shared accommodation. Ideal for Kedarnath pilgrims needing a clean restful stay before the yatra.",
    amenities: ["WiFi", "Hot Water", "Heater", "Common Bath"],
    images: [imgShared],
    badge: "Best Value"
  },
  {
    id: 4, name: "Forest Cottage", type: "Super Deluxe", price: 4200,
    available: true, maxGuests: 4,
    description: "Private wooden cottage nestled in deodar forest. Complete privacy with fireplace, sit-out and family capacity.",
    amenities: ["Forest View", "WiFi", "Hot Water", "Fireplace", "Parking", "Kitchenette"],
    images: [imgSuperDelux],
    badge: "Private"
  }
];

const TESTIMONIALS = [
  { name: "Prashant Chauhan", location: "Delhi", rating: 5, photo: reviewPrashant,
    text: "Perfect base for the Kedarnath yatra. The Chaukhamba peak view from our room was unreal, and the home-cooked Garhwali food after a long trek felt like a blessing. Clean rooms, kind hosts — I can't wait to come back." },
  { name: "Sahil Negi", location: "Chandigarh", rating: 5, photo: reviewSahil,
    text: "Hot water at 5am before the trek, honest advice on timings, and a bonfire with chai and mountain stories at night. Shivalik Ice Hills takes care of everything so you only have to enjoy the yatra." },
  { name: "Priya", location: "Dehradun", rating: 5, photo: reviewPriya,
    text: "I drove up from Dehradun with my parents for a quiet break and got so much more. We spent mornings on village walks and evenings around the bonfire, and the home-cooked food tasted just like a meal at my nani's place. None of us wanted to leave." },
  { name: "Sweta", location: "Lucknow", rating: 4, photo: reviewSweta,
    text: "Traveling solo from Lucknow, I was nervous about staying in a homestay — within a day, the family had me feeling like one of their own. They arranged my cab and helped plan every little detail. The network in my room was patchy, but honestly? It gave me the digital detox I didn't know I needed." },
  { name: "Ammi", location: "USA", rating: 5, photo: reviewAmmi,
    text: "I came here for yoga and found real peace and nature here. Morning practice with the Himalayas in view, birdsong instead of traffic, and meals straight from the garden. I'm leaving calmer than I've ever been." },
  { name: "Juliana", location: "Goa", rating: 5, photo: reviewJuliana,
    text: "I traded Goa's beaches for the Himalayas and I'd do it again tomorrow. What stays with me isn't just the Kedarnath darshan — it's the hot chai after long walks, dinner with the family, and sunsets over the valley. This place has a piece of my heart." },
];

const GALLERY = [
  { url: imgIce1,     cat: "Views",        label: "Shivalik Ice Hills" },
  { url: imgIce3,     cat: "Views",        label: "Mountain Vistas" },
  { url: imgIce4,     cat: "Views",        label: "Chaukhamba View" },
  { url: imgGuest1,   cat: "Guests",       label: "Happy Guests" },
  { url: imgGuest2,   cat: "Guests",       label: "Guest Moments" },
  { url: imgGuest3,   cat: "Guests",       label: "Memories at the Homestay" },
  { url: imgGuest4,   cat: "Guests",       label: "Our Visitors" },
  { url: imgAround1,  cat: "Surroundings", label: "Village and Peak View" },
  { url: imgAround2,  cat: "Surroundings", label: "Nearby Trails" },
];

// All room photos shown on the "See More Images" page
const ROOM_PHOTOS = [roomImg1, roomImg2, roomImg3, roomImg4, roomImg5, roomImg6, roomImg7, roomImg8, roomImg9, roomImgHero, roomImg10, roomImg11];

const SERVICES = [
  { Icon: UtensilsCrossed, title: "Home-Cooked Meals", desc: "Authentic Garhwali cuisine made with local ingredients. Breakfast, lunch & dinner available." },
  { Icon: Helicopter, title: "Helipad Near: 4 km", desc: "Helipad just 4 km from the property — perfect for heli-yatra to Kedarnath and quick mountain transfers." },
  { Icon: CarFront, title: "Pickup & Drop", desc: "We can arrange a cab for local visits and nearby sightseeing on request." },
  { Icon: FlameKindling, title: "Bonfire Evenings", desc: "Cozy evening bonfires under the stars with chai, local music and mountain stories." },
  { Icon: SquareParking, title: "Free Parking", desc: "Secure on-site parking for cars and bikes." },
  { Icon: Leaf, title: "Nature Walks", desc: "Guided morning walks through the village and to the local temple, with stories of mountain life." },
  { Icon: Mountain, title: "Serene Chaukhamba Peak View", desc: "Wake up to a serene, unobstructed view of the Chaukhamba peak right from the property." },
  { Icon: Flower2, title: "Nature & Serenity", desc: "Enjoy a peaceful stay surrounded by greenery, mountains, and the sounds of nature." },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────
const CSS = `
  /* Google Fonts are loaded via <link> in public/index.html (non-blocking) */


  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  :root {
    --ice: #e8f4f8;
    --snow: #f7fbfc;
    --glacier: #c5dde8;
    --peak: #1a3a4a;
    --pine: #2d5a3d;
    --gold: #c8963e;
    --rust: #b5451b;
    --text: #1c2b35;
    --muted: #5a7380;
    --border: #d0e4ec;
    --card: rgba(255,255,255,0.92);
    --shadow: 0 4px 32px rgba(26,58,74,0.12);
    --shadow-lg: 0 16px 64px rgba(26,58,74,0.2);
    --radius: 16px;
    --radius-sm: 8px;
    --transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--snow);
    color: var(--text);
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    width: 100%;
  }

  h1,h2,h3,h4 { font-family: 'Cormorant Garamond', serif; line-height: 1.2; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--ice); }
  ::-webkit-scrollbar-thumb { background: var(--glacier); border-radius: 3px; }

  /* ── NAVBAR ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 70px;
    transition: var(--transition);
    width: 100%;
    max-width: 100%;
  }
  .nav.scrolled {
    background: rgba(26,58,74,0.96);
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 20px rgba(0,0,0,0.2);
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-logo-icon { font-size: 1.6rem; display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; background: #ffffff; border-radius: 50%; padding: 5px; box-shadow: 0 3px 10px rgba(0,0,0,0.35); flex-shrink: 0; }
  .nav-logo-img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .nav-logo-text { color: white; font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 600; line-height: 1.1; }
  .nav-logo-sub { font-size: 0.65rem; letter-spacing: 0.15em; font-family: 'DM Sans', sans-serif; font-weight: 300; opacity: 0.8; color:white; }
  .nav-links { display: flex; gap: 2rem; align-items: center; }
  .nav-links a { color: rgba(255,255,255,0.88); text-decoration: none; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.02em; transition: color 0.2s; }
  .nav-links a:hover { color: var(--gold); }
  .nav-cta {
    background: var(--gold); color: var(--peak) !important; padding: 0.5rem 1.25rem;
    border-radius: 50px; font-weight: 600 !important; transition: var(--transition) !important;
  }
  .nav-cta:hover { background: #e0a845 !important; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(200,150,62,0.4); }
  .nav-hamburger { display: none; background: none; border: none; cursor: pointer; color: white; font-size: 1.4rem; padding: 0.5rem; margin: -0.5rem; }

  @media (max-width: 768px) {
    /* Phone: extra breathing room so the logo and menu button don't hug the top edge */
    .nav { height: 80px; padding: 8px 1.25rem; }
    .nav-links { display: none; }
    .nav-hamburger { display: block; }
    .nav-links.open {
      display: flex; flex-direction: column; position: absolute;
      top: 80px; left: 0; right: 0; padding: 1.5rem 2rem 2rem;
      background: rgba(26,58,74,0.98); backdrop-filter: blur(12px);
      gap: 1.25rem; align-items: flex-start;
    }
    /* Mobile menu: each link stretches across the full row, so tapping the
       blank space beside the label works too — not just the text itself.
       Extra vertical padding also gives a comfortable thumb-sized target. */
    .nav-links.open a {
      display: block; width: 100%;
      padding: 0.6rem 0;
      border-radius: 8px;
    }
    .nav-links.open a:active { background: rgba(255,255,255,0.1); }
    /* The Directions pill keeps its shape but also spans the full row */
    .nav-links.open .nav-cta { text-align: center; padding: 0.6rem 1.25rem; }
  }

  /* ── HERO ── */
  .hero {
    height: 100vh; min-height: 600px;
    position: relative; display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    padding: 110px 0 3rem; /* keeps hero content clear of the fixed 70px navbar */
  }
  .hero-bg {
    position: absolute; inset: -3%;
    background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80') center/cover no-repeat;
    width: 104%;
    animation: heroKenBurns 28s ease-in-out infinite alternate;
    will-change: transform;
  }
  /* Slow cinematic zoom-pan over the SAME image — feels like a moving camera, no video needed */
  @keyframes heroKenBurns {
    from { transform: scale(1)    translate(0, 0); }
    40%  { transform: scale(1.08) translate(-1.2%, 0.6%); }
    75%  { transform: scale(1.14) translate(1%, -0.8%); }
    to   { transform: scale(1.18) translate(-0.6%, 0.4%); }
  }
  /* Drifting snow particles layer */
  .hero-snow {
    position: absolute; inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
  }
  .hero-snow span {
    position: absolute; top: -4%;
    display: block; width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.7);
    box-shadow: 0 0 6px 1px rgba(255,255,255,0.35);
    animation: snowFall linear infinite;
  }
  @keyframes snowFall {
    0%   { transform: translate3d(0, -10px, 0) ; opacity: 0; }
    8%   { opacity: 0.9; }
    50%  { transform: translate3d(14px, 55vh, 0); }
    100% { transform: translate3d(-10px, 108vh, 0); opacity: 0.2; }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-bg { animation: none; }
    .hero-snow { display: none; }
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(10,30,42,0.65) 0%, rgba(26,58,74,0.45) 50%, rgba(10,20,30,0.7) 100%);
  }
  .hero-content {
    position: relative; z-index: 2; text-align: center;
    padding: 0 1.5rem; max-width: 900px;
    animation: heroFade 1.2s ease forwards;
  }
  @keyframes heroFade { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(200,150,62,0.2); border: 1px solid rgba(200,150,62,0.5);
    color: #f0c060; padding: 0.35rem 1rem; border-radius: 50px;
    font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 1.25rem; backdrop-filter: blur(4px);
  }
  .hero h1 {
    font-size: clamp(2.8rem, 7vw, 5.5rem); font-weight: 700; color: white;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3); margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }
  .hero h1 span { color: var(--gold); font-style: italic; }
  .hero-tagline {
    font-size: clamp(1rem, 2.5vw, 1.3rem); color: rgba(255,255,255,0.85);
    font-family: 'DM Sans', sans-serif; font-weight: 300; letter-spacing: 0.02em;
    margin-bottom: 2.5rem;
  }
  .hero-stats {
    display: flex; gap: 2.5rem; justify-content: center; margin-bottom: 2.5rem; flex-wrap: wrap;
  }
  .hero-stat { text-align: center; }
  .hero-stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 700; color: var(--gold); }
  .hero-stat-label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
  .hero-scroll { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); animation: bounce 2s infinite; }
  .hero-scroll-line { width: 1px; height: 50px; background: linear-gradient(to bottom, rgba(255,255,255,0.6), transparent); margin: 0 auto 6px; }
  .hero-scroll-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; margin: 0 auto; }
  @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
  /* Mobile: kill the huge centered dead-space — hero text starts just under the navbar */
  @media (max-width: 768px) {
    .hero {
      height: auto; min-height: 100vh; min-height: 100svh;
      align-items: flex-start;
      /* Extra top padding: a clear gap between the navbar and the
         "Top-Rated Homestay" badge so the two never feel cramped */
      padding: 114px 0 4rem;
    }
    .hero-content { padding: 0 1.25rem; }
    .hero-badge { margin-bottom: 1rem; }
    .hero-tagline { margin-bottom: 1.75rem; }
    .hero-stats { gap: 1.1rem 1.6rem; margin-bottom: 1.75rem; }
    .hero-stat-num { font-size: 1.6rem; }
  }

  /* ── SECTIONS ── */
  .section { padding: 4rem 1.5rem; max-width: 1200px; margin: 0 auto; }
  .section-full { padding: 4rem 1.5rem; }
  .section-label {
    font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;
    color: #a1761f; font-weight: 600; margin-bottom: 0.5rem; display: inline-flex; align-items: center;
  }
  .testimonials-inner .section-label, .video-inner .section-label { color: var(--gold); }
  .section-title { font-size: clamp(2rem, 4vw, 3rem); color: var(--peak); margin-bottom: 0.75rem; }
  .section-sub { color: var(--muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.25rem; }
  .section-header-row { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem; }
  /* Rooms section: tighter flow from heading → chips → slider */
  #rooms .section-sub { margin-bottom: 1rem; }
  #rooms .section-header-row { margin-bottom: 0.9rem; }
  #rooms .filter-bar { margin-bottom: 2rem; }
  /* Tighten the dead space between the Why Stay cards and Our Rooms heading */
  #why { padding-bottom: 2.5rem; }
  #rooms { padding-top: 3rem; }

  /* ── DIVIDER ── */
  .divider { height: 1px; background: linear-gradient(to right, transparent, var(--glacier), transparent); max-width: 1200px; margin: 0 auto; }

  /* ── ROOMS ── */
  .filter-bar { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .filter-chip {
    padding: 0.45rem 1.1rem; border-radius: 50px; border: 1.5px solid var(--border);
    background: white; font-size: 0.82rem; font-weight: 500; cursor: pointer;
    transition: var(--transition); color: var(--muted);
  }
  .filter-chip:hover { border-color: var(--peak); color: var(--peak); }
  .filter-chip.active { background: var(--peak); color: white; border-color: var(--peak); }
  /* ── Premium center-focus room slider ── */
  .rooms-slider {
    --room-w: 760px;
    position: relative; max-width: 1280px; margin: 0 auto;
    /* Hugs the card height (~470px) so no dead space sits between the heading and slider */
    height: 490px; outline: none;
  }
  .room-card {
    position: absolute; top: 50%; left: 50%;
    width: min(var(--room-w), 94vw);
    display: flex; flex-direction: column;
    background: white; border-radius: 20px; overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    transform: translate(-50%, -50%) scale(0.72);
    opacity: 0; visibility: hidden; pointer-events: none;
    /* Smooth glide: transform + blur + opacity all tween together as a card
       changes role (active ↔ side), so neighbours never snap or pop.
       No will-change here — promoting 4 large blurred cards tanks scroll perf. */
    transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 0.6s ease, visibility 0s linear 0.6s,
                box-shadow 0.6s ease, filter 0.6s ease;
  }
  .room-card.is-active {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1; visibility: visible; pointer-events: auto; z-index: 3;
    /* Appearing states flip visibility instantly so cards fade in, not pop */
    transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 0.6s ease, visibility 0s,
                box-shadow 0.6s ease, filter 0.6s ease;
  }
  .room-card.is-left, .room-card.is-right {
    opacity: 0.38; visibility: visible; z-index: 1;
    filter: blur(2.5px) saturate(0.85);
    box-shadow: var(--shadow);
    pointer-events: auto; cursor: pointer;
    transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                opacity 0.6s ease, visibility 0s,
                box-shadow 0.6s ease, filter 0.6s ease;
  }
  .room-card.is-left  { transform: translate(calc(-50% - 160px), -50%) scale(0.8); }
  .room-card.is-right { transform: translate(calc(-50% + 160px), -50%) scale(0.8); }
  .room-card.is-left:hover, .room-card.is-right:hover { opacity: 0.45; filter: blur(1.5px) saturate(0.9); }
  .room-img { position: relative; height: 240px; overflow: hidden; flex-shrink: 0; }
  .room-img img { width: 100%; height: 100%; object-fit: cover; }
  .rooms-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 48px; height: 48px; border-radius: 50%;
    background: white; color: var(--peak); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 5; box-shadow: var(--shadow); transition: var(--transition);
  }
  .rooms-arrow:hover { background: var(--peak); color: white; }
  .rooms-arrow.prev { left: calc(50% - var(--room-w) / 2 - 70px); }
  .rooms-arrow.next { right: calc(50% - var(--room-w) / 2 - 70px); }
  .rooms-dots { display: flex; justify-content: center; gap: 8px; margin-top: 1.25rem; }
  .room-dot {
    width: 9px; height: 9px; border-radius: 50%; border: none; padding: 0;
    background: var(--glacier); cursor: pointer; transition: var(--transition);
  }
  .room-dot.active { background: var(--peak); transform: scale(1.3); }
  .room-badge {
    position: absolute; top: 12px; left: 12px;
    background: var(--gold); color: white; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 50px;
  }
  .room-body { padding: 1.1rem 1.5rem 1.25rem; display: flex; flex-direction: column; flex: 1; }
  .room-topline { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 0.5rem; }
  .room-type { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .room-guests { display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; color: var(--muted); white-space: nowrap; }
  .room-name { font-size: 1.3rem; color: var(--peak); margin-bottom: 0.5rem; }
  .room-desc { font-size: 0.875rem; color: var(--muted); line-height: 1.6; margin-bottom: 0.75rem; }
  .room-amenities { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
  .amenity-tag {
    background: var(--ice); color: var(--peak); font-size: 0.72rem;
    padding: 0.25rem 0.65rem; border-radius: 50px; border: 1px solid var(--glacier);
  }
  .room-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-top: auto; }
  .room-book-btn { min-width: 150px; text-align: center; flex-shrink: 0; }
  @media (max-width: 860px) {
    .rooms-arrow { width: 42px; height: 42px; background: rgba(255,255,255,0.95); }
    .rooms-arrow.prev { left: 8px; }
    .rooms-arrow.next { right: 8px; }
  }
  @media (max-width: 720px) {
    /* Mobile rooms slider: a real horizontal track. All cards sit in one flex
       row and the WHOLE row glides to the selected card via --slide-x (set from
       React), so chip taps / dots / swipes all get the same simple, smooth
       slide — no blur or scaled-neighbour effects that phones render poorly. */
    .rooms-slider { display: flex; overflow: hidden; height: auto; }
    .room-card, .room-card.is-active, .room-card.is-left, .room-card.is-right {
      position: relative; top: auto; left: auto;
      flex: 0 0 100%; width: 100%; margin-right: 14px;
      filter: none; opacity: 1; visibility: visible; pointer-events: none;
      transform: var(--slide-x, translateX(0));
      transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .room-card.is-active { pointer-events: auto; }
    /* Arrows overlap the card on small screens — dots, swipe and chips are enough */
    .rooms-arrow { display: none; }
    .room-img { height: 200px; }
    .room-footer { flex-wrap: wrap; }
  }
  /* ── ROOM PHOTOS PAGE (See More Images) ── */
  .rg-page {
    position: fixed; inset: 0; z-index: 1200; overflow-y: auto;
    background:
      radial-gradient(1100px 500px at 85% -10%, rgba(77,120,150,0.22), transparent 60%),
      radial-gradient(900px 500px at 10% 110%, rgba(200,150,62,0.10), transparent 55%),
      linear-gradient(165deg, #0c2231 0%, #0e2a3c 45%, #0a1e2b 100%);
    padding: 0 1.5rem 4rem;
    /* Opacity-only entrance: animating transform on the full-screen fixed layer
       makes the topbar's backdrop-filter re-blur every frame and stutters */
    animation: rgPageIn 0.35s ease both;
  }
  .rg-page.is-closing { animation: rgPageOut 0.32s ease-in both; }
  @keyframes rgPageIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes rgPageOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(18px) scale(0.985); } }
  .rg-topbar {
    position: sticky; top: 0; z-index: 5;
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    background: rgba(10,30,43,0.75); backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin: 0 -1.5rem 2.25rem; padding: 1rem 1.5rem;
  }
  .rg-brand {
    font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 600;
    letter-spacing: 0.06em; color: rgba(255,255,255,0.75);
  }
  .rg-back {
    display: inline-flex; align-items: center; gap: 0.35rem;
    background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50px; padding: 0.55rem 1.25rem 0.55rem 0.95rem;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; transition: background 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
  }
  .rg-back:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.45); transform: translateX(-2px); }
  .rg-hero {
    text-align: center; max-width: 700px; margin: 0 auto 2.5rem;
    animation: rgHeroIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
  }
  @keyframes rgHeroIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  .rg-hero .section-label { color: var(--gold); }
  .rg-title {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem);
    color: white; margin: 0.4rem 0 0.6rem;
  }
  .rg-sub { color: rgba(255,255,255,0.65); margin-bottom: 0; }
  .rg-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.1rem; max-width: 1200px; margin: 0 auto;
  }
  .rg-item {
    position: relative; border: 1px solid rgba(255,255,255,0.12); padding: 0; background: rgba(255,255,255,0.04);
    border-radius: 16px; overflow: hidden; cursor: zoom-in;
    /* Motion lives on the small tiles, not the big fixed layer → stays buttery */
    animation: rgItemIn 0.55s cubic-bezier(0.22, 1, 0.9, 1) 0.12s both;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease, border-color 0.45s ease;
    will-change: transform, opacity;
  }
  @keyframes rgItemIn { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: none; } }
  .rg-item img { width: 100%; height: 230px; object-fit: cover; display: block; transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.45s ease; }
  .rg-item:hover { transform: translateY(-6px); box-shadow: 0 18px 44px rgba(0,0,0,0.45); border-color: rgba(255,255,255,0.3); }
  .rg-item:hover img { transform: scale(1.06); }
  .rg-view {
    position: absolute; left: 50%; bottom: 0.9rem; transform: translate(-50%, 12px);
    background: rgba(10,30,43,0.78); backdrop-filter: blur(8px); color: white;
    font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.4rem 1.05rem; border-radius: 50px; border: 1px solid rgba(255,255,255,0.25);
    opacity: 0; transition: opacity 0.35s ease, transform 0.35s ease; pointer-events: none;
  }
  .rg-item:hover .rg-view, .rg-item:focus-visible .rg-view { opacity: 1; transform: translate(-50%, 0); }
  .rg-lightbox {
    position: fixed; inset: 0; z-index: 1300; background: rgba(5,16,24,0.94);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; cursor: zoom-out; padding: 2rem;
    animation: rgFade 0.3s ease both;
  }
  @keyframes rgFade { from { opacity: 0; } to { opacity: 1; } }
  .rg-lightbox img {
    max-width: min(92vw, 1100px); max-height: 86vh; object-fit: contain;
    border-radius: 10px; box-shadow: 0 24px 70px rgba(0,0,0,0.6);
    animation: rgZoom 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes rgZoom { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  .rg-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 50px; height: 50px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1); color: white; font-size: 1.5rem; line-height: 1;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition);
  }
  .rg-arrow:hover { background: rgba(255,255,255,0.28); }
  .rg-arrow-prev { left: 1rem; }
  .rg-arrow-next { right: 1rem; }
  .rg-count {
    position: absolute; bottom: 1.25rem; left: 50%; transform: translateX(-50%);
    color: rgba(255,255,255,0.85); font-size: 0.85rem; letter-spacing: 0.08em;
  }
  @media (max-width: 720px) {
    .rg-page { padding: 0 1rem 3rem; }
    .rg-topbar { margin: 0 -1rem 1.75rem; padding: 0.85rem 1rem; }
    .rg-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.6rem; }
    .rg-item img { height: 140px; }
    .rg-arrow { width: 40px; height: 40px; }
    .rg-arrow-prev { left: 0.5rem; }
    .rg-arrow-next { right: 0.5rem; }
  }
  .room-price { font-family: 'Cormorant Garamond', serif; }
  .room-price-num { font-size: 1.6rem; font-weight: 700; color: var(--peak); }
  .room-price-per { font-size: 0.75rem; color: var(--muted); }
  .room-price-guests { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .btn-primary {
    background: var(--peak); color: white; border: none; border-radius: 50px;
    padding: 0.6rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block;
  }
  .btn-primary:hover { background: var(--pine); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,58,74,0.3); }
  .btn-primary:disabled { background: var(--muted); cursor: not-allowed; transform: none; }
  .btn-outline {
    background: transparent; color: var(--peak); border: 2px solid var(--peak);
    border-radius: 50px; padding: 0.6rem 1.4rem; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block;
  }
  .btn-outline:hover { background: var(--peak); color: white; }

  /* ── ABOUT ── */
  .about-bg { background: linear-gradient(135deg, var(--peak) 0%, #0d2535 100%); padding: 4rem 1.5rem; }
  .about-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .about-img-stack { position: relative; height: 500px; }
  .about-img-main {
    position: absolute; top: 0; left: 0; width: 75%; height: 80%;
    border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-lg);
  }
  .about-img-accent {
    position: absolute; bottom: 0; right: 0; width: 55%; height: 55%;
    border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-lg);
    border: 4px solid rgba(255,255,255,0.1);
  }
  .about-img-main img, .about-img-accent img { width: 100%; height: 100%; object-fit: cover; }
  .about-card {
    position: absolute; top: 50%; left: 65%; transform: translateY(-50%);
    background: var(--gold); padding: 1.25rem 1.5rem; border-radius: var(--radius-sm);
    text-align: center; box-shadow: 0 8px 32px rgba(200,150,62,0.4); min-width: 120px;
  }
  .about-card-num { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: white; }
  .about-card-label { font-size: 0.7rem; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.1em; }
  .about-text { color: rgba(255,255,255,0.75); }
  .about-text .section-label { color: var(--gold); }
  .about-text .section-title { color: white; }
  .about-text p { line-height: 1.8; margin-bottom: 1rem; }
  .about-features { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem; }
  .about-feature { display: flex; align-items: flex-start; gap: 0.75rem; }
  .about-feature-icon { font-size: 1.2rem; margin-top: 2px; }
  .about-feature-text h4 { color: white; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; }
  .about-feature-text p { font-size: 0.8rem; color: rgba(255,255,255,0.55); }

  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .about-img-stack { height: 320px; }
    /* "5 Years Hosting" badge: compact and tucked into the corner so it
       never dwarfs the photos on a phone screen */
    .about-card {
      top: auto; bottom: -14px; left: 14px; transform: none;
      padding: 0.8rem 1rem; min-width: 96px;
    }
    .about-card-num { font-size: 1.5rem; }
    .about-card-label { font-size: 0.6rem; letter-spacing: 0.08em; }
  }

  /* ── WHY STAY WITH US ── */
  .why-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
  }
  .why-card {
    position: relative; overflow: hidden;
    background: white; border: 1px solid var(--border); border-radius: var(--radius);
    padding: 1.75rem 1.25rem; text-align: center;
    cursor: pointer; outline: none;
    transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease, border-color 0.55s ease;
  }
  .why-card:hover, .why-card:focus-visible { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: var(--glacier); }
  .why-media {
    position: absolute; inset: 0; z-index: 2;
    transform: translateY(-101%);
    /* Exit (mouse leaves): slow, symmetrical ease-in-out so the curtain glides away gently */
    transition: transform 1s cubic-bezier(0.65, 0, 0.35, 1);
    will-change: transform;
  }
  .why-media img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    /* Long, lazy zoom that keeps drifting after the panel lands — premium documentary feel */
    transition: transform 1.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .why-media::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,37,53,0.88) 0%, rgba(13,37,53,0.3) 55%, rgba(13,37,53,0.12) 100%);
  }
  .why-media-caption {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 3;
    padding: 1rem 0.9rem; color: white; text-align: center;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem;
    text-shadow: 0 1px 8px rgba(0,0,0,0.5);
  }
  .why-media-caption span { display: block; font-weight: 400; font-size: 0.74rem; opacity: 0.85; margin-top: 3px; letter-spacing: 0.02em; }
  /* Entry (mouse enters): slightly quicker than exit but with a soft start — feels intentional, not snappy */
  .why-card:hover .why-media, .why-card:focus-visible .why-media {
    transform: translateY(0);
    transition: transform 0.85s cubic-bezier(0.33, 0, 0.2, 1);
  }
  .why-card:hover .why-media img, .why-card:focus-visible .why-media img { transform: scale(1.08); }
  @media (prefers-reduced-motion: reduce) {
    .why-card, .why-media, .why-media img { transition: none; }
    .why-card:hover .why-media, .why-card:focus-visible .why-media { transform: translateY(-101%); }
  }
  .why-icon {
    width: 58px; height: 58px; margin: 0 auto 1rem; border-radius: 50%;
    background: linear-gradient(135deg, var(--ice), var(--glacier));
    display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
  }
  .why-title {
    font-family: 'DM Sans', sans-serif; font-size: 0.98rem; font-weight: 700;
    color: var(--peak); margin-bottom: 0.5rem;
  }
  .why-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.6; }

  /* ── SERVICES ── */
  .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
  .service-card {
    background: white; padding: 1.75rem; border-radius: var(--radius);
    border: 1px solid var(--border); transition: var(--transition);
    display: flex; gap: 1rem; align-items: flex-start;
  }
  .service-card:hover { border-color: var(--glacier); box-shadow: var(--shadow); transform: translateY(-3px); }
  .service-icon { font-size: 2rem; flex-shrink: 0; color: var(--pine); display: flex; align-items: center; margin-top: 2px; }
  .service-title { font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--peak); margin-bottom: 0.35rem; }
  .service-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }

  /* ── GALLERY ── */
  .gallery-bg { background: var(--ice); padding: 4rem 1.5rem; }
  .gallery-inner { max-width: 1200px; margin: 0 auto; }
  .slider {
    position: relative;
    /* Full-bleed breakout: the slider spans the whole viewport width even
       though it sits inside the padded, max-width gallery container */
    width: 100vw; max-width: none;
    margin-left: calc(50% - 50vw);
    border-radius: 0; overflow: hidden;
    box-shadow: var(--shadow-lg); background: var(--peak);
  }
  .slider-track {
    display: flex;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .slider-slide { position: relative; flex: 0 0 100%; height: 520px; }
  /* Each slide slowly zooms in while it's on screen (class flips per slide so
     the animation restarts every time a new photo comes in) */
  .slider-slide.is-current img.slider-img { animation: galleryZoom 3.4s ease-out both; }
  @keyframes galleryZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
  /* Blurred copy of the same photo fills the box; the real photo sits on top fully visible */
  .slider-slide img.slider-img-blur {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; filter: blur(22px) brightness(0.55);
    transform: scale(1.12);
  }
  .slider-slide img.slider-img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: contain; display: block;
  }
  .slider-caption {
    position: absolute; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; gap: 0.75rem;
    padding: 2.5rem 1.5rem 1.25rem;
    background: linear-gradient(to top, rgba(10,30,42,0.75), transparent);
  }
  .slider-cat {
    background: var(--gold); color: white; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; padding: 0.25rem 0.75rem; border-radius: 50px;
  }
  .slider-label { color: white; font-size: 0.95rem; font-weight: 500; text-shadow: 0 1px 8px rgba(0,0,0,0.4); }
  .slider-arrow {
    position: absolute; top: 50%; transform: translateY(-50%); z-index: 2;
    width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer;
    background: rgba(255,255,255,0.15); color: white; font-size: 1.6rem; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(6px); transition: var(--transition);
  }
  .slider-arrow:hover { background: var(--gold); }
  .slider-prev { left: 1.25rem; }
  .slider-next { right: 1.25rem; }
  .slider-dots {
    position: absolute; bottom: 1.25rem; left: 50%; transform: translateX(-50%); z-index: 2;
    display: flex; gap: 0.5rem;
  }
  .slider-dot {
    width: 9px; height: 9px; border-radius: 50%; border: none; cursor: pointer;
    background: rgba(255,255,255,0.45); transition: var(--transition); padding: 0;
  }
  .slider-dot.active { background: var(--gold); transform: scale(1.25); }

  @media (max-width: 768px) {
    .slider-slide { height: 320px; }
    .slider-arrow { width: 38px; height: 38px; font-size: 1.3rem; }
    .slider-prev { left: 0.6rem; }
    .slider-next { right: 0.6rem; }
    .slider-dots { bottom: 0.9rem; }
    .slider-caption { padding-bottom: 3rem; }
  }

  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  /* ── TESTIMONIALS ── */
  .testimonials-bg { background: var(--peak); padding: 4rem 1.5rem; }
  .testimonials-inner { max-width: 1200px; margin: 0 auto; }
  .testimonials-inner .section-label { color: var(--gold); }
  .testimonials-inner .section-title { color: white; }
  /* ── Announcement-style reviews ticker ──
     Cards drift continuously in one direction (like a news/announcement bar).
     Hovering pauses the drift; pressing/touching lets you drag the row
     forward AND backward — it resumes drifting on its own after you let go. */
  .testi-viewport {
    overflow: hidden; border-radius: var(--radius);
    cursor: grab; touch-action: pan-y;
    user-select: none; -webkit-user-select: none;
    /* Soft fade at both edges so cards never pop in/out at the seams */
    -webkit-mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
    mask-image: linear-gradient(to right, transparent, black 4%, black 96%, transparent);
  }
  .testi-viewport:active { cursor: grabbing; }
  .testi-track {
    display: flex; width: max-content;
    will-change: transform;
  }
  .testi-item { flex-shrink: 0; width: 360px; margin-right: 18px; display: flex; box-sizing: border-box; padding: 0.3rem 0; }
  .testi-item .testi-card { flex: 1; }
  @media (min-width: 1100px) {
    /* Wide screens: slightly bigger cards so the strip doesn't look sparse */
    .testi-item { width: 400px; }
  }
  @media (max-width: 720px) {
    /* Small screens: cap the card to the visible width (minus section padding)
     so even a 320px phone shows one full card with breathing room */
    .testi-item { width: min(288px, calc(100vw - 56px)); margin-right: 14px; }
  }
  .testi-card {
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius); padding: 1.75rem; transition: var(--transition);
    backdrop-filter: blur(4px);
  }
  .testi-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-4px); }
  .testi-stars { color: var(--gold); margin-bottom: 1rem; font-size: 1rem; letter-spacing: 2px; }
  .testi-text { color: rgba(255,255,255,0.8); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.25rem; font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: 0.75rem; }
  .testi-avatar {
    width: 40px; height: 40px; border-radius: 50%; background: var(--gold);
    color: white; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .testi-avatar-img { object-fit: cover; border: 2px solid var(--gold); }
  .testi-name { color: white; font-weight: 600; font-size: 0.9rem; }
  .testi-loc { color: rgba(255,255,255,0.5); font-size: 0.78rem; }
  .testi-cta { text-align: center; margin-top: 2rem; }
  .testi-cta-btn {
    background: var(--gold);
    padding: 0.7rem 1.6rem; font-size: 0.9rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  }
  .testi-cta-btn:hover { background: #e0a845; box-shadow: 0 6px 20px rgba(200,150,62,0.4); }

  /* ── BOOKING MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 3000;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: white; border-radius: var(--radius); padding: 2.5rem;
    max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 32px 80px rgba(0,0,0,0.3);
  }
  .modal h2 { font-size: 1.8rem; color: var(--peak); margin-bottom: 0.25rem; }
  .modal-room-name { color: var(--muted); font-size: 0.9rem; margin-bottom: 1.75rem; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-group.full { grid-column: 1 / -1; }
  .form-group label { font-size: 0.78rem; font-weight: 600; color: var(--peak); letter-spacing: 0.05em; }
  .form-group input, .form-group select, .form-group textarea {
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    padding: 0.65rem 0.9rem; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    color: var(--text); background: var(--snow); outline: none; transition: var(--transition);
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-color: var(--peak); background: white; box-shadow: 0 0 0 3px rgba(26,58,74,0.08);
  }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .modal-footer { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  .modal-total { background: var(--ice); border-radius: var(--radius-sm); padding: 1rem 1.25rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; }
  .modal-total-label { font-size: 0.85rem; color: var(--muted); }
  .modal-total-price { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--peak); }
  .success-box { text-align: center; padding: 2rem 0; }
  .success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
  .success-box h3 { font-size: 1.6rem; color: var(--peak); margin-bottom: 0.5rem; }
  .success-box p { color: var(--muted); font-size: 0.9rem; line-height: 1.7; }

  /* ── CONTACT ── */
  .contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 3rem; align-items: start; }
  .contact-info h3 { font-size: 1.5rem; color: var(--peak); margin-bottom: 1.5rem; }
  .contact-item { display: flex; gap: 1rem; align-items: flex-start; margin-bottom: 1.25rem; }
  .contact-icon { width: 42px; height: 42px; background: var(--ice); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .contact-item-title { font-weight: 600; color: var(--peak); font-size: 0.9rem; }
  .contact-item-val { font-size: 0.85rem; color: var(--muted); margin-top: 2px; }
  .whatsapp-btn {
    display: flex; align-items: center; gap: 0.6rem; background: #25D366; color: white;
    padding: 0.75rem 1.5rem; border-radius: 50px; text-decoration: none; font-weight: 600;
    font-size: 0.9rem; margin-top: 1.5rem; width: fit-content; transition: var(--transition);
  }
  .whatsapp-btn:hover { background: #1da851; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,211,102,0.4); }

  @media (max-width: 768px) {
    .contact-grid { grid-template-columns: 1fr; gap: 2.25rem; }
    /* Stop grid min-content blowout (long email/address) from squeezing the
       form column and shoving the inputs to the right */
    .contact-grid > * { min-width: 0; }
    .contact-item-val { overflow-wrap: anywhere; }
    /* Stack every form field full-width; 16px inputs stop iOS focus-zoom
       from blowing the boxes out of place */
    .form-grid { grid-template-columns: 1fr; }
    .form-grid > * { min-width: 0; }
    .form-group input, .form-group select, .form-group textarea { font-size: 16px; }
  }

  /* ── FOOTER ── */
  .footer { background: #0a1e2b; padding: 3.5rem 1.5rem 1.5rem; }
  .footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2.5rem; margin-bottom: 3rem; }
  .footer-brand-name { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: white; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 10px; }
  .footer-brand-img { width: 58px; height: 58px; object-fit: contain; background: #ffffff; border-radius: 50%; padding: 4px; box-shadow: 0 3px 12px rgba(0,0,0,0.45); border: 2px solid rgba(255,255,255,0.9); flex-shrink: 0; }
  .footer-brand-desc { font-size: 0.85rem; color: rgba(255,255,255,0.55); line-height: 1.7; }
  .footer-col h4 { color: rgba(255,255,255,0.75); font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1rem; font-family: 'DM Sans', sans-serif; font-weight: 600; }
  .footer-col a { display: block; color: rgba(255,255,255,0.55); text-decoration: none; font-size: 0.85rem; margin-bottom: 0.6rem; transition: color 0.2s; }
  .footer-col a:hover { color: var(--gold); }
  .footer-social { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
  .footer-social a {
    width: 38px; height: 38px; border-radius: 50%; margin-bottom: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7); transition: var(--transition);
  }
  .footer-social a:hover { background: var(--gold); border-color: var(--gold); color: white; transform: translateY(-2px); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
  .footer-copy { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
  .footer-dev { font-size: 0.75rem; color: rgba(255,255,255,0.35); margin-top: 0.35rem; }
  .footer-love { font-size: 0.8rem; color: rgba(255,255,255,0.45); display: flex; align-items: center; }
  /* Book Now pill inside the Contact column (phones only): parked on the right
     of the row, right beside the Directions link */
  .footer-book-row { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.6rem; }
  .footer-book-row > a { margin-bottom: 0; }
  .footer-col .footer-book {
    display: none; align-items: center; gap: 0.4rem;
    background: var(--gold); color: white !important; border-radius: 50px;
    padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600;
    box-shadow: 0 4px 14px rgba(200,150,62,0.45);
  }
  .footer-col .footer-book:active { background: #e0a845; }

  @media (max-width: 768px) {
    /* Phone footer: brand on its own row, then Explore | Support side by side,
       then Contact full-width underneath — no endless single-column queue */
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem 1.5rem; }
    .footer-grid > div:first-child { grid-column: 1 / -1; }
    .footer-col-contact { grid-column: 1 / -1; }
    /* Show the in-footer Book Now and hide the floating one — no double button,
       and nothing covering the footer text while scrolling */
    .footer-col .footer-book { display: inline-flex; }
    .book-float { display: none; }
  }

  /* ── FLOATING BOOK NOW ── */
  .book-float {
    /* Extra lift so it never covers the footer's "Made with ♥ in the Himalayas" line */
    position: fixed; bottom: 4.5rem; right: 1.5rem; z-index: 999;
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--gold); color: white; border: none; border-radius: 50px;
    padding: 0.95rem 1.5rem; font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; font-weight: 600; letter-spacing: 0.02em;
    box-shadow: 0 6px 24px rgba(200,150,62,0.5); cursor: pointer; transition: var(--transition);
    text-decoration: none;
  }
  .book-float:hover { background: #e0a845; transform: translateY(-3px); box-shadow: 0 10px 32px rgba(200,150,62,0.6); }
  .book-tooltip {
    position: absolute; right: calc(100% + 12px); background: var(--peak); color: white;
    font-size: 0.78rem; padding: 0.4rem 0.75rem; border-radius: 6px; white-space: nowrap;
    pointer-events: none; opacity: 0; transition: opacity 0.2s;
  }
  .book-float:hover .book-tooltip { opacity: 1; }

  /* ── VIDEO SECTION ── */
  .video-bg { background: linear-gradient(135deg, #0a1e2b 0%, var(--peak) 100%); padding: 4rem 1.5rem; }
  .video-inner { max-width: 900px; margin: 0 auto; text-align: center; }
  .video-inner .section-label { color: var(--gold); }
  .video-inner .section-title { color: white; }
  .video-inner .section-sub { color: rgba(255,255,255,0.6); margin: 0 auto 1.25rem; }
  /* Video carousel: same 16:9 frame the single video used — now sliding
     between all the property clips */
  .video-slider {
    position: relative; border-radius: var(--radius); overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.1); background: #000;
  }
  .video-track { display: flex; transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1); }
  .video-slide { position: relative; flex: 0 0 100%; aspect-ratio: 16 / 9; }
  .video-slide video {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: contain; display: block; background: #000;
  }
  .video-tag {
    position: absolute; top: 12px; left: 12px;
    background: var(--gold); color: white; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 50px;
  }
  .video-count {
    position: absolute; top: 12px; right: 12px;
    background: rgba(10,30,42,0.65); color: white; font-size: 0.72rem; font-weight: 600;
    padding: 0.3rem 0.7rem; border-radius: 50px; backdrop-filter: blur(6px);
  }

  /* ── LOCATION HIGHLIGHTS ── */
  .highlights { display: flex; gap: 1rem; margin-top: 1.5rem; }
  @media (max-width: 720px) { .highlights { flex-wrap: wrap; } }
  .highlight { display: flex; align-items: center; gap: 0.5rem; background: var(--ice); padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.82rem; color: var(--peak); border: 1px solid var(--glacier); }

  /* Mobile: trim the tall section padding so sections hug their content */
  @media (max-width: 720px) {
    .section, .section-full { padding: 3rem 1.25rem; }
    .about-bg, .gallery-bg, .testimonials-bg, .video-bg { padding: 3rem 1.25rem; }
  }

  /* ── MISC ── */
  .text-center { text-align: center; }
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .gap-1 { gap: 0.5rem; }

  /* ── POLICY PAGE (footer links) ── */
  .pol-page {
    position: fixed; inset: 0; z-index: 1200; overflow-y: auto;
    background:
      radial-gradient(1100px 500px at 85% -10%, rgba(77,120,150,0.22), transparent 60%),
      radial-gradient(900px 500px at 10% 110%, rgba(200,150,62,0.10), transparent 55%),
      linear-gradient(165deg, #0c2231 0%, #0e2a3c 45%, #0a1e2b 100%);
    padding: 0 1.5rem 4rem;
    animation: rgPageIn 0.35s ease both;
  }
  .pol-page.is-closing { animation: rgPageOut 0.32s ease-in both; }
  .pol-hero { text-align: center; max-width: 760px; margin: 0 auto 2.5rem; animation: rgHeroIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both; }
  .pol-hero .section-label { color: var(--gold); }
  .pol-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 1.1rem; max-width: 1100px; margin: 0 auto;
  }
  .pol-card {
    background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; padding: 1.5rem 1.5rem 1.25rem;
    animation: rgItemIn 0.55s cubic-bezier(0.22, 1, 0.9, 1) 0.12s both;
    scroll-margin-top: 96px; transition: border-color 0.3s ease;
  }
  .pol-card:hover { border-color: rgba(255,255,255,0.22); }
  .pol-card-head { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 1rem; }
  .pol-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(200,150,62,0.25), rgba(200,150,62,0.08));
    border: 1px solid rgba(200,150,62,0.35); color: var(--gold);
    display: flex; align-items: center; justify-content: center;
  }
  .pol-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; color: white; }
  .pol-card ul { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
  .pol-card li { display: flex; gap: 0.65rem; font-size: 0.88rem; color: rgba(255,255,255,0.72); line-height: 1.6; }
  .pol-num { font-family: 'Cormorant Garamond', serif; font-weight: 700; color: var(--gold); font-size: 0.85rem; min-width: 1.4em; padding-top: 1px; }
  .pol-contact {
    max-width: 760px; margin: 3rem auto 0; text-align: center;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px; padding: 2.5rem 1.5rem;
    animation: rgItemIn 0.55s cubic-bezier(0.22, 1, 0.9, 1) 0.3s both;
  }
  .pol-contact h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; color: white; margin-bottom: 0.4rem; }
  .pol-contact p { color: rgba(255,255,255,0.65); font-size: 0.95rem; margin-bottom: 1.5rem; }
  .pol-contact-btns { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
  @media (max-width: 720px) {
    .pol-page { padding: 0 1rem 3rem; }
    .pol-card { padding: 1.25rem 1.1rem 1.1rem; }
    .pol-contact { padding: 2rem 1.25rem; }
  }
`;

// ─── HOTEL POLICIES (footer → policy page) ───────────────────────────────
const POLICY_SECTIONS = [
  { id: "checkin", Icon: Clock, title: "Check-in / Check-out", items: [
    "Check-in time: 12:00 PM",
    "Check-out time: 10:00 AM",
    "Early check-in and late check-out are subject to availability.",
  ]},
  { id: "booking", Icon: ScrollText, title: "Booking & Payment", items: [
    "Advance booking is recommended.",
    "A partial or full payment may be required to confirm your reservation.",
    "Accepted payment modes: Cash, UPI, and bank transfer.",
  ]},
  { id: "cancellation", Icon: CalendarX, title: "Cancellation Policy", items: [
    "Free cancellation up to 5 days before check-in.",
    "Cancellations within 5 days may be subject to charges.",
    "No-show bookings are non-refundable.",
  ]},
  { id: "guests", Icon: Users, title: "Guest & Visitor Policy", items: [
    "Valid ID proof required at check-in.",
    "Only registered guests are allowed to stay.",
    "Outside visitors require prior permission.",
    "Guests must maintain peaceful surroundings.",
  ]},
  { id: "children", Icon: Baby, title: "Child Policy", items: [
    "Children below 5 years can stay free (without extra bedding).",
    "Extra charges may apply for additional bedding.",
  ]},
  { id: "pets", Icon: PawPrint, title: "Pet Policy", items: [
    "Pets are allowed only with prior approval.",
    "Guests are responsible for their pet's behavior and cleanliness.",
  ]},
  { id: "damage", Icon: Wrench, title: "Damage Policy", items: [
    "Any property damage will be charged to the guest.",
    "Please inform staff immediately in case of any issues.",
  ]},
  { id: "rules", Icon: Ban, title: "House Rules", items: [
    "Smoking is allowed only in designated areas.",
    "Loud music and parties are not permitted.",
    "Outside visitors are not allowed in rooms without permission.",
  ]},
  { id: "vacation", Icon: HomeIcon, title: "Vacation Home Usage", items: [
    "The entire property (if booked) is for registered guests only.",
    "Parties, loud music, or events are not allowed without approval.",
    "Guests are expected to maintain the cleanliness and care of the space.",
  ]},
  { id: "safety", Icon: AlertTriangle, title: "Safety & Liability", items: [
    "Guests are responsible for their personal belongings.",
    "The property is not liable for any loss, theft, or unforeseen events.",
  ]},
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    ["#rooms", "Rooms"], ["#gallery", "Gallery"], ["#services", "Services"],
    ["#about", "About"], ["#contact", "Contact"]
  ];

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="#hero" className="nav-logo">
        <span className="nav-logo-icon">
          <img src={logoImg} alt="Shivalik Ice Hills logo" className="nav-logo-img" />
        </span>
        <div>
          <div className="nav-logo-text">Shivalik Ice Hills</div>
          <div className="nav-logo-sub">Guptkashi, Uttarakhand</div>
        </div>
      </a>
      <div className={`nav-links${open ? " open" : ""}`}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="nav-cta" onClick={() => setOpen(false)}>Directions</a>
      </div>
      <button className="nav-hamburger" onClick={() => setOpen(o => !o)}>
        {open ? "✕" : "☰"}
      </button>
    </nav>
  );
}

const HERO_SNOWFLAKES = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + 11) % 100,               // spread pseudo-randomly across 0-99%
  size: 3 + ((i * 7) % 5),                  // 3-7px
  duration: 9 + ((i * 13) % 12),            // 9-20s fall time
  delay: -((i * 5) % 20),                   // negative delay so snow is already falling on load
  drift: ((i * 29) % 60) - 30               // horizontal sway amplitude
}));

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-snow" aria-hidden="true">
        {HERO_SNOWFLAKES.map((f, i) => (
          <span key={i} style={{
            left: `${f.left}%`,
            width: f.size, height: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            marginLeft: f.drift
          }} />
        ))}
      </div>
      <div className="hero-content">
        <div className="hero-badge"><Star size={13} strokeWidth={2.2} fill="currentColor" /> Top-Rated Homestay in Guptkashi</div>
        <h1>Stay Where the<br /><span>Himalayas Begin</span></h1>
        <p className="hero-tagline">Best stay for nature lovers & Kedarnath travelers · Guptkashi, Uttarakhand</p>
        <div className="hero-stats">
          {[["500+", "Happy Guests"], ["6", "Unique Rooms"], ["4,327 ft", "Altitude"], ["4.9★", "Avg Rating"]].map(([n, l]) => (
            <div className="hero-stat" key={l}>
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <div className="hero-scroll-dot" />
      </div>
    </section>
  );
}

function Rooms({ onBook }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const touchX = useRef(null);

  const types = ["All", "Super Deluxe", "Deluxe", "Standard", "Shared"];

  // All rooms always stay in the track — filter chips navigate the slider to the
  // matching room instead of shrinking it, so sliding + blurred neighbours never go away.
  const rooms = ROOMS;

  const count = rooms.length;
  const safeActive = count ? ((active % count) + count) % count : 0;
  const go = i => { if (count) setActive(((i % count) + count) % count); };
  const prevRoom = () => go(safeActive - 1);
  const nextRoom = () => go(safeActive + 1);

  const onChipClick = t => {
    setFilter(t);
    if (t !== "All") {
      const idx = rooms.findIndex(r => r.type === t);
      if (idx >= 0) go(idx);
    }
  };

  // Touch swipe navigation
  const onTouchStart = e => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 45) (dx < 0 ? nextRoom : prevRoom)();
    touchX.current = null;
  };

  // Keyboard navigation (works once focus is inside the section)
  const onKeyDown = e => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prevRoom(); }
    if (e.key === "ArrowRight") { e.preventDefault(); nextRoom(); }
  };

  return (
    <section className="section" id="rooms" tabIndex={-1} onKeyDown={onKeyDown}
             onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="section-header-row">
        <div>
          <span className="section-label"><BedDouble size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Our Rooms</span>
          <h2 className="section-title">Find Your Perfect Stay</h2>
          <p className="section-sub">Each room is thoughtfully designed to immerse you in the beauty of the Himalayas.</p>
        </div>
      </div>
      <div className="filter-bar">
        {types.map(t => (
          <button key={t} className={`filter-chip${filter === t ? " active" : ""}`}
                  onClick={() => onChipClick(t)}>{t}</button>
        ))}
      </div>
      <>
        {/* --slide-x drives the mobile track position (ignored on desktop):
            shifting the whole row by (card width + gap) per step gives one
            consistent smooth slide no matter what triggered the change. */}
        <div className="rooms-slider"
             style={{ touchAction: "pan-y", "--slide-x": `translateX(calc(${safeActive} * (-100% - 14px)))` }}>
          {rooms.map((room, i) => {
            const pos = ((i - safeActive) % count + count) % count; // 0 = focused, 1 = right peek, count-1 = left peek
            const posClass = pos === 0 ? "is-active" : pos === 1 ? "is-right" : pos === count - 1 ? "is-left" : "";
            return (
              <RoomCard key={room.id} room={room} onBook={onBook}
                        posClass={posClass} onClick={() => setActive(i)} />
            );
          })}
            {count > 1 && (
              <>
                <button className="rooms-arrow prev" aria-label="Previous room" onClick={prevRoom}>
                  <ChevronLeft size={22} />
                </button>
                <button className="rooms-arrow next" aria-label="Next room" onClick={nextRoom}>
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
        <div className="rooms-dots">
          {rooms.map((room, i) => (
            <button key={room.id} aria-label={`Go to ${room.name}`}
                    className={`room-dot${i === safeActive ? " active" : ""}`}
                    onClick={() => go(i)} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <button className="btn-outline" onClick={() => setShowGallery(true)}>
            See More Images
          </button>
        </div>
      </>
      {showGallery && <RoomGalleryPage onClose={() => setShowGallery(false)} />}
    </section>
  );
}

// ── Full-screen room photos page (opened via "See More Images") ──
function RoomGalleryPage({ onClose }) {
  const [lightbox, setLightbox] = useState(-1);
  const [closing, setClosing] = useState(false);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 340); // wait for the exit animation to finish
  };

  useEffect(() => {
    const fn = e => {
      if (e.key === "Escape") { lightbox >= 0 ? setLightbox(-1) : requestClose(); }
      if (lightbox >= 0 && e.key === "ArrowRight") setLightbox(i => (i + 1) % ROOM_PHOTOS.length);
      if (lightbox >= 0 && e.key === "ArrowLeft") setLightbox(i => (i - 1 + ROOM_PHOTOS.length) % ROOM_PHOTOS.length);
    };
    window.addEventListener("keydown", fn);
    // Lock page scroll but compensate for the scrollbar so the site doesn't shift behind us
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, closing]);

  return (
    <div className={`rg-page${closing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="Room photos">
      <div className="rg-topbar">
        <button className="rg-back" aria-label="Back to site" onClick={requestClose}>
          <ChevronLeft size={16} strokeWidth={2.4} /> Back
        </button>
        <span className="rg-brand">Shivalik Ice Hills</span>
      </div>
      <div className="rg-hero">
        <span className="section-label"><Camera size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Room Photos</span>
        <h2 className="rg-title">Inside Our Rooms</h2>
        <p className="rg-sub">A closer look at the comfort waiting for you at Shivalik Ice Hills.</p>
      </div>
      <div className="rg-grid">
        {ROOM_PHOTOS.map((src, i) => (
          <button key={i} className="rg-item" style={{ animationDelay: `${i * 70}ms` }}
                  onClick={() => setLightbox(i)} aria-label={`View photo ${i + 1}`}>
            <img src={src} alt={`Room photo ${i + 1}`} decoding="async"
                 onError={e => { e.currentTarget.style.visibility = "hidden"; }}
                 onLoad={e => { e.currentTarget.style.visibility = ""; }} />
            <span className="rg-view">View</span>
          </button>
        ))}
      </div>

      {lightbox >= 0 && (
        <div className="rg-lightbox" onClick={() => setLightbox(-1)}>
          <button className="rg-arrow rg-arrow-prev" aria-label="Previous photo"
                  onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + ROOM_PHOTOS.length) % ROOM_PHOTOS.length); }}>‹</button>
          <img src={ROOM_PHOTOS[lightbox]} alt={`Room photo ${lightbox + 1}`} onClick={e => e.stopPropagation()} />
          <button className="rg-arrow rg-arrow-next" aria-label="Next photo"
                  onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % ROOM_PHOTOS.length); }}>›</button>
          <div className="rg-count">{lightbox + 1} / {ROOM_PHOTOS.length}</div>
        </div>
      )}
    </div>
  );
}

function RoomCard({ room, onBook, posClass = "", onClick }) {
  const [imgIdx, setImgIdx] = useState(0);
  const isActive = posClass === "is-active";

  // Show first photo when a room comes into focus
  useEffect(() => { if (isActive) setImgIdx(0); }, [isActive]);

  return (
    <div className={`room-card ${posClass}`} onClick={onClick}>
      <div className="room-img"
           onClick={e => {
             if (!isActive) return;               // inactive cards just activate on click
             e.stopPropagation();
             setImgIdx(i => (i + 1) % room.images.length);
           }}>
        {/* Eager + onError fallback: inside the transformed carousel track a lazy
            image can be deferred indefinitely and show as a blank card. */}
        <img src={room.images[imgIdx]} alt={room.name} decoding="async"
             onError={e => { e.currentTarget.style.visibility = "hidden"; }}
             onLoad={e => { e.currentTarget.style.visibility = ""; }} />
        {room.badge && <span className="room-badge">{room.badge}</span>}
        {room.images.length > 1 && (
          <div style={{ position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
            {room.images.map((_, i) => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === imgIdx ? "white" : "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
        )}
      </div>
      <div className="room-body">
        <div className="room-topline">
          <span className="room-type">{room.type}</span>
          <span className="room-guests"><Users size={13} /> Up to {room.maxGuests} guests</span>
        </div>
        <div className="room-name">{room.name}</div>
        <p className="room-desc">{room.description}</p>
        <div className="room-amenities">
          {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
        </div>
        <div className="room-footer">
          <div className="room-price">
            <div><span className="room-price-num">₹{room.price.toLocaleString()}</span><span className="room-price-per"> /night</span></div>
            <div className="room-price-guests">Max {room.maxGuests} guests</div>
          </div>
          <button className="btn-primary room-book-btn"
                  onClick={e => { e.stopPropagation(); if (room.available) window.open(WA_BOOKING_URL, "_blank", "noopener"); }}
                  disabled={!room.available}>
            {room.available ? "Book Now" : "Not Available"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ room, preCheckin, preCheckout, preGuests, onClose }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    checkin: preCheckin || "", checkout: preCheckout || "",
    guests: preGuests || "1", special: "",
    selectedRoom: room?.id || ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingId] = useState("SIH-" + Math.random().toString(36).slice(2, 7).toUpperCase());

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const nights = form.checkin && form.checkout
    ? Math.max(0, Math.ceil((new Date(form.checkout) - new Date(form.checkin)) / 86400000))
    : 0;

  const selectedRoom = room || ROOMS.find(r => r.id === Number(form.selectedRoom));
  const total = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.checkin || !form.checkout) {
      alert("Please fill all required fields.");
      return;
    }
    if (!selectedRoom) { alert("Please select a room."); return; }
    setLoading(true);
    try {
      await sendEmail(EMAILJS_BOOKING_TEMPLATE, {
        booking_id:  bookingId,
        guest_name:  form.name,
        guest_email: form.email,
        guest_phone: form.phone,
        room_name:   selectedRoom.name,
        room_type:   selectedRoom.type,
        checkin:     form.checkin,
        checkout:    form.checkout,
        nights:      nights,
        guests:      form.guests,
        total:       "Rs." + total.toLocaleString(),
        special_req: form.special || "None",
        reply_to:    form.email,
      });
      setSubmitted(true);
    } catch (err) {
      // If EmailJS keys not yet set, still show confirmation (demo mode)
      console.warn("EmailJS not configured:", err.message);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {submitted ? (
          <div className="success-box">
            <div className="success-icon"><CheckCircle2 size={56} strokeWidth={1.6} color="#2d5a3d" /></div>
            <h3>Booking Confirmed!</h3>
            <p>Booking ID: <strong>{bookingId}</strong><br />
              Thank you, <strong>{form.name}</strong>! Your stay at <strong>{selectedRoom?.name}</strong> is confirmed.<br /><br />
              We'll send details to <strong>{form.email}</strong>.<br />
              For questions, WhatsApp: <strong>+91 94120 XXXXX</strong></p>
            <button className="btn-primary mt-3" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2>Book Your Stay</h2>
            <p className="modal-room-name">{room ? `Room: ${room.name} · ₹${room.price}/night` : "Select your preferred room"}</p>
            <div className="form-grid">
              <div className="form-group full">
                <label>Full Name *</label>
                <input placeholder="Your full name" value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
              {!room && (
                <div className="form-group full">
                  <label>Select Room *</label>
                  <select value={form.selectedRoom} onChange={e => set("selectedRoom", e.target.value)}>
                    <option value="">Choose a room</option>
                    {ROOMS.filter(r => r.available).map(r => (
                      <option key={r.id} value={r.id}>{r.name} — ₹{r.price}/night</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Check-in *</label>
                <input type="date" min={today} value={form.checkin} onChange={e => set("checkin", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Check-out *</label>
                <input type="date" min={form.checkin || today} value={form.checkout} onChange={e => set("checkout", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Guests</label>
                <select value={form.guests} onChange={e => set("guests", e.target.value)}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Nights</label>
                <input readOnly value={nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select dates"} style={{ background: "#f0f5f7", cursor: "default" }} />
              </div>
              <div className="form-group full">
                <label>Special Requests</label>
                <textarea placeholder="Early check-in, dietary needs, trek guidance..." value={form.special} onChange={e => set("special", e.target.value)} />
              </div>
            </div>
            {total > 0 && (
              <div className="modal-total">
                <div>
                  <div className="modal-total-label">Total Estimate</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{selectedRoom?.name} × {nights} night{nights > 1 ? "s" : ""}</div>
                </div>
                <div className="modal-total-price">₹{total.toLocaleString()}</div>
              </div>
            )}
            <div className="modal-footer">
              <button className="btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}
                      style={{ flex: 1 }}>
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
            <p style={{ fontSize: "0.73rem", color: "var(--muted)", marginTop: "1rem", textAlign: "center" }}>
              <Lock size={12} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "4px" }} />Secure booking · No payment required now · Free cancellation 48h before check-in
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Gallery() {
  const SLIDE_MS = 600; // must match .slider-track transition duration
  const N = GALLERY.length;
  const [idx, setIdx] = useState(0);        // real slides 0..N-1, clones at N (first) and -1 (last)
  const [anim, setAnim] = useState(true);   // transition on/off for seamless snapping
  const [paused, setPaused] = useState(false);

  const norm = i => ((i % N) + N) % N;

  const move = (dir) => {
    setAnim(true);
    setIdx(i => {
      const next = i + dir;
      if (next > N || next < -1) return i;  // ignore while standing on a clone
      return next;
    });
  };

  const goTo = (i) => { setAnim(true); setIdx(norm(i)); };

  // After gliding onto a clone (first-slide clone at the end, last-slide clone at
  // the front), silently jump to the matching real slide with the transition off —
  // so the loop reads as endless forward motion, never a long slide backwards.
  useEffect(() => {
    if (idx === N || idx === -1) {
      const t = setTimeout(() => {
        setAnim(false);
        setIdx(idx === N ? 0 : N - 1);
      }, SLIDE_MS + 20);
      return () => clearTimeout(t);
    }
  }, [idx, N]);

  // Re-enable transitions a couple of frames after an instant snap
  useEffect(() => {
    if (!anim) {
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)));
      return () => cancelAnimationFrame(r);
    }
  }, [anim]);

  // Autoplay every 3s. Hover no longer pauses (a cursor merely resting on the
  // slider kept it frozen forever); touch pauses only while the finger is down
  // so a swipe never fights a slide change — with a 5s safety resume in case
  // the touchend/cancel event is lost.
  useEffect(() => {
    if (paused) {
      const r = setTimeout(() => setPaused(false), 5000);
      return () => clearTimeout(r);
    }
    const t = setInterval(() => move(1), 3000);
    return () => clearInterval(t);
  }, [paused]);

  // Keyboard navigation
  useEffect(() => {
    const fn = (e) => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <div className="gallery-bg" id="gallery">
      <div className="gallery-inner">
          <span className="section-label"><Camera size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Gallery</span>
          <h2 className="section-title">A Glimpse of Paradise</h2>
          <p className="section-sub">Every corner of Shivalik Ice Hills tells a story of mountains, warmth and wonder.</p>
        <div
          className="slider"
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          onTouchCancel={() => setPaused(false)}
        >
          {/* Track = [clone of last] + real slides + [clone of first] → seamless circular loop */}
          <div className="slider-track"
               style={{ transform: `translateX(-${(idx + 1) * 100}%)`, transition: anim ? undefined : "none" }}>
            {[GALLERY[N - 1], ...GALLERY, GALLERY[0]].map((img, i) => (
              <div className={`slider-slide${i === idx + 1 ? " is-current" : ""}`} key={i}>
                {/* No lazy-loading here: inside the translating carousel track the
                    browser can defer these forever, leaving slides permanently blank.
                    All 9 gallery photos load eagerly (they're the section's content). */}
                <img className="slider-img-blur" src={img.url} alt="" aria-hidden="true" decoding="async" />
                <img className="slider-img" src={img.url} alt={img.label} decoding="async" />
                <div className="slider-caption">
                  <span className="slider-cat">{img.cat}</span>
                  <span className="slider-label">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-arrow slider-prev" onClick={() => move(-1)} aria-label="Previous slide">‹</button>
          <button className="slider-arrow slider-next" onClick={() => move(1)} aria-label="Next slide">›</button>
          <div className="slider-dots">
            {GALLERY.map((_, i) => (
              <button key={i} className={`slider-dot${norm(idx) === i ? " active" : ""}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// All property clips shown in the "See It Before You Visit" slider.
// Room/valley view leads; posters are property photos so nothing loads until play.
const TOUR_VIDEOS = [
  { src: frontVideo,    label: "Valley View from Room",            poster: imgIce1 },
  { src: homestayVideo, label: "Village and Chaukhamba Peak View", poster: roomImgHero },
  { src: videoInside,   label: "Inside the Homestay",              poster: roomImgHero },
  { src: videoAround,   label: "Around the Homestay",              poster: imgIce3 },
];

function VideoSection() {
  const N = TOUR_VIDEOS.length;
  const [idx, setIdx] = useState(0);
  const videoRefs = useRef([]);
  const go = i => setIdx(((i % N) + N) % N);

  // Sliding away from a clip stops it — so only one video can play at a time
  useEffect(() => {
    videoRefs.current.forEach((v, i) => { if (v && i !== idx) v.pause(); });
  }, [idx]);

  return (
    <div className="video-bg" id="video">
      <div className="video-inner">          <span className="section-label"><Film size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Experience</span>
        <h2 className="section-title">See It Before You Visit</h2>
        <p className="section-sub">
          Take a real tour of Shivalik Ice Hills and the breathtaking 
          surroundings of Guptkashi.
        </p>
        <div className="video-slider">
          <div className="video-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {TOUR_VIDEOS.map((v, i) => (
              <div className="video-slide" key={v.src}>
                <video ref={el => (videoRefs.current[i] = el)}
                       src={v.src} poster={v.poster} controls preload="metadata" playsInline />
                <span className="video-tag">{v.label}</span>
              </div>
            ))}
          </div>
          <button className="slider-arrow slider-prev" onClick={() => go(idx - 1)} aria-label="Previous video">‹</button>
          <button className="slider-arrow slider-next" onClick={() => go(idx + 1)} aria-label="Next video">›</button>
          <div className="video-count">{idx + 1} / {N}</div>
        </div>
      </div>
    </div>
  );
}

function Services() {
  return (
    <section className="section" id="services">
      <span className="section-label"><Sparkles size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Services</span>
      <h2 className="section-title">Everything You Need</h2>
      <p className="section-sub">Beyond comfortable rooms, we offer experiences that make your Himalayan journey unforgettable.</p>
      <div className="services-grid">
        {SERVICES.map(({ Icon, title, desc }) => (
          <div key={title} className="service-card">
            <span className="service-icon"><Icon size={28} strokeWidth={1.8} /></span>
            <div>
              <div className="service-title">{title}</div>
              <div className="service-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <div className="about-bg" id="about">
      <div className="about-grid">
        <div className="about-img-stack">
          <div className="about-img-main">
            <img src={imgIce4} alt="Chaukhamba view from Shivalik Ice Hills" />
          </div>
          <div className="about-img-accent">
            <img src={imgIce1} alt="View of Shivalik Ice Hills" />
          </div>
          <div className="about-card">
            <div className="about-card-num">5+</div>
            <div className="about-card-label">Years of Hosting</div>
          </div>
        </div>
        <div className="about-text">
          <span className="section-label"><HomeIcon size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Our Story</span>
          <h2 className="section-title">Born from a Love of Mountains</h2>
          <p>Shivalik Ice Hills began as a dream of Ram Prasad Negi — a local Garhwali who wanted to share the magic of his homeland with the world. What started as two rooms in a family home has grown into a beloved boutique homestay.</p>
          <p>Perched at 5,905 feet above sea level in the sacred town of Guptkashi, we're ideally placed on the route to Kedarnath Dham — one of the holiest shrines in India. Our guests aren't just visitors; they become part of our mountain family.</p>
          <div className="highlights">
            {["28 km from Sonprayag", "On NH-107 Highway", "Mandakini Riverside"].map(h => (
              <span key={h} className="highlight"><MapPin size={13} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "4px" }} />{h}</span>
            ))}
          </div>
          <div className="about-features">
            {[
              [MountainSnow, "Panoramic Views", "Unobstructed Himalayan vista from every room"],
              [Handshake, "Family-Run", "Personal care and authentic local hospitality"],
              [Recycle, "Eco-Friendly", "Solar power, rainwater harvesting, organic garden"],
              [ShieldCheck, "Safe & Clean", "Sanitized rooms, filtered water, fire safety certified"],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="about-feature">
                <span className="about-feature-icon"><Icon size={20} strokeWidth={1.8} /></span>
                <div className="about-feature-text">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WhyStay() {
  const reasons = [
    {
      icon: "🏔️", title: "Himalayan Views", desc: "Wake up to snow-capped Kedarnath peaks right from your window.",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&q=80", caption: "Kedarnath peaks, from your bed"
    },
    {
      icon: "🛏️", title: "Comfortable Rooms", desc: "Cozy, heated rooms with premium bedding and 24×7 hot water.",
      img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&q=80", caption: "Warm, cozy & spotless"
    },
    {
      icon: "🍛", title: "Uttarakhand Cuisine", desc: "Authentic home-cooked Garhwali meals from our organic garden.",
      img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=80", caption: "Fresh Garhwali thali"
    },
    {
      icon: "📍", title: "Near Kedarnath", desc: "Perfect base on the yatra route — just 28 km from Sonprayag.",
      img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&q=80", caption: "28 km from Sonprayag"
    },
    {
      icon: "❤️", title: "Peaceful Environment", desc: "Deodar forests, river sounds and starry skies — pure mountain calm.",
      img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&q=80", caption: "Deodar forests & stillness"
    },
  ];

  return (
    <section className="section" id="why">
      <span className="section-label"><Heart size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Why Stay With Us</span>
      <h2 className="section-title">Why Stay With Us?</h2>
      <p className="section-sub">Five reasons travelers choose Shivalik Ice Hills — and keep coming back.</p>
      <div className="why-grid">
        {reasons.map(({ icon, title, desc, img, caption }) => (
          <div key={title} className="why-card" tabIndex={0}>
            <div className="why-icon">{icon}</div>
            <div className="why-title">{title}</div>
            <div className="why-desc">{desc}</div>
            <div className="why-media" aria-hidden="true">
              <img src={img} alt="" loading="lazy" />
              <div className="why-media-caption">
                {icon} {title}
                <span>{caption}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Inline social brand logos (lucide dropped brand icons) — sized/styled like footer lucide icons
const YouTubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
  </svg>
);
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GoogleReviewsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" style={{ verticalAlign: "-3px", marginRight: "7px" }} aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
);

function Testimonials() {
  const N = TESTIMONIALS.length;
  const viewportRef = useRef(null);
  const offset = useRef(0);      // current scroll position of the strip (px)
  const wrapWidth = useRef(1);   // width of one full set of reviews (px)
  const dragging = useRef(null); // { startX, startOffset, id } while pressing
  const vel = useRef(0);         // px/frame from the last drag motion (for momentum)
  const lastX = useRef(0);
  const pausedRef = useRef(false);
  const [, force] = useState(0); // re-render after we mutate offset

  // Keep content on screen: normalise offset into [-wrapWidth, 0).
  const normalize = () => {
    const w = wrapWidth.current;
    if (offset.current <= -w) offset.current += w;
    if (offset.current > 0) offset.current -= w;
  };

  useEffect(() => {
    const track = viewportRef.current?.firstElementChild;
    if (!track) return;
    const measure = () => {
      // The track renders the set of reviews exactly twice; half of it = one loop length
      wrapWidth.current = track.scrollWidth / 2 || 1;
      normalize();
      apply();
    };
    const apply = () => { track.style.transform = `translate3d(${offset.current}px, 0, 0)`; };

    measure();
    window.addEventListener("resize", measure);

    let raf, last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 50); // clamp tab-switch jumps
      last = now;
      if (!pausedRef.current && !dragging.current) {
        // Announcement drift (~48px/s), or glide from the last drag (momentum)
        const speed = Math.abs(vel.current) > 0.2 ? vel.current : -0.8;
        offset.current += speed * (dt / 16.7);
        vel.current *= 0.95;              // momentum decays back to base drift
        if (vel.current > -0.2 && vel.current < 0.2) vel.current = 0;
        normalize();
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, []);

  // Drag with mouse or finger — moves the row both directions while held.
  const press = clientX => {
    dragging.current = { startX: clientX, startOffset: offset.current, moved: false };
    lastX.current = clientX;
    vel.current = 0;
    pausedRef.current = true;
  };
  const movePointer = clientX => {
    if (!dragging.current) return;
    const d = clientX - dragging.current.startX;
    if (Math.abs(d) > 4) dragging.current.moved = true;
    offset.current = dragging.current.startOffset + d;
    vel.current = clientX - lastX.current; // remember direction/speed for momentum
    lastX.current = clientX;
    normalize();
    viewportRef.current.firstElementChild.style.transform = `translate3d(${offset.current}px, 0, 0)`;
  };
  const release = () => { dragging.current = null; pausedRef.current = false; };

  // Safety net: if mouse/touch is released outside the strip (or the tab loses
  // focus mid-drag), stop dragging so the drift always resumes.
  useEffect(() => {
    const up = () => release();
    const mv = e => { if (dragging.current) movePointer(e.clientX); };
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", mv);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("touchend", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="testimonials-bg">
      <div className="testimonials-inner">
        <span className="section-label"><MessageSquare size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Reviews</span>
        <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>What Our Guests Say</h2>
        <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 0 1.25rem", fontSize: "1rem" }}>
          Real stories from the travelers who've stayed with us
        </p>
        <div className="testi-viewport" ref={viewportRef}
             onMouseEnter={() => { pausedRef.current = true; }}
             onMouseLeave={() => { if (!dragging.current) pausedRef.current = false; }}
             onMouseDown={e => { e.preventDefault(); press(e.clientX); }}
             onMouseMove={e => { if (dragging.current) movePointer(e.clientX); }}
             onMouseUp={release}
             onTouchStart={e => press(e.touches[0].clientX)}
             onTouchMove={e => movePointer(e.touches[0].clientX)}
             onTouchEnd={release}>
          {/* The set of reviews rendered twice back-to-back → the strip can
              slide forever in either direction with no visible seam. */}
          <div className="testi-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div className="testi-item" key={i} draggable={false}>
                <div className="testi-card">
                  <div className="testi-stars">{"★".repeat(t.rating)}</div>
                  <p className="testi-text">"{t.text}"</p>
                  <div className="testi-author">
                    {t.photo
                      ? <img className="testi-avatar testi-avatar-img" src={t.photo} alt={t.name} loading="lazy" draggable={false} />
                      : <div className="testi-avatar">{t.avatar}</div>}
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-loc">📍 {t.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="testi-cta">
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn-primary testi-cta-btn">
            <GoogleReviewsIcon />Rate us on Google
          </a>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { alert("Please fill all fields."); return; }
    setSending(true);
    try {
      await sendEmail(EMAILJS_CONTACT_TEMPLATE, {
        from_name:    form.name,
        from_email:   form.email,
        from_phone:   phone || "Not provided",
        message:      form.message,
        reply_to:     form.email,
        sent_at:      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      });
      setSent(true);
    } catch (err) {
      // If EmailJS keys not yet set, still show confirmation (demo mode)
      console.warn("EmailJS not configured:", err.message);
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section" id="contact">
      <span className="section-label"><Mail size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Contact</span>
      <h2 className="section-title">Get in Touch</h2>
      <p className="section-sub">Have questions? We're always happy to help you plan the perfect mountain getaway.</p>
      <div className="contact-grid">
        <div className="contact-info">
          <h3>Reach Us Directly</h3>
          {[
            [MapPin, "Address", "Shivalik Ice Hills, Village Dewar, Guptkashi, Rudraprayag, Uttarakhand – 246439"],
            [Phone, "Phone", "+91 9084956304 · +91 8439381703"],
            [Mail, "Email", "shivalikicehills77@gmail.com"],
            [Clock, "Check-in / Check-out", "Check-in: 12:00 PM · Check-out: 11:00 AM"],
            [Mountain, "Altitude", "5,905 feet above sea level"],
          ].map(([Icon, title, val]) => (
            <div key={title} className="contact-item">
              <div className="contact-icon"><Icon size={20} strokeWidth={1.8} /></div>
              <div>
                <div className="contact-item-title">{title}</div>
                <div className="contact-item-val">{val}</div>
              </div>
            </div>
          ))}
          <a href={WA_BOOKING_URL}
             target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
            <MessageCircle size={18} strokeWidth={2} /> Chat on WhatsApp
          </a>
        </div>
        <div>
          <h3 style={{ fontSize: "1.4rem", color: "var(--peak)", marginBottom: "1.5rem" }}>Send a Message</h3>
          {sent ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", background: "var(--ice)", borderRadius: "var(--radius)", border: "1px solid var(--glacier)" }}>
              <Handshake size={40} strokeWidth={1.4} color="var(--gold)" />
              <h4 style={{ color: "var(--peak)", marginBottom: "0.5rem" }}>Message Received!</h4>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Thank you {form.name}! We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSend}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input placeholder="Full name" value={form.name} onChange={e => set("name", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <div className="form-group full">
                  <label>Phone</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="form-group full">
                  <label>Message *</label>
                  <textarea style={{ minHeight: "140px" }} placeholder="Ask about rooms, availability, trek guidance, group bookings..." value={form.message} onChange={e => set("message", e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: "1rem", width: "100%", padding: "0.85rem" }} disabled={sending}>
                {sending ? "Sending..." : <>Send Message <Send size={15} strokeWidth={2} style={{ verticalAlign: "-2px", marginLeft: "4px" }} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer({ onBook, onPolicies }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">
              <img src={logoImg} alt="Shivalik Ice Hills logo" className="footer-brand-img" /> Shivalik Ice Hills
            </div>
            <p className="footer-brand-desc">A boutique mountain homestay in Guptkashi, Uttarakhand. The perfect base for Kedarnath pilgrims and Himalayan adventurers.</p>
            {/* Placeholder handles — swap in the real profile URLs when ready */}
            <div className="footer-social">
              <a href="https://www.youtube.com/@shivalikicehills" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YouTubeIcon size={18} /></a>
              <a href="https://www.facebook.com/shivalikicehills" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon size={18} /></a>
              <a href="https://www.instagram.com/shivalikicehills" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon size={18} /></a>
            </div>
          </div>
          <div className="footer-col footer-col-explore">
            <h4>Explore</h4>
            {[["#rooms", "Rooms"], ["#gallery", "Gallery"], ["#services", "Services"], ["#about", "Our Story"]].map(([h, l]) => (
              <a key={h} href={h}>{l}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#contact">Contact Us</a>
            <a href="#rooms">Book a Room</a>
            <a href="#" onClick={e => { e.preventDefault(); onPolicies("cancellation"); }}>Cancellation Policy</a>
            <a href="#" onClick={e => { e.preventDefault(); onPolicies(); }}>Privacy Policy</a>
          </div>
          <div className="footer-col footer-col-contact">
            <h4>Contact</h4>
            <a href="tel:+919084956304"><Phone size={13} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />+91 9084956304</a>
            <a href="tel:+918439381703"><Phone size={13} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />+91 8439381703</a>
            <a href="mailto:shivalikicehills77@gmail.com"><Mail size={13} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Email Us</a>
            <a href={WA_BOOKING_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />WhatsApp</a>
            <div className="footer-book-row">
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"><MapPin size={13} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Directions</a>
              <a href={WA_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="footer-book" title="Book on WhatsApp">
                <CalendarDays size={15} strokeWidth={2} /> Book Now
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>
            <div className="footer-copy">© 2026 Shivalik Ice Hills, Guptkashi, Uttarakhand. All rights reserved.</div>
            <div className="footer-dev">Developed and maintained by Sahil Negi</div>
          </div>
          <div className="footer-love">Made with <Heart size={12} strokeWidth={2.2} color="#e05656" style={{ verticalAlign: "-1px", margin: "0 2px" }} /> in the Himalayas</div>
        </div>
      </div>
    </footer>
  );
}

// ── Hotel Policies page (opened from footer links) ──
function PolicyPage({ section, onClose }) {
  const [closing, setClosing] = useState(false);
  const targetRef = useRef(null);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 320);
  };

  // Lock page scroll while open
  useEffect(() => {
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  // Esc closes; arrow keys are left to the page scroll
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") requestClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [closing]);

  // Scroll to a deep-linked section (e.g. "cancellation") once mounted
  useEffect(() => {
    if (!section) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`policy-${section}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450); // after the entrance animation settles
    return () => clearTimeout(t);
  }, [section]);

  return (
    <div className={`pol-page${closing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="Hotel policies">
      <div className="rg-topbar">
        <button className="rg-back" aria-label="Back to site" onClick={requestClose}>
          <ChevronLeft size={16} strokeWidth={2.4} /> Back
        </button>
        <span className="rg-brand">Shivalik Ice Hills</span>
      </div>
      <div className="pol-hero">
        <span className="section-label"><ScrollText size={14} strokeWidth={2.2} style={{ verticalAlign: "-2px", marginRight: "5px" }} />Hotel Policies</span>
        <h2 className="rg-title">Policies & House Rules</h2>
        <p className="rg-sub">At Shivalik Ice Hills, we aim to provide a comfortable and hassle-free stay. Please review our policies before booking.</p>
      </div>
      <div className="pol-grid">
        {POLICY_SECTIONS.map(({ id, Icon, title, items }) => (
          <div key={id} id={`policy-${id}`} className="pol-card" ref={section === id ? targetRef : undefined}>
            <div className="pol-card-head">
              <span className="pol-icon"><Icon size={17} strokeWidth={1.9} /></span>
              <h3>{title}</h3>
            </div>
            <ul>
              {items.map((item, i) => (
                <li key={i}><span className="pol-num">{i + 1}.</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pol-contact">
        <h3>Questions? We're here to help.</h3>
        <p>For any queries or special requests, feel free to contact us anytime.</p>
        <div className="pol-contact-btns">
          <a className="btn-primary" href="tel:+919084956304">📞 +91 9084956304</a>
          <a className="btn-outline" href="https://wa.me/919084956304?text=Hello!%20I%20have%20a%20question%20about%20your%20policies." target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [booking, setBooking] = useState(null);
  const [policies, setPolicies] = useState(null);

  // Inject viewport meta to prevent mobile zoom/overflow issues
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
    // Prevent any element from causing horizontal scroll
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.width = "100%";
    document.body.style.position = "relative";
  }, []);

  const openBooking = (room = null, checkin = "", checkout = "", guests = "1") => {
    setBooking({ room, checkin, checkout, guests });
    if (!room) {
      setTimeout(() => document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "hidden", position: "relative" }}>
      <style>{CSS}</style>
      <Navbar />
      <Hero />
      <About />
      <WhyStay />
      <Rooms onBook={(room) => setBooking({ room, checkin: "", checkout: "", guests: "1" })} />
      <div className="divider" />
      <Services />
      <div className="divider" />
      <Gallery />
      <VideoSection />
      <Testimonials />
      <Contact />
      <Footer onBook={openBooking} onPolicies={(section) => setPolicies({ section })} />

      {/* Floating Book Now → WhatsApp */}
      <a href={WA_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="book-float" title="Book on WhatsApp">
      <CalendarDays size={19} strokeWidth={2} />
        <span>Book Now</span>
        <span className="book-tooltip">Book instantly on WhatsApp</span>
      </a>

      {/* Booking Modal */}
      {booking && (
        <BookingModal
          room={booking.room}
          preCheckin={booking.checkin}
          preCheckout={booking.checkout}
          preGuests={booking.guests}
          onClose={() => setBooking(null)}
        />
      )}

      {/* Hotel Policies page (footer links) */}
      {policies && <PolicyPage section={policies.section} onClose={() => setPolicies(null)} />}
    </div>
  );
}
