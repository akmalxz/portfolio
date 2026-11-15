export function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      {/* Slow-drifting atmospheric color orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />

      {/* Subtle blueprint/isometric architectural grid */}
      <div className="ambient-grid" />

      {/* Gentle floating dust motes / starlight particles */}
      <span className="ambient-mote mote-1" />
      <span className="ambient-mote mote-2" />
      <span className="ambient-mote mote-3" />
      <span className="ambient-mote mote-4" />
      <span className="ambient-mote mote-5" />
      <span className="ambient-mote mote-6" />
    </div>
  );
}
