// ----- Data for Campus Vibe Wall -----

// Unsplash photo URLs (small) — chosen for soft, warm, student/creative vibes.
// All sourced from Unsplash CDN as random imagery placeholders.
const PHOTOS = {
  desk: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=70",
  sketchbook: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=70",
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=70",
  flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=70",
  windowlight: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=70",
  cassette: "https://images.unsplash.com/photo-1542208998-f6dbbc14d61b?w=800&q=70",
  film: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=70",
  laptop: "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88?w=800&q=70",
  plant: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=70",
  campus: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=70",
  hands: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=70",
  vinyl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=70",
  sky: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=70",
  rain: "https://images.unsplash.com/photo-1493314894560-5c412a56c17c?w=800&q=70",
  walking: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&q=70",
  library: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=70",
  doodle: "https://images.unsplash.com/photo-1500627964684-141351970a7f?w=800&q=70",
  polaroidStack: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&q=70",
  tea: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=70",
  cat: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=70",
  guitar: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=70",
  bike: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?w=800&q=70",
  pages: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&q=70",
  pencils: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=70",
  paint: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=70",
  street: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=70",
  bookshelf: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=70",
  chai: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800&q=70",
  golden: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70",
  hill: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=70",
  notebook: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=70"
};

const MOODS = [
  { id: "bored", label: "Bored", glyph: "◌", color: "var(--sage)", tone: "We've got something for that.", textcolor: "var(--sage-deep)" },
  { id: "stressed", label: "Stressed", glyph: "✦", color: "var(--rose)", tone: "Soft landing inbound.", textcolor: "var(--rose-deep)" },
  { id: "happy", label: "Happy", glyph: "✿", color: "var(--butter)", tone: "Spread some of that around.", textcolor: "var(--butter-deep)" },
  { id: "sad", label: "Sad", glyph: "❍", color: "var(--sky)", tone: "Someone left a note for you.", textcolor: "#7a92b0" },
  { id: "hyped", label: "Hyped", glyph: "✺", color: "var(--terra)", tone: "Let's channel that.", textcolor: "var(--terra)" },
  { id: "lost", label: "Lost", glyph: "✸", color: "var(--plum)", tone: "It happens. We're here.", textcolor: "var(--plum)" }
];

// Vibe wall items — mixed media
const WALL = [
  { kind: "photo", img: PHOTOS.windowlight, cap: "5pm light, library window", mood: "happy", who: "F.S.", tilt: -1.2 },
  { kind: "confession", text: "i cried after viva and then bought myself biryani. recommend.", mood: "stressed", who: "anon", tilt: 1 },
  { kind: "song", title: "Pasoori", artist: "Ali Sethi · Shae Gill", color: "var(--rose)", art: PHOTOS.cassette, mood: "hyped" },
  { kind: "doodle", img: PHOTOS.doodle, label: "doodle no. 074", mood: "bored", who: "H.K.", tilt: -2 },
  { kind: "poem", lines: ["chai gets cold faster", "than my will to attend 8am"], mood: "bored", who: "anon" },
  { kind: "photo", img: PHOTOS.coffee, cap: "third cup, second wind", mood: "stressed", who: "R.M.", tilt: 1.5 },
  { kind: "note", text: "you're doing better than you think. promise.", mood: "stressed", who: "passed by anon → you" },
  { kind: "song", title: "Tum Hi Aana", artist: "Jubin Nautiyal", color: "var(--sky)", art: PHOTOS.vinyl, mood: "sad" },
  { kind: "photo", img: PHOTOS.sketchbook, cap: "page 12. mostly margins.", mood: "happy", who: "Z.A.", tilt: -1 },
  { kind: "doodle", img: PHOTOS.pencils, label: "study still life", mood: "happy", who: "M.K." },
  { kind: "confession", text: "the third floor has the best napping couch and no i won't say which.", mood: "bored", who: "anon" },
  { kind: "photo", img: PHOTOS.chai, cap: "dhaba run, 11:47pm", mood: "hyped", who: "N.S.", tilt: 1.3 },
  { kind: "poem", lines: ["if monday were a person", "i'd unfollow them quietly"], mood: "bored", who: "F.K." },
  { kind: "song", title: "Tareefan", artist: "Badshah", color: "var(--butter)", art: PHOTOS.guitar, mood: "hyped" },
  { kind: "photo", img: PHOTOS.flowers, cap: "found these by C-block", mood: "happy", who: "I.R.", tilt: -1.6 },
  { kind: "note", text: "drink water. it's the most boring advice and it works.", mood: "stressed", who: "→ you" },
  { kind: "doodle", img: PHOTOS.paint, label: "watercolor mood", mood: "happy", who: "A.B." },
  { kind: "confession", text: "i wave at the campus cat every morning. she's my only consistent relationship.", mood: "lost", who: "anon" },
  { kind: "photo", img: PHOTOS.cat, cap: "the cat in question", mood: "happy", who: "anon", tilt: 1.1 },
  { kind: "song", title: "Aaj Jaane Ki Zid Na Karo", artist: "Farida Khanum", color: "var(--plum)", art: PHOTOS.film, mood: "sad" },
  { kind: "photo", img: PHOTOS.golden, cap: "golden hour on the way home", mood: "happy", who: "S.T.", tilt: -1 },
  { kind: "poem", lines: ["library wifi: ★★★★★", "library chairs: ★"], mood: "bored", who: "T.A." },
  { kind: "photo", img: PHOTOS.bike, cap: "race you to D-block", mood: "hyped", who: "anon", tilt: 1.4 },
  { kind: "note", text: "you don't have to figure out your whole life by tuesday.", mood: "lost", who: "passed forward" }
];

// Passed-forward letters
const LETTERS = [
  { from: "anon, last tuesday", to: "stressed", body: "the night before viva i was you. i promise, you remember more than you think. just breathe." },
  { from: "F.K., 2:14am", to: "lost", body: "i don't know what i'm doing either. neither does anyone else with a 4.0. we're guessing together." },
  { from: "anon", to: "sad", body: "the campus cat by C-block will sit with you. she doesn't ask questions. ten minutes works wonders." },
  { from: "R.M.", to: "bored", body: "go count the windows on B-block. there's a heart drawn in dust on the 3rd floor, second from left." },
  { from: "anon", to: "happy", body: "if you're reading this happy, drop a song on the wall. someone needs it more than you know." }
];

// Confession ticker lines
const TICKERS = [
  "i wave at the cleaning aunty every morning, she's my favourite person on campus",
  "the canteen samosa is mid but the chai is genuinely art",
  "i miss home but i don't miss home-cooked sabzi",
  "we live in the library now. send rations.",
  "if you see a girl crying in the staircase it's me. say hi.",
  "monday me would never recognize friday me",
  "midterms are a personality at this point",
  "someone leave me a song that doesn't make me cry"
];

// Daily spark prompts
const SPARKS = [
  "draw what monday feels like in 30 seconds",
  "write a 2-line couplet about chai",
  "describe today's sky in five words",
  "draw your hand without looking down",
  "leave a song for the next sad person",
  "design a logo for boredom"
];

// Games
const GAMES = [
  { name: "Reaction Race", tag: "0.32s avg", desc: "Tap the dot the second it turns warm.", cover: PHOTOS.golden, color: "var(--terra)" },
  { name: "Word Knot", tag: "Urdu × English", desc: "Untangle a 5-letter word before the kettle boils.", cover: PHOTOS.notebook, color: "var(--sage-deep)" },
  { name: "Memory Lane", tag: "Daily flip", desc: "Match polaroids of campus across years.", cover: PHOTOS.polaroidStack, color: "var(--rose-deep)" },
  { name: "Trivia Tea", tag: "12 sec rounds", desc: "Live trivia with whoever else is bored.", cover: PHOTOS.tea, color: "var(--butter-deep)" }
];

// Mood map (campus heat) — 8x8
const MOOD_MAP_SEED = [
  "bored","stressed","happy","stressed","hyped","sad","bored","lost",
  "stressed","stressed","bored","bored","happy","stressed","happy","hyped",
  "lost","bored","stressed","happy","happy","hyped","stressed","bored",
  "bored","sad","sad","stressed","bored","bored","happy","stressed",
  "stressed","bored","happy","happy","hyped","happy","lost","stressed",
  "happy","hyped","happy","bored","stressed","sad","bored","happy",
  "bored","stressed","bored","happy","happy","hyped","stressed","bored",
  "stressed","stressed","bored","stressed","sad","bored","happy","hyped"
];

Object.assign(window, { PHOTOS, MOODS, WALL, LETTERS, TICKERS, SPARKS, GAMES, MOOD_MAP_SEED });
