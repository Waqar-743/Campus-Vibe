// ----- Reusable components -----
const { useState, useEffect, useRef, useMemo } = React;

// Pill button with nested icon-pod (Button-in-Button)
function PillBtn({ children, icon, onClick, variant = "primary", as = "button", href, style }) {
  const cls = ["pill-btn"];
  if (variant === "ghost") cls.push("ghost");
  if (variant === "accent") cls.push("accent");
  const inner = (
    <>
      <span>{children}</span>
      <span className="icon-pod">{icon || <Icon.Arrow size={14} />}</span>
    </>
  );
  if (as === "a") return <a className={cls.join(" ")} href={href} style={style}>{inner}</a>;
  return <button className={cls.join(" ")} onClick={onClick} style={style}>{inner}</button>;
}

// Eyebrow tag
function Eyebrow({ children, color }) {
  return (
    <span className="eyebrow">
      <span className="dot" style={color ? { background: color } : undefined}></span>
      {children}
    </span>
  );
}

// Double-bezel wrapper
function Bezel({ children, style, innerStyle, className = "", innerClassName = "", as = "div", onClick }) {
  const Tag = as;
  return (
    <Tag className={"bezel " + className} style={style} onClick={onClick}>
      <div className={"bezel-inner " + innerClassName} style={innerStyle}>{children}</div>
    </Tag>
  );
}

// Reveal-on-scroll wrapper
function Reveal({ children, delay = 0, as = "div", className = "", style }) {
  const ref = useRef();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          obs.disconnect();
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  const Tag = as;
  return <Tag ref={ref} className={"reveal " + (shown ? "in " : "") + className} style={style}>{children}</Tag>;
}

// ----- Wall card variants -----

function Polaroid({ img, cap, tilt = 0, style }) {
  return (
    <div className="polaroid lift" style={{ transform: `rotate(${tilt}deg)`, position: "relative", ...style }}>
      <img src={img} alt={cap} loading="lazy" />
      <div className="cap">{cap}</div>
    </div>
  );
}

function ConfessionCard({ text, who }) {
  return (
    <Bezel className="lift" style={{ background: "color-mix(in oklch, var(--rose) 30%, transparent)" }}>
      <div style={{ padding: "22px 22px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--cocoa)", textTransform: "uppercase" }}>· confession ·</span>
          <span className="mono" style={{ fontSize: 10, color: "var(--mocha)" }}>{who}</span>
        </div>
        <p className="serif-i" style={{ fontSize: 24, lineHeight: 1.18, margin: 0, color: "var(--espresso)", textWrap: "pretty" }}>
          "{text}"
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
          <Icon.Heart size={14} />
          <span className="mono" style={{ fontSize: 11, color: "var(--mocha)" }}>23 felt this</span>
        </div>
      </div>
    </Bezel>
  );
}

function PoemCard({ lines, who }) {
  return (
    <Bezel className="lift" style={{ background: "color-mix(in oklch, var(--butter) 30%, transparent)" }} innerStyle={{ background: "color-mix(in oklch, var(--butter) 12%, var(--paper))" }}>
      <div style={{ padding: "26px 24px" }}>
        <Eyebrow color="var(--butter-deep)">two lines</Eyebrow>
        <div className="serif-i" style={{ fontSize: 28, lineHeight: 1.18, marginTop: 16, color: "var(--espresso)" }}>
          {lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <div className="mono" style={{ marginTop: 16, fontSize: 11, color: "var(--mocha)" }}>— {who}</div>
      </div>
    </Bezel>
  );
}

function SongCard({ title, artist, color, art }) {
  return (
    <Bezel className="lift" style={{ background: `color-mix(in oklch, ${color} 25%, transparent)` }}>
      <div style={{ padding: 14 }}>
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "1" }}>
          <img src={art} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, transparent 50%, color-mix(in oklch, ${color} 70%, black) 100%)`
          }}></div>
          <button style={{
            position: "absolute", right: 12, bottom: 12,
            width: 40, height: 40, borderRadius: 999,
            background: "var(--paper)", border: "none", cursor: "pointer",
            display: "grid", placeItems: "center",
            boxShadow: "0 8px 20px -8px rgba(0,0,0,0.35)"
          }}>
            <Icon.Play size={16} />
          </button>
          <span className="stamp" style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.85)", color: "var(--espresso)" }}>
            ♪ song rec
          </span>
        </div>
        <div style={{ padding: "14px 6px 6px" }}>
          <div className="serif" style={{ fontSize: 22, lineHeight: 1.05, color: "var(--espresso)" }}>{title}</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--mocha)", marginTop: 4, letterSpacing: "0.08em" }}>{artist}</div>
        </div>
      </div>
    </Bezel>
  );
}

function DoodleCard({ img, label, who, tilt = 0 }) {
  return (
    <div style={{ position: "relative", transform: `rotate(${tilt}deg)` }}>
      <div className="tape"></div>
      <Bezel className="lift" style={{ background: "color-mix(in oklch, var(--sage) 25%, transparent)" }}>
        <div style={{ padding: 12 }}>
          <div style={{ aspectRatio: "4/5", borderRadius: 10, overflow: "hidden" }}>
            <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.85)" }} loading="lazy" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 8px 4px" }}>
            <span className="hand" style={{ fontSize: 22, color: "var(--cocoa)" }}>{label}</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--mocha)" }}>{who}</span>
          </div>
        </div>
      </Bezel>
    </div>
  );
}

function PhotoCard({ img, cap, who, tilt = 0 }) {
  return (
    <div style={{ transform: `rotate(${tilt}deg)` }}>
      <Polaroid img={img} cap={cap} />
      <div className="mono" style={{ fontSize: 10, color: "var(--mocha)", marginTop: 6, paddingLeft: 14, letterSpacing: "0.12em" }}>
        ◌ {who}
      </div>
    </div>
  );
}

function NoteCard({ text, who }) {
  return (
    <Bezel className="lift" style={{ background: "color-mix(in oklch, var(--sage) 30%, transparent)" }}
      innerStyle={{ background: "color-mix(in oklch, var(--sage) 14%, var(--paper))" }}>
      <div style={{ padding: "22px 22px 20px", position: "relative" }}>
        <span className="stamp" style={{ background: "color-mix(in oklch, var(--sage-deep) 25%, transparent)", color: "var(--sage-deep)" }}>
          ✉ passed forward
        </span>
        <p className="serif-i" style={{ fontSize: 26, lineHeight: 1.18, margin: "16px 0 8px", color: "var(--espresso)", textWrap: "pretty" }}>
          {text}
        </p>
        <div className="mono" style={{ fontSize: 10, color: "var(--sage-deep)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{who}</div>
      </div>
    </Bezel>
  );
}

function WallItem({ item }) {
  switch (item.kind) {
    case "photo": return <PhotoCard {...item} />;
    case "confession": return <ConfessionCard {...item} />;
    case "song": return <SongCard {...item} />;
    case "doodle": return <DoodleCard {...item} />;
    case "poem": return <PoemCard {...item} />;
    case "note": return <NoteCard {...item} />;
    default: return null;
  }
}

Object.assign(window, {
  PillBtn, Eyebrow, Bezel, Reveal,
  Polaroid, ConfessionCard, PoemCard, SongCard, DoodleCard, PhotoCard, NoteCard, WallItem
});
