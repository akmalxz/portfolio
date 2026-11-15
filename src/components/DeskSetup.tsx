import type { CSSProperties } from 'react';
import type { ProfileData } from '../data/profile';
import { IsoBox } from './IsoBox';

interface DeskSetupProps {
  profile: ProfileData;
  isHovered: boolean;
  isZoneHighlighted: boolean;
  onHoverChange: (hovered: boolean) => void;
  onOpenPc: () => void;
}

export function DeskSetup({
  profile,
  isHovered,
  isZoneHighlighted,
  onHoverChange,
  onOpenPc,
}: DeskSetupProps) {
  const monitorVars = {
    '--x': '66px',
    '--y': '22px',
    '--z': '74px',
    '--w': '92px',
    '--d': '8px',
    '--h': '56px',
  } as CSSProperties;

  return (
    <>
      {/* Floor contact shadows under desk & chair */}
      <div className="shadow-patch shadow-desk" aria-hidden="true" />
      <div className="shadow-patch shadow-chair" aria-hidden="true" />

      {/* Desk legs */}
      <IsoBox x={28} y={14} z={0} w={10} d={10} h={64} className="box-desk-leg" />
      <IsoBox x={178} y={14} z={0} w={10} d={10} h={64} className="box-desk-leg" />
      <IsoBox x={28} y={78} z={0} w={10} d={10} h={64} className="box-desk-leg" />
      <IsoBox x={178} y={78} z={0} w={10} d={10} h={64} className="box-desk-leg" />

      {/* Desk drawer pedestal on left */}
      <IsoBox x={28} y={20} z={8} w={40} d={64} h={56} className="box-desk-drawer" />

      {/* Desk tabletop */}
      <IsoBox x={22} y={8} z={64} w={172} d={84} h={10} className="box-desk-top" />

      {/* Desk mat + keyboard + mouse */}
      <IsoBox x={64} y={44} z={74} w={96} d={38} h={2} className="box-desk-mat" />
      <IsoBox x={74} y={54} z={76} w={54} d={18} h={3} className="box-keyboard" />
      <IsoBox x={138} y={58} z={76} w={12} d={16} h={3} className="box-mouse" />

      {/* Desk lamp + mug */}
      <IsoBox x={36} y={22} z={74} w={18} d={18} h={4} className="box-lamp-base" />
      <IsoBox x={42} y={28} z={78} w={5} d={5} h={28} className="box-lamp-arm" />
      <IsoBox x={38} y={26} z={104} w={18} d={16} h={10} className="box-lamp-shade" />
      <IsoBox x={166} y={56} z={74} w={12} d={12} h={14} className="box-mug" />

      {/* Monitor stand */}
      <IsoBox x={96} y={32} z={74} w={32} d={20} h={3} className="box-monitor-stand" />
      <IsoBox x={107} y={26} z={77} w={10} d={8} h={14} className="box-monitor-neck" />

      {/* Clickable 3D PC Monitor */}
      <button
        type="button"
        className={`iso-box iso-pc-button ${isHovered || isZoneHighlighted ? 'is-active' : ''}`}
        style={monitorVars}
        aria-label={`Open About & Technical Skills for ${profile.shortName}`}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        onClick={onOpenPc}
      >
        <span className="iso-face iso-face-top" />
        <span className="iso-face iso-face-front iso-pc-screen-face">
          <span className="iso-pc-screen">
            <span className="iso-pc-bar">skills.py</span>
            <span className="iso-pc-name">{profile.shortName}</span>
            <span className="iso-pc-cta">ETL · AI · React →</span>
          </span>
        </span>
        <span className="iso-face iso-face-left" />
      </button>

      {/* Headphones resting on top-right corner of monitor */}
      <IsoBox x={144} y={20} z={118} w={10} d={12} h={14} className="box-headphones" />

      {/* Office chair tucked in front of desk */}
      <IsoBox x={98} y={118} z={0} w={36} d={36} h={4} className="box-chair-base" />
      <IsoBox x={112} y={132} z={4} w={8} d={8} h={26} className="box-chair-post" />
      <IsoBox x={94} y={114} z={30} w={44} d={42} h={7} className="box-chair-seat" />
      <IsoBox x={90} y={118} z={37} w={5} d={28} h={14} className="box-chair-arm" />
      <IsoBox x={137} y={118} z={37} w={5} d={28} h={14} className="box-chair-arm" />
      <IsoBox x={96} y={148} z={37} w={40} d={8} h={40} className="box-chair-back" />
    </>
  );
}
