// ----- Phosphor-light style line icons -----

const Icon = {
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  ),
  ArrowUR: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Brush: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M14 5l5 5-9 9H5v-5l9-9z" />
      <path d="M13 6l5 5" />
    </svg>
  ),
  Pen: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M4 20h4l11-11-4-4L4 16v4z" />
      <path d="M14 6l4 4" />
    </svg>
  ),
  Music: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="15.5" r="2.5" />
      <path d="M9 17.5V5l11-2v12.5" />
    </svg>
  ),
  Mic: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </svg>
  ),
  Letter: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 8l9 6 9-6" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      <path d="M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
    </svg>
  ),
  Map: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  Controller: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M6 8h12a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-1l-2-2H9l-2 2H6a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4z" />
      <path d="M8 12h2M9 11v2M15 12h.01M17 13h.01" />
    </svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Star: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5l6.5-.5z" />
    </svg>
  ),
  Play: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  ),
  Camera: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M3 8h4l2-3h6l2 3h4v11H3z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  Coffee: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M4 8h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
      <path d="M17 10h2a2 2 0 0 1 0 4h-2M7 4v2M11 4v2M15 4v2" />
    </svg>
  ),
  Leaf: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M20 4c0 8-6 14-14 14-1.5 0-2-1-2-2C4 8 10 4 18 4h2z" />
      <path d="M4 20L14 10" />
    </svg>
  ),
  Spiral: (p) => (
    <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} className="li" {...p}>
      <path d="M12 5a7 7 0 1 1-7 7 5 5 0 0 1 10 0 3 3 0 0 1-6 0" />
    </svg>
  )
};

window.Icon = Icon;
