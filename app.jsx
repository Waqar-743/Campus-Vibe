// ----- Main app -----
const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHex": "#c97862",
  "accentSoftHex": "#e8c5b8",
  "grain": 0.05,
  "moodDrivesAccent": true
}/*EDITMODE-END*/;

// Palette pairs: [accent, soft]
const ACCENT_PAIRS = [
  ["#c97862", "#e8c5b8"], // terra + rose
  ["#7e9078", "#a8b89e"], // sage
  ["#d9bf6c", "#f3dea4"], // butter
  ["#8a6a8b", "#c5a8c6"]  // plum
];

const MOOD_TO_PAIR = {
  bored:    ["#7e9078", "#a8b89e"],
  stressed: ["#c97862", "#e8c5b8"],
  happy:    ["#d9bf6c", "#f3dea4"],
  sad:      ["#7a92b0", "#b8c8d8"],
  hyped:    ["#c97862", "#e8c5b8"],
  lost:     ["#8a6a8b", "#c5a8c6"]
};

function App() {
  const [mood, setMood] = useStateA("bored");
  const [composeOpen, setCompose] = useStateA(false);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks when mood is NOT driving accent
  useEffectA(() => {
    if (!tweaks.moodDrivesAccent) {
      document.documentElement.style.setProperty("--accent", tweaks.accentHex);
      document.documentElement.style.setProperty("--accent-soft", tweaks.accentSoftHex);
    }
    document.documentElement.style.setProperty("--grain-opacity", String(tweaks.grain));
  }, [tweaks.accentHex, tweaks.accentSoftHex, tweaks.grain, tweaks.moodDrivesAccent]);

  // Mood drives accent live
  useEffectA(() => {
    if (tweaks.moodDrivesAccent) {
      const pair = MOOD_TO_PAIR[mood] || MOOD_TO_PAIR.bored;
      document.documentElement.style.setProperty("--accent", pair[0]);
      document.documentElement.style.setProperty("--accent-soft", pair[1]);
    }
  }, [mood, tweaks.moodDrivesAccent]);

  return (
    <>
      <FloatingNav onCompose={() => setCompose(true)} currentMood={mood} />
      <Hero onCompose={() => setCompose(true)} mood={mood} />
      <ConfessionTicker />
      <VibeWall />
      <MoodCheckIn mood={mood} setMood={setMood} />
      <PassForward />
      <CreativeDropZone onCompose={() => setCompose(true)} />
      <DailySpark />
      <MoodMap />
      <Games />
      <Footer />
      <ComposeModal open={composeOpen} onClose={() => setCompose(false)} />

      <TweaksPanel title="Vibe tweaks">
        <TweakSection label="Accent palette" />
        <TweakColor
          label="Page accent"
          value={[tweaks.accentHex, tweaks.accentSoftHex]}
          options={ACCENT_PAIRS}
          onChange={(pair) => setTweak({ accentHex: pair[0], accentSoftHex: pair[1] })}
        />
        <TweakToggle
          label="Mood drives accent"
          value={tweaks.moodDrivesAccent}
          onChange={(v) => setTweak({ moodDrivesAccent: v })}
        />
        <TweakSection label="Paper texture" />
        <TweakSlider
          label="Grain"
          value={tweaks.grain}
          min={0}
          max={0.18}
          step={0.01}
          onChange={(v) => setTweak({ grain: v })}
        />
        <TweakSection label="Try a mood" />
        <TweakSelect
          label="Current feeling"
          value={mood}
          options={MOODS.map(m => ({ value: m.id, label: m.label }))}
          onChange={setMood}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
