// ----- Page sections -----
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

// ------- NAV -------
function FloatingNav({ onCompose, currentMood }) {
  const links = [
    { id: "wall", label: "The Wall" },
    { id: "mood", label: "Mood Check-in" },
    { id: "forward", label: "Pass Forward" },
    { id: "create", label: "Create" },
    { id: "map", label: "Mood Map" },
    { id: "games", label: "Games" }
  ];
  const [scrolled, setScrolled] = useStateS(false);
  useEffectS(() => {
    const onS = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onS, { passive: true });
    return () => window.removeEventListener("scroll", onS);
  }, []);
  return (
    <div style={{
      position: "fixed", top: scrolled ? 16 : 24, left: 0, right: 0, zIndex: 60,
      display: "flex", justifyContent: "center", pointerEvents: "none",
      transition: "top 0.7s var(--ease-fluid)"
    }}>
      <div style={{ pointerEvents: "auto", display: "flex", gap: 10, alignItems: "center" }}>
        {/* logomark */}
        <div className="bezel" style={{ padding: 5, borderRadius: 999 }}>
          <div className="bezel-inner" style={{ borderRadius: 999, padding: "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent)", boxShadow: "0 0 0 4px color-mix(in oklch, var(--accent) 20%, transparent)" }}></span>
            <span className="serif-i" style={{ fontSize: 20, color: "var(--espresso)", letterSpacing: "-0.01em" }}>vibe wall</span>
            <span className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--mocha)", textTransform: "uppercase", paddingLeft: 4, borderLeft: "1px solid color-mix(in oklch, var(--espresso) 10%, transparent)" }}>nutech</span>
          </div>
        </div>

        {/* links */}
        <nav className="bezel" style={{ padding: 5, borderRadius: 999 }}>
          <div className="bezel-inner" style={{ borderRadius: 999, padding: "6px 8px", display: "flex", gap: 2 }}>
            {links.map(l => (
              <a key={l.id} href={"#" + l.id} style={{
                padding: "10px 14px", borderRadius: 999, fontSize: 13.5,
                color: "var(--cocoa)", textDecoration: "none", fontWeight: 500,
                transition: "background 0.5s var(--ease-fluid), color 0.5s var(--ease-fluid)"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in oklch, var(--espresso) 6%, transparent)"; e.currentTarget.style.color = "var(--espresso)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--cocoa)"; }}
              >{l.label}</a>
            ))}
          </div>
        </nav>

        <PillBtn icon={<Icon.Plus size={14} />} onClick={onCompose} variant="accent">Drop something</PillBtn>
      </div>
    </div>
  );
}

// ------- HERO -------
function Hero({ onCompose, mood }) {
  const now = new Date();
  const hr = now.getHours();
  const greet = hr < 5 ? "still up?" : hr < 12 ? "morning, you" : hr < 17 ? "afternoon, you" : hr < 21 ? "evening, you" : "late one tonight";

  return (
    <section style={{ position: "relative", paddingTop: 140, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <Reveal>
            <Eyebrow>Soft place between classes · NUTECH ’26</Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <div className="mono" style={{ fontSize: 11, color: "var(--mocha)", letterSpacing: "0.16em", textTransform: "uppercase", textAlign: "right" }}>
              <div>{now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
              <div style={{ color: "var(--cocoa)", marginTop: 2 }}>{greet}.</div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <h1 className="hero-title">
            the campus,<br />
            <em>quietly</em> talking<br />
            to itself.
          </h1>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 50, marginTop: 60, alignItems: "end" }}>
          <Reveal delay={180}>
            <p className="serif" style={{ fontSize: 24, lineHeight: 1.35, color: "var(--cocoa)", maxWidth: 540, margin: 0, textWrap: "pretty" }}>
              A soft, anonymous wall where students drop <span className="uline-accent">doodles</span>, <span className="uline-accent">two-line poems</span>, <span className="uline-accent">songs</span>, and tiny notes for whoever shows up next.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <PillBtn icon={<Icon.Plus size={14} />} onClick={onCompose} variant="accent">Drop something</PillBtn>
              <PillBtn icon={<Icon.ArrowUR size={14} />} as="a" href="#mood" variant="ghost">Find me an activity</PillBtn>
            </div>
            <div style={{ marginTop: 36, display: "flex", gap: 24, color: "var(--mocha)" }}>
              <Stat n="2,847" l="things dropped today" />
              <div className="vhair"></div>
              <Stat n="312" l="letters passed forward" />
              <div className="vhair"></div>
              <Stat n="74%" l="campus feels okay" />
            </div>
          </Reveal>

          <Reveal delay={260}>
            <HeroCollage />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }) {
  return (
    <div>
      <div className="serif" style={{ fontSize: 36, lineHeight: 1, color: "var(--espresso)" }}>{n}</div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mocha)", marginTop: 6, textTransform: "uppercase" }}>{l}</div>
    </div>
  );
}

function HeroCollage() {
  return (
    <div style={{ position: "relative", height: 460 }}>
      <div style={{ position: "absolute", left: "5%", top: 10, width: "44%", animation: "float-a 8s ease-in-out infinite", "--r": "-3deg" }}>
        <Polaroid img={PHOTOS.windowlight} cap="5pm light, library" tilt={-3} />
      </div>
      <div style={{ position: "absolute", right: "0%", top: 30, width: "46%", animation: "float-a 9s ease-in-out infinite", "--r": "2.5deg", animationDelay: "0.4s" }}>
        <Polaroid img={PHOTOS.chai} cap="dhaba run, late" tilt={2.5} />
      </div>
      <div style={{ position: "absolute", left: "20%", bottom: 0, width: "40%", animation: "float-a 10s ease-in-out infinite", "--r": "-1.2deg", animationDelay: "0.8s", zIndex: 3 }}>
        <Bezel style={{ background: "color-mix(in oklch, var(--rose) 35%, transparent)" }}>
          <div style={{ padding: 18 }}>
            <span className="stamp">✉ for you</span>
            <p className="serif-i" style={{ fontSize: 22, lineHeight: 1.2, margin: "10px 0 4px" }}>"you're doing better than you think."</p>
            <span className="mono" style={{ fontSize: 9, color: "var(--mocha)", letterSpacing: "0.16em" }}>— passed forward, 14m ago</span>
          </div>
        </Bezel>
      </div>
      <div style={{ position: "absolute", right: "10%", bottom: 30, transform: "rotate(8deg)", width: 100, height: 100, borderRadius: 999, background: "var(--paper)", display: "grid", placeItems: "center", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.35)", animation: "float-a 7s ease-in-out infinite", "--r": "8deg" }}>
        <div className="serif-i" style={{ fontSize: 14, color: "var(--accent)", textAlign: "center", lineHeight: 1.1 }}>vibe<br />wall<br /><span style={{ fontSize: 9, color: "var(--mocha)", letterSpacing: "0.1em", fontStyle: "normal" }} className="mono">est. ’26</span></div>
      </div>
    </div>
  );
}

// ------- LIVE TICKER -------
function ConfessionTicker() {
  const items = [...TICKERS, ...TICKERS];
  return (
    <section style={{ padding: "20px 0 30px" }}>
      <div className="container">
        <div className="bezel" style={{ background: "color-mix(in oklch, var(--espresso) 8%, transparent)" }}>
          <div className="bezel-inner" style={{ padding: "16px 24px", background: "var(--paper)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span className="stamp" style={{ flexShrink: 0 }}>● live · anon confessions</span>
              <div className="ticker">
                <div className="ticker-track">
                  {items.map((t, i) => <span key={i} className="ticker-item">{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------- MOOD CHECK-IN -------
function MoodCheckIn({ mood, setMood }) {
  const m = MOODS.find(x => x.id === mood) || MOODS[0];
  return (
    <section id="mood" style={{ padding: "100px 0 60px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 36 }}>
          <Reveal>
            <Eyebrow>02 · mood check-in</Eyebrow>
            <h2 className="serif" style={{ fontSize: "clamp(40px, 6vw, 84px)", lineHeight: 0.98, margin: "14px 0 0", letterSpacing: "-0.02em" }}>
              how are you<br /><em className="serif-i" style={{ color: "var(--accent)" }}>actually</em> today?
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="serif" style={{ fontSize: 19, lineHeight: 1.35, color: "var(--cocoa)", maxWidth: 360, margin: 0 }}>
              Tap a feeling. The page softens around it. You get three things that match — and a note from someone who felt the same.
            </p>
          </Reveal>
        </div>

        <Reveal delay={180}>
          <div className="moods">
            {MOODS.map(opt => (
              <button key={opt.id} onClick={() => setMood(opt.id)} style={{
                background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", textAlign: "left"
              }}>
                <Bezel className="lift"
                  style={{ background: mood === opt.id ? `color-mix(in oklch, ${opt.color} 60%, transparent)` : "color-mix(in oklch, var(--linen) 50%, transparent)", transition: "background 0.6s var(--ease-fluid)" }}
                  innerStyle={{ background: mood === opt.id ? `color-mix(in oklch, ${opt.color} 22%, var(--paper))` : "var(--paper)", padding: "20px 18px 22px", transition: "background 0.6s var(--ease-fluid)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 26, color: opt.textcolor, fontFamily: "Instrument Serif", lineHeight: 1 }}>{opt.glyph}</span>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: opt.textcolor, opacity: mood === opt.id ? 1 : 0.3, transition: "opacity 0.5s var(--ease-fluid)" }}></span>
                  </div>
                  <div className="serif" style={{ fontSize: 26, lineHeight: 1, color: "var(--espresso)" }}>{opt.label}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mocha)", marginTop: 8, textTransform: "uppercase" }}>· tap if it's you ·</div>
                </Bezel>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Personalized response */}
        <div style={{ marginTop: 36 }}>
          <Bezel style={{ background: `color-mix(in oklch, ${m.color} 50%, transparent)` }} innerStyle={{ background: `color-mix(in oklch, ${m.color} 12%, var(--paper))`, padding: 28 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
              <div style={{ gridColumn: "span 1" }}>
                <span className="stamp" style={{ background: `color-mix(in oklch, ${m.textcolor} 22%, transparent)`, color: m.textcolor }}>· you said: {m.label.toLowerCase()} ·</span>
                <h3 className="serif-i" style={{ fontSize: 34, lineHeight: 1.05, margin: "16px 0 8px", color: "var(--espresso)" }}>{m.tone}</h3>
                <p className="serif" style={{ fontSize: 16, lineHeight: 1.4, color: "var(--cocoa)", margin: 0 }}>
                  We pulled three soft things from the wall that match how you're feeling. Pick one. Or just sit here. No pressure.
                </p>
              </div>
              <ActivityCard mood={mood} idx={0} />
              <ActivityCard mood={mood} idx={1} />
            </div>
          </Bezel>
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ mood, idx }) {
  const recs = {
    bored: [
      { tag: "60 sec", title: "Reaction Race", body: "Hands on, brain off. Tap when the dot warms up.", icon: <Icon.Controller size={18} /> },
      { tag: "2 min", title: "Doodle no. 075", body: "Today's prompt: draw your hand without looking.", icon: <Icon.Brush size={18} /> }
    ],
    stressed: [
      { tag: "1 min", title: "A letter found you", body: "Someone passed forward a note for stressed students.", icon: <Icon.Letter size={18} /> },
      { tag: "3 min", title: "Slow chai playlist", body: "12 songs, no skips, made by anon for anon.", icon: <Icon.Music size={18} /> }
    ],
    happy: [
      { tag: "30 sec", title: "Pass it forward", body: "Leave one good thing for the next stressed student.", icon: <Icon.Letter size={18} /> },
      { tag: "1 min", title: "Drop a song", body: "Spread the good. Someone needs your taste right now.", icon: <Icon.Music size={18} /> }
    ],
    sad: [
      { tag: "2 min", title: "Sit with this", body: "A 2-line poem someone wrote for exactly this feeling.", icon: <Icon.Pen size={18} /> },
      { tag: "1 min", title: "The campus cat", body: "Live cam from C-block. She's currently asleep. So real.", icon: <Icon.Camera size={18} /> }
    ],
    hyped: [
      { tag: "2 min", title: "Doodle Wars", body: "Same prompt, two people, ninety seconds. Tournament style.", icon: <Icon.Brush size={18} /> },
      { tag: "12 sec", title: "Trivia Tea", body: "Whoever else is online vs. you. Quick rounds, no mercy.", icon: <Icon.Controller size={18} /> }
    ],
    lost: [
      { tag: "1 min", title: "You're not alone-lost", body: "Read 5 notes from other lost students. Anonymity attached.", icon: <Icon.Letter size={18} /> },
      { tag: "2 min", title: "A mini map of right now", body: "Where everyone else's heads are at, this exact minute.", icon: <Icon.Map size={18} /> }
    ]
  };
  const card = (recs[mood] || recs.bored)[idx];
  return (
    <div style={{
      background: "var(--paper)",
      borderRadius: 16,
      padding: 20,
      boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--espresso) 8%, transparent), 0 14px 30px -20px rgba(40,28,16,0.2)",
      display: "flex", flexDirection: "column", justifyContent: "space-between"
    }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ width: 36, height: 36, borderRadius: 99, background: "color-mix(in oklch, var(--accent) 14%, transparent)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
            {card.icon}
          </span>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mocha)", textTransform: "uppercase" }}>{card.tag}</span>
        </div>
        <h4 className="serif" style={{ fontSize: 26, lineHeight: 1.05, margin: "18px 0 8px", color: "var(--espresso)" }}>{card.title}</h4>
        <p style={{ fontSize: 14, lineHeight: 1.45, color: "var(--cocoa)", margin: 0 }}>{card.body}</p>
      </div>
      <button className="pill-btn" style={{ marginTop: 18, width: "fit-content" }}>
        <span>begin</span>
        <span className="icon-pod"><Icon.Arrow size={12} /></span>
      </button>
    </div>
  );
}

// ------- VIBE WALL -------
function VibeWall() {
  const [filter, setFilter] = useStateS("all");
  const filtered = filter === "all" ? WALL : WALL.filter(w => w.kind === filter);
  return (
    <section id="wall" style={{ padding: "100px 0 80px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 30 }}>
          <Reveal>
            <Eyebrow>01 · live · the wall</Eyebrow>
            <h2 className="serif" style={{ fontSize: "clamp(40px, 6.5vw, 88px)", lineHeight: 0.96, margin: "14px 0 0", letterSpacing: "-0.02em" }}>
              everything the campus<br /><em className="serif-i" style={{ color: "var(--accent)" }}>dropped</em> today.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="bezel" style={{ borderRadius: 999, padding: 5 }}>
              <div className="bezel-inner" style={{ borderRadius: 999, padding: "6px 8px", display: "flex", gap: 2 }}>
                {[
                  { id: "all", l: "all 24" },
                  { id: "photo", l: "photos" },
                  { id: "doodle", l: "doodles" },
                  { id: "song", l: "songs" },
                  { id: "poem", l: "poems" },
                  { id: "confession", l: "confessions" },
                  { id: "note", l: "notes" }
                ].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} style={{
                    padding: "9px 14px", borderRadius: 999, fontSize: 12.5, letterSpacing: "-0.005em",
                    background: filter === f.id ? "var(--espresso)" : "transparent",
                    color: filter === f.id ? "var(--paper)" : "var(--cocoa)",
                    border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
                    transition: "background 0.5s var(--ease-fluid)"
                  }}>{f.l}</button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="masonry">
            {filtered.map((item, i) => (
              <WallItem key={i} item={item} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------- PASS IT FORWARD -------
function PassForward() {
  const [openIdx, setOpenIdx] = useStateS(null);
  const [draft, setDraft] = useStateS("");
  const [sent, setSent] = useStateS(false);
  return (
    <section id="forward" style={{ padding: "120px 0 80px" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <Reveal><Eyebrow>03 · pass it forward</Eyebrow></Reveal>
          <Reveal delay={120}>
            <h2 className="serif" style={{ fontSize: "clamp(46px, 7vw, 104px)", lineHeight: 0.95, margin: "16px auto 16px", letterSpacing: "-0.02em", maxWidth: 900 }}>
              leave one good thing for<br /><em className="serif-i" style={{ color: "var(--accent)" }}>the next bored student.</em>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="serif" style={{ fontSize: 19, lineHeight: 1.4, color: "var(--cocoa)", maxWidth: 580, margin: "0 auto" }}>
              An anonymous letter chain. You read one, you write one. It gets delivered to someone feeling exactly the way you felt today.
            </p>
          </Reveal>
        </div>

        <Reveal delay={250}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22, marginBottom: 30 }}>
            {LETTERS.slice(0, 3).map((l, i) => (
              <div key={i} className={"envelope " + (openIdx === i ? "open " : "") + "lift"} onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="envelope-flap"></div>
                <div className="envelope-letter">
                  <span className="mono" style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--mocha)", textTransform: "uppercase" }}>to: feeling {l.to}</span>
                  <p className="serif-i" style={{ fontSize: 19, lineHeight: 1.25, margin: "8px 0 8px", color: "var(--espresso)" }}>"{l.body}"</p>
                  <span className="mono" style={{ fontSize: 10, color: "var(--mocha)" }}>— {l.from}</span>
                </div>
                <div className="envelope-seal">w</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="bezel" style={{ background: "color-mix(in oklch, var(--sage) 40%, transparent)" }}>
            <div className="bezel-inner" style={{ padding: 28, background: "color-mix(in oklch, var(--sage) 8%, var(--paper))" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 28, alignItems: "center" }}>
                <div>
                  <Eyebrow color="var(--sage-deep)">your turn</Eyebrow>
                  <h3 className="serif-i" style={{ fontSize: 38, lineHeight: 1.04, margin: "12px 0 8px", color: "var(--espresso)" }}>
                    write something for whoever needs it next.
                  </h3>
                  <p className="serif" style={{ fontSize: 16, lineHeight: 1.4, color: "var(--cocoa)", margin: "0 0 20px" }}>
                    No names, no logins. Just one line that would have helped <em>you</em> earlier today.
                  </p>
                  <div style={{ position: "relative" }}>
                    <textarea
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      placeholder="i wish someone had told me…"
                      maxLength={180}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "16px 18px",
                        fontFamily: "Instrument Serif, serif",
                        fontStyle: "italic",
                        fontSize: 22,
                        background: "var(--paper)",
                        color: "var(--espresso)",
                        border: "none",
                        borderRadius: 14,
                        boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--espresso) 10%, transparent), inset 0 1px 2px rgba(0,0,0,0.04)",
                        resize: "none",
                        outline: "none"
                      }}
                    />
                    <span className="mono" style={{ position: "absolute", bottom: 12, right: 16, fontSize: 10, color: "var(--mocha)" }}>{draft.length}/180</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
                    <button className="pill-btn accent" onClick={() => { if (draft.trim()) { setSent(true); setTimeout(() => { setSent(false); setDraft(""); }, 2400); } }}>
                      <span>{sent ? "delivered ✓" : "pass it forward"}</span>
                      <span className="icon-pod"><Icon.Letter size={14} /></span>
                    </button>
                    <span className="mono" style={{ fontSize: 10, color: "var(--mocha)", letterSpacing: "0.14em", textTransform: "uppercase" }}>· delivered to one anon ·</span>
                  </div>
                </div>
                <div style={{ position: "relative", aspectRatio: "1", maxWidth: 380, marginLeft: "auto" }}>
                  {/* stack of letters */}
                  {[2, 1, 0].map(i => (
                    <div key={i} style={{
                      position: "absolute",
                      inset: 0,
                      transform: `rotate(${(i - 1) * 4}deg) translate(${(i - 1) * 14}px, ${i * -10}px)`,
                      background: ["color-mix(in oklch, var(--rose) 60%, var(--paper))", "color-mix(in oklch, var(--butter) 60%, var(--paper))", "color-mix(in oklch, var(--sage) 60%, var(--paper))"][i],
                      borderRadius: 14,
                      boxShadow: "0 24px 40px -24px rgba(40,28,16,0.4), inset 0 0 0 1px rgba(0,0,0,0.06)",
                      padding: 22,
                      display: "flex", flexDirection: "column", justifyContent: "space-between"
                    }}>
                      <div>
                        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--mocha)", textTransform: "uppercase", marginBottom: 8 }}>letter no. {1247 - i}</div>
                        <p className="serif-i" style={{ fontSize: 18, lineHeight: 1.2, color: "var(--espresso)", margin: 0 }}>
                          {["...", "...the chai stand at 11pm is open later than you think.", ""][i] || ""}
                        </p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                        <span className="hand" style={{ fontSize: 22, color: "var(--cocoa)" }}>♡</span>
                        <span className="mono" style={{ fontSize: 9, color: "var(--mocha)" }}>via anon</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------- CREATIVE DROP ZONE -------
function CreativeDropZone({ onCompose }) {
  const tiles = [
    { key: "doodle", label: "Doodle Pad", desc: "Tap, draw, drop. Stays anonymous.", color: "var(--sage)", icon: <Icon.Brush size={20} />, img: PHOTOS.pencils, kicker: "3,420 doodles dropped this term" },
    { key: "poem", label: "Two Lines", desc: "Urdu / English / Roman Urdu — say it small.", color: "var(--butter)", icon: <Icon.Pen size={20} />, img: PHOTOS.notebook, kicker: "a couplet about chai is mandatory" },
    { key: "song", label: "Drop a Song", desc: "10 seconds, played on the kiosk speaker.", color: "var(--rose)", icon: <Icon.Music size={20} />, img: PHOTOS.cassette, kicker: "today's most-dropped: 'Pasoori'" },
    { key: "voice", label: "Voice Note", desc: "A laugh, a thought, a hum — 10 sec max.", color: "var(--plum)", icon: <Icon.Mic size={20} />, img: PHOTOS.hands, kicker: "the wall's quietest section" }
  ];
  return (
    <section id="create" style={{ padding: "120px 0 80px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 50 }}>
          <Reveal>
            <Eyebrow>04 · creative drop zone</Eyebrow>
            <h2 className="serif" style={{ fontSize: "clamp(40px, 6vw, 84px)", lineHeight: 0.98, margin: "14px 0 0", letterSpacing: "-0.02em" }}>
              four soft ways<br />to <em className="serif-i" style={{ color: "var(--accent)" }}>make something.</em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="serif" style={{ fontSize: 18, lineHeight: 1.35, color: "var(--cocoa)", maxWidth: 360, margin: 0 }}>
              Each one finishes in under two minutes. Each one ends up on the wall, anonymously. That's the only rule.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "auto auto", gap: 22 }}>
          {/* Big featured */}
          <Reveal delay={120} className="bezel" style={{ gridRow: "span 2", background: "color-mix(in oklch, var(--sage) 40%, transparent)" }}>
            <div className="bezel-inner doodle-pad" style={{ padding: 26, minHeight: 460, position: "relative" }}>
              <Eyebrow color="var(--sage-deep)">featured · doodle pad</Eyebrow>
              <h3 className="serif" style={{ fontSize: 42, lineHeight: 1, margin: "14px 0 10px", color: "var(--espresso)" }}>draw on a shared canvas.</h3>
              <p className="serif" style={{ fontSize: 16, lineHeight: 1.4, color: "var(--cocoa)", margin: "0 0 22px", maxWidth: 420 }}>
                Open the pad. Pick a brush. Doodle anything — a face, your mood, a stupid shape. It joins everyone else's on the wall.
              </p>

              <svg viewBox="0 0 400 180" style={{ width: "100%", height: "auto", display: "block", maxWidth: 420 }}>
                <path d="M30,120 C 60,40, 110,160, 150,90 S 230,30, 270,110 S 350,140, 380,60" stroke="var(--accent)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M50,150 q 40,-20, 80,0 t 80,0 t 80,0 t 80,0" stroke="var(--espresso)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
                <circle cx="100" cy="60" r="6" fill="var(--butter-deep)" />
                <circle cx="240" cy="50" r="4" fill="var(--sage-deep)" />
                <circle cx="340" cy="100" r="5" fill="var(--rose-deep)" />
              </svg>

              <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
                {["#2A221B", "#C97862", "#A8B89E", "#F3DEA4", "#E8C5B8", "#8A6A8B"].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: 999, background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08), 0 4px 10px -6px rgba(0,0,0,0.3)", cursor: "pointer" }}></div>
                ))}
              </div>
              <button className="pill-btn accent" onClick={onCompose} style={{ position: "absolute", bottom: 26, right: 26 }}>
                <span>open the pad</span>
                <span className="icon-pod"><Icon.ArrowUR size={14} /></span>
              </button>
            </div>
          </Reveal>

          {tiles.slice(1).map((t, i) => (
            <Reveal delay={180 + i * 80} key={t.key}>
              <div className="bezel lift" style={{ background: `color-mix(in oklch, ${t.color} 35%, transparent)`, height: "100%" }}>
                <div className="bezel-inner" style={{ background: `color-mix(in oklch, ${t.color} 10%, var(--paper))`, padding: 22, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ width: 40, height: 40, borderRadius: 999, background: `color-mix(in oklch, ${t.color} 50%, var(--paper))`, color: "var(--espresso)", display: "grid", placeItems: "center" }}>
                        {t.icon}
                      </span>
                      <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mocha)", textTransform: "uppercase" }}>0{i + 2}</span>
                    </div>
                    <h4 className="serif" style={{ fontSize: 30, lineHeight: 1, margin: "4px 0 6px", color: "var(--espresso)" }}>{t.label}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.4, color: "var(--cocoa)", margin: 0 }}>{t.desc}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginTop: 18 }}>
                    <span className="hand" style={{ fontSize: 18, color: "var(--cocoa)", lineHeight: 1.05 }}>{t.kicker}</span>
                    <button className="pill-btn ghost" style={{ padding: "6px 6px 6px 14px", fontSize: 12 }}>
                      <span>start</span>
                      <span className="icon-pod" style={{ width: 24, height: 24 }}><Icon.Arrow size={11} /></span>
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------- DAILY SPARK -------
function DailySpark() {
  return (
    <section style={{ padding: "60px 0 60px" }}>
      <div className="container">
        <Reveal>
          <div className="bezel" style={{ background: "color-mix(in oklch, var(--terra) 40%, transparent)" }}>
            <div className="bezel-inner" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--terra) 18%, var(--paper)) 0%, color-mix(in oklch, var(--butter) 25%, var(--paper)) 100%)", padding: 36 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 30, alignItems: "center" }}>
                <div>
                  <Eyebrow color="var(--terra)">today's daily spark · 22 may</Eyebrow>
                  <h3 className="serif-i" style={{ fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 1, margin: "16px 0 12px", color: "var(--espresso)" }}>
                    "draw what monday<br />feels like — in 30 seconds."
                  </h3>
                  <p className="serif" style={{ fontSize: 16, lineHeight: 1.4, color: "var(--cocoa)", margin: "0 0 22px", maxWidth: 460 }}>
                    One creative prompt a day. Everyone's responses get hung side by side on the wall — a campus art gallery refreshing every 24 hours.
                  </p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <PillBtn variant="accent" icon={<Icon.Brush size={14} />}>start the timer</PillBtn>
                    <span className="mono" style={{ fontSize: 10, color: "var(--mocha)", letterSpacing: "0.14em", textTransform: "uppercase" }}>· 184 responses already ·</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {[PHOTOS.doodle, PHOTOS.paint, PHOTOS.pencils, PHOTOS.notebook, PHOTOS.windowlight, PHOTOS.sketchbook].map((p, i) => (
                    <div key={i} style={{ aspectRatio: "1", borderRadius: 10, overflow: "hidden", transform: `rotate(${(i % 2 ? 1 : -1) * 1.5}deg)`, boxShadow: "0 14px 24px -16px rgba(0,0,0,0.3)" }}>
                      <img src={p} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.85)" }} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------- MOOD MAP -------
function MoodMap() {
  const colors = {
    bored: "var(--sage)", stressed: "var(--rose)", happy: "var(--butter)",
    sad: "var(--sky)", hyped: "var(--terra)", lost: "var(--plum)"
  };
  const counts = MOOD_MAP_SEED.reduce((a, m) => { a[m] = (a[m] || 0) + 1; return a; }, {});
  const total = MOOD_MAP_SEED.length;
  return (
    <section id="map" style={{ padding: "120px 0 80px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 50, alignItems: "center" }}>
          <Reveal>
            <Eyebrow>05 · mood map · live</Eyebrow>
            <h2 className="serif" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.98, margin: "14px 0 16px", letterSpacing: "-0.02em" }}>
              how the campus<br /><em className="serif-i" style={{ color: "var(--accent)" }}>feels</em>, right now.
            </h2>
            <p className="serif" style={{ fontSize: 18, lineHeight: 1.4, color: "var(--cocoa)", margin: "0 0 28px", maxWidth: 460 }}>
              Anonymous mood check-ins, plotted as a soft heatmap of the campus. You see you're not alone in feeling whatever you're feeling.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MOODS.map(m => {
                const c = counts[m.id] || 0;
                const pct = Math.round((c / total) * 100);
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: colors[m.id], boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)" }}></span>
                    <span style={{ fontSize: 14, color: "var(--cocoa)", width: 80, textTransform: "lowercase" }}>{m.label}</span>
                    <div style={{ flex: 1, height: 6, background: "color-mix(in oklch, var(--espresso) 6%, transparent)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: colors[m.id], borderRadius: 99, transition: "width 1s var(--ease-fluid)" }}></div>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: "var(--mocha)", width: 36, textAlign: "right" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <Bezel style={{ background: "color-mix(in oklch, var(--linen) 60%, transparent)" }}>
              <div className="bezel-inner" style={{ padding: 20, background: "var(--paper)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--mocha)", textTransform: "uppercase" }}>nutech main campus · 8×8 zones</span>
                  <span className="stamp">● 247 check-ins · live</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
                  {MOOD_MAP_SEED.map((m, i) => (
                    <div key={i} className="moodmap-cell" style={{
                      background: colors[m],
                      opacity: 0.45 + (((i * 7) % 11) / 22),
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)"
                    }} title={m}></div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--mocha)" }}>← A-block</span>
                  <span className="serif-i" style={{ fontSize: 16, color: "var(--cocoa)" }}>turns out you're really not the only one.</span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--mocha)" }}>D-block →</span>
                </div>
              </div>
            </Bezel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------- GAMES -------
function Games() {
  return (
    <section id="games" style={{ padding: "100px 0 80px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 40 }}>
          <Reveal>
            <Eyebrow>06 · quick quest · games corner</Eyebrow>
            <h2 className="serif" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.98, margin: "14px 0 0", letterSpacing: "-0.02em" }}>
              sixty-second games, for<br /><em className="serif-i" style={{ color: "var(--accent)" }}>the in-between.</em>
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <div className="bezel" style={{ borderRadius: 999, padding: 5 }}>
              <div className="bezel-inner" style={{ padding: "10px 18px", borderRadius: 999, display: "flex", alignItems: "center", gap: 12 }}>
                <Icon.Star size={14} />
                <span className="serif-i" style={{ fontSize: 18, color: "var(--espresso)" }}>your streak:</span>
                <span className="serif" style={{ fontSize: 22, color: "var(--accent)" }}>7 days</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--mocha)", letterSpacing: "0.14em", textTransform: "uppercase" }}>· brush unlocked ·</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
          {GAMES.map((g, i) => (
            <Reveal delay={120 + i * 80} key={g.name}>
              <div className="bezel lift" style={{ background: `color-mix(in oklch, ${g.color} 30%, transparent)` }}>
                <div className="bezel-inner" style={{ padding: 14 }}>
                  <div className="game-cover" style={{ backgroundImage: `url(${g.cover})` }}>
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 50%, color-mix(in oklch, ${g.color} 75%, black) 100%)` }}></div>
                    <span className="stamp" style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.85)", color: "var(--espresso)" }}>{g.tag}</span>
                    <span className="hand" style={{ position: "absolute", bottom: 14, left: 14, fontSize: 28, color: "var(--paper)" }}>{g.name}</span>
                  </div>
                  <div style={{ padding: "14px 8px 6px", display: "flex", justifyContent: "space-between", alignItems: "end", gap: 10 }}>
                    <p className="serif" style={{ fontSize: 14, lineHeight: 1.35, color: "var(--cocoa)", margin: 0, flex: 1 }}>{g.desc}</p>
                    <button className="pill-btn" style={{ padding: "6px 6px 6px 12px", fontSize: 12 }}>
                      <span>play</span>
                      <span className="icon-pod" style={{ width: 24, height: 24 }}><Icon.Play size={11} /></span>
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
            <LeaderCard rank={1} who="Hadia · CS '27" pts="14,820" me={false} />
            <LeaderCard rank={7} who="you" pts="9,140" me={true} />
            <LeaderCard rank={28} who="campus avg" pts="3,210" me={false} sub />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LeaderCard({ rank, who, pts, me, sub }) {
  return (
    <div className="bezel" style={{ background: me ? "color-mix(in oklch, var(--accent) 35%, transparent)" : "color-mix(in oklch, var(--linen) 50%, transparent)" }}>
      <div className="bezel-inner" style={{ padding: 18, background: me ? "color-mix(in oklch, var(--accent) 10%, var(--paper))" : "var(--paper)", display: "flex", alignItems: "center", gap: 16 }}>
        <div className="serif-i" style={{ fontSize: 44, color: me ? "var(--accent)" : "var(--mocha)", lineHeight: 1, width: 60 }}>#{rank}</div>
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 22, color: "var(--espresso)" }}>{who}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--mocha)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>{sub ? "across 2,847 students" : "boredom points · this week"}</div>
        </div>
        <div className="serif" style={{ fontSize: 22, color: me ? "var(--accent)" : "var(--espresso)" }}>{pts}</div>
      </div>
    </div>
  );
}

// ------- FOOTER -------
function Footer() {
  return (
    <footer style={{ padding: "60px 0 80px", position: "relative", zIndex: 1 }}>
      <div className="container">
        <div className="hair" style={{ marginBottom: 40 }}></div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 30 }}>
          <div>
            <div className="serif-i" style={{ fontSize: 48, lineHeight: 0.96, color: "var(--espresso)" }}>vibe wall<span style={{ color: "var(--accent)" }}>.</span></div>
            <p className="serif" style={{ fontSize: 16, color: "var(--cocoa)", lineHeight: 1.35, margin: "10px 0 0", maxWidth: 320 }}>
              A soft place between classes. Built by students, for students, anonymously.
            </p>
          </div>
          <FootCol title="explore" links={["the wall", "mood check-in", "pass it forward", "creative drop", "mood map", "games"]} />
          <FootCol title="the project" links={["how it works", "anonymity & safety", "house rules", "credits"]} />
          <FootCol title="campus" links={["a-block kiosk", "library kiosk", "c-block kiosk", "mobile · scan QR"]} />
        </div>
        <div style={{ marginTop: 50, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--mocha)", textTransform: "uppercase" }}>© 2026 vibe wall · nutech islamabad · final year project</span>
          <span className="hand" style={{ fontSize: 22, color: "var(--cocoa)" }}>made softly, with chai, by anon ♡</span>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }) {
  return (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--mocha)", textTransform: "uppercase", marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map(l => (
          <li key={l}><a href="#" style={{ fontSize: 15, color: "var(--cocoa)", textDecoration: "none", fontFamily: "Instrument Serif", fontSize: 19 }}>{l}</a></li>
        ))}
      </ul>
    </div>
  );
}

// ------- COMPOSE MODAL -------
function ComposeModal({ open, onClose }) {
  const [tab, setTab] = useStateS("doodle");
  const [paths, setPaths] = useStateS([]);
  const [draw, setDraw] = useStateS(false);
  const [color, setColor] = useStateS("var(--accent)");
  const [poem, setPoem] = useStateS(["", ""]);
  const svgRef = useRefS();
  const cur = useRefS("");

  function down(e) { setDraw(true); cur.current = "M" + getXY(e); }
  function move(e) {
    if (!draw) return;
    cur.current += " L" + getXY(e);
    setPaths(p => [...p.slice(0, -1), cur.current]);
    if (paths.length === 0 || paths[paths.length - 1] !== cur.current) setPaths(p => [...p.slice(0, -1), cur.current]);
  }
  function up() { setDraw(false); if (cur.current) setPaths(p => [...p, cur.current]); cur.current = ""; }
  function getXY(e) {
    const r = svgRef.current.getBoundingClientRect();
    const t = e.touches?.[0] || e;
    return (t.clientX - r.left) + "," + (t.clientY - r.top);
  }

  useEffectS(() => {
    function key(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  const tabs = [
    { id: "doodle", l: "Doodle Pad", icon: <Icon.Brush size={14} /> },
    { id: "poem", l: "Two Lines", icon: <Icon.Pen size={14} /> },
    { id: "song", l: "Drop a Song", icon: <Icon.Music size={14} /> },
    { id: "confession", l: "Confession", icon: <Icon.Heart size={14} /> }
  ];

  return (
    <div className={"modal-backdrop " + (open ? "open" : "")} onClick={onClose}>
      <div style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", padding: 30, pointerEvents: open ? "auto" : "none" }}>
        <div className="modal-card bezel" style={{ width: "min(960px, 92vw)", maxHeight: "88vh", overflow: "hidden", background: "color-mix(in oklch, var(--linen) 60%, transparent)" }} onClick={e => e.stopPropagation()}>
          <div className="bezel-inner" style={{ background: "var(--paper)", padding: 0 }}>
            {/* header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px 18px", borderBottom: "1px solid color-mix(in oklch, var(--espresso) 8%, transparent)" }}>
              <div>
                <Eyebrow>compose</Eyebrow>
                <div className="serif-i" style={{ fontSize: 30, color: "var(--espresso)", lineHeight: 1, marginTop: 6 }}>drop something on the wall.</div>
              </div>
              <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 99, border: "none", background: "color-mix(in oklch, var(--espresso) 6%, transparent)", cursor: "pointer", display: "grid", placeItems: "center" }}>
                <Icon.Close size={16} />
              </button>
            </div>

            {/* tabs */}
            <div style={{ display: "flex", gap: 2, padding: "12px 16px 0", borderBottom: "1px solid color-mix(in oklch, var(--espresso) 6%, transparent)" }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 13.5, fontWeight: 500,
                  color: tab === t.id ? "var(--espresso)" : "var(--mocha)",
                  borderBottom: "2px solid " + (tab === t.id ? "var(--accent)" : "transparent"),
                  transition: "all 0.4s var(--ease-fluid)"
                }}>
                  {t.icon}{t.l}
                </button>
              ))}
            </div>

            {/* body */}
            <div style={{ padding: 24, maxHeight: "60vh", overflowY: "auto" }}>
              {tab === "doodle" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mocha)", textTransform: "uppercase" }}>tap and drag to draw · 60 sec</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["var(--espresso)", "var(--accent)", "var(--sage-deep)", "var(--butter-deep)", "var(--rose-deep)", "var(--plum)"].map(c => (
                        <button key={c} onClick={() => setColor(c)} style={{
                          width: 26, height: 26, borderRadius: 99, background: c, border: "none", cursor: "pointer",
                          boxShadow: color === c ? "0 0 0 2px var(--paper), 0 0 0 4px var(--espresso)" : "0 0 0 1px rgba(0,0,0,0.1)"
                        }}></button>
                      ))}
                      <button onClick={() => setPaths([])} style={{ padding: "0 12px", borderRadius: 99, border: "none", background: "color-mix(in oklch, var(--espresso) 6%, transparent)", cursor: "pointer", fontSize: 12, color: "var(--cocoa)" }}>clear</button>
                    </div>
                  </div>
                  <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid color-mix(in oklch, var(--espresso) 10%, transparent)" }}>
                    <svg ref={svgRef}
                      onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
                      onTouchStart={down} onTouchMove={move} onTouchEnd={up}
                      viewBox="0 0 800 380" preserveAspectRatio="xMidYMid meet"
                      className="doodle-pad"
                      style={{ width: "100%", height: 380, display: "block", touchAction: "none", cursor: "crosshair" }}>
                      {paths.map((d, i) => <path key={i} d={d} stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
                    </svg>
                  </div>
                </div>
              )}
              {tab === "poem" && (
                <div style={{ background: "color-mix(in oklch, var(--butter) 14%, var(--paper))", padding: 28, borderRadius: 16, border: "1px solid color-mix(in oklch, var(--butter-deep) 35%, transparent)" }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mocha)", textTransform: "uppercase" }}>two lines · any language · 90 chars each</span>
                  <input value={poem[0]} onChange={e => setPoem([e.target.value, poem[1]])} maxLength={90} placeholder="first line…" style={{
                    width: "100%", padding: "14px 0 8px", border: "none", borderBottom: "1px dashed color-mix(in oklch, var(--espresso) 18%, transparent)",
                    background: "transparent", fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 32, outline: "none", color: "var(--espresso)"
                  }} />
                  <input value={poem[1]} onChange={e => setPoem([poem[0], e.target.value])} maxLength={90} placeholder="…and the second." style={{
                    width: "100%", padding: "12px 0", marginTop: 6, border: "none",
                    background: "transparent", fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 32, outline: "none", color: "var(--espresso)"
                  }} />
                </div>
              )}
              {tab === "song" && (
                <div>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mocha)", textTransform: "uppercase" }}>paste a link or search · plays on kiosk speakers</span>
                  <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 14, background: "color-mix(in oklch, var(--rose) 14%, var(--paper))", border: "1px solid color-mix(in oklch, var(--rose-deep) 30%, transparent)", display: "flex", alignItems: "center", gap: 14 }}>
                    <Icon.Music size={20} />
                    <input placeholder="spotify / youtube link or song name…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "inherit", fontSize: 17, color: "var(--espresso)" }} />
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mocha)", textTransform: "uppercase" }}>· trending on campus today ·</span>
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {[{ t: "Pasoori", a: "Ali Sethi · Shae Gill" }, { t: "Tum Hi Aana", a: "Jubin Nautiyal" }, { t: "Aaj Jaane Ki Zid", a: "Farida Khanum" }].map(s => (
                        <button key={s.t} style={{ padding: "12px 14px", borderRadius: 12, background: "color-mix(in oklch, var(--espresso) 5%, transparent)", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                          <div className="serif" style={{ fontSize: 17, color: "var(--espresso)" }}>{s.t}</div>
                          <div className="mono" style={{ fontSize: 10, color: "var(--mocha)", marginTop: 2 }}>{s.a}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {tab === "confession" && (
                <div style={{ background: "color-mix(in oklch, var(--rose) 12%, var(--paper))", padding: 28, borderRadius: 16, border: "1px solid color-mix(in oklch, var(--rose-deep) 30%, transparent)" }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mocha)", textTransform: "uppercase" }}>180 characters · totally anonymous · no logins</span>
                  <textarea placeholder="i…" maxLength={180} rows={4} style={{
                    width: "100%", marginTop: 12, padding: 0, border: "none",
                    background: "transparent", fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 28, outline: "none", color: "var(--espresso)", resize: "none", lineHeight: 1.2
                  }} />
                </div>
              )}
            </div>

            {/* footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: "1px solid color-mix(in oklch, var(--espresso) 8%, transparent)", background: "color-mix(in oklch, var(--cream-deep) 22%, var(--paper))" }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--mocha)", letterSpacing: "0.14em", textTransform: "uppercase" }}>· no names attached, ever ·</span>
              <div style={{ display: "flex", gap: 8 }}>
                <PillBtn variant="ghost" onClick={onClose} icon={<Icon.Close size={12} />}>cancel</PillBtn>
                <PillBtn variant="accent" onClick={onClose} icon={<Icon.ArrowUR size={14} />}>drop it on the wall</PillBtn>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  FloatingNav, Hero, ConfessionTicker, MoodCheckIn, VibeWall,
  PassForward, CreativeDropZone, DailySpark, MoodMap, Games, Footer, ComposeModal
});
