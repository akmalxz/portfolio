import type { CSSProperties } from 'react';
import type { ProfileData } from '../data/profile';
import type { BookEntry } from '../types/library';
import { IsoBox } from './IsoBox';

interface DeskSetupProps {
  profile: ProfileData;
  isHovered: boolean;
  isZoneHighlighted: boolean;
  previewBook?: BookEntry | null;
  onHoverChange: (hovered: boolean) => void;
  onOpenPc: () => void;
}

export function DeskSetup({
  profile,
  isHovered,
  isZoneHighlighted,
  previewBook = null,
  onHoverChange,
  onOpenPc,
}: DeskSetupProps) {
  const monitorVars = {
    '--x': '66px',
    '--y': '22px',
    '--z': '82px',
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
      <IsoBox x={28} y={14} z={1} w={10} d={10} h={61} className="box-desk-leg" />
      <IsoBox x={178} y={14} z={1} w={10} d={10} h={61} className="box-desk-leg" />
      <IsoBox x={28} y={78} z={1} w={10} d={10} h={61} className="box-desk-leg" />
      <IsoBox x={178} y={78} z={1} w={10} d={10} h={61} className="box-desk-leg" />

      {/* Desk drawer pedestal on left */}
      <IsoBox x={28} y={20} z={8} w={40} d={64} h={54} className="box-desk-drawer" />

      {/* Desk tabletop (top face at z = 74) */}
      <IsoBox x={22} y={8} z={64} w={172} d={84} h={10} className="box-desk-top" />

      {/* Desk mat + keyboard + mouse (stepped z = 76 and z = 81 to avoid coplanar Z-fighting) */}
      <IsoBox x={64} y={44} z={76} w={96} d={36} h={3} className="box-desk-mat" />
      <IsoBox x={74} y={53} z={81} w={54} d={18} h={4} className="box-keyboard" />
      <IsoBox x={138} y={56} z={81} w={12} d={16} h={4} className="box-mouse" />

      {/* Secondary Vertical Terminal Monitor on left of desk */}
      <IsoBox x={34} y={22} z={76} w={18} d={14} h={3} className="box-monitor-stand" />
      <IsoBox
        x={30}
        y={20}
        z={80}
        w={26}
        d={6}
        h={44}
        className="box-side-monitor"
        frontContent={
          <div className="side-monitor-screen">
            <span className="side-log-line is-cyan" />
            <span className="side-log-line is-emerald" />
            <span className="side-log-line" />
            <span className="side-log-line is-cyan" />
          </div>
        }
      />
      <IsoBox x={166} y={56} z={76} w={12} d={12} h={14} className="box-mug" />

      {/* Monitor stand (y: 18..38, disjoint from desk mat at y: 44..80) */}
      <IsoBox x={96} y={18} z={76} w={32} d={20} h={4} className="box-monitor-stand" />
      <IsoBox x={107} y={16} z={81} w={10} d={5} h={18} className="box-monitor-neck" />

      {/* Clickable 3D PC Monitor */}
      <button
        type="button"
        className={`iso-box iso-pc-button ${
          isHovered || isZoneHighlighted ? 'is-active' : ''
        } ${previewBook ? 'is-previewing' : ''}`}
        data-preview-tone={previewBook?.tone}
        style={monitorVars}
        aria-label={`Open Work Experience for ${profile.shortName}`}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        onClick={onOpenPc}
      >
        <span className="iso-face iso-face-top" />
        <span className="iso-face iso-face-front iso-pc-screen-face">
          <span className="iso-pc-screen">
            <span className="iso-pc-bar">
              {previewBook ? previewBook.callNumber : 'dagster_etl.py'}
            </span>
            <span className="iso-pc-name">
              {previewBook ? previewBook.spineTitle : profile.shortName}
            </span>
            <span className="iso-pc-cta">
              {previewBook
                ? previewBook.metrics?.[0]
                  ? `${previewBook.metrics[0].value} ${previewBook.metrics[0].label}`
                  : previewBook.period
                : '22M PGSQL · RAG →'}
            </span>
          </span>
        </span>
        <span className="iso-face iso-face-left" />
      </button>

      {/* Headphones resting on top-right corner of monitor */}
      <IsoBox x={144} y={20} z={140} w={10} d={12} h={10} className="box-headphones" />

      {/* Office chair tucked in front of desk */}
      <IsoBox x={98} y={118} z={1} w={36} d={36} h={4} className="box-chair-base" />
      <IsoBox x={112} y={132} z={6} w={8} d={8} h={22} className="box-chair-post" />
      <IsoBox x={94} y={114} z={30} w={44} d={42} h={7} className="box-chair-seat" />
      <IsoBox x={90} y={118} z={37} w={5} d={28} h={14} className="box-chair-arm" />
      <IsoBox x={137} y={118} z={37} w={5} d={28} h={14} className="box-chair-arm" />
      <IsoBox x={96} y={148} z={37} w={40} d={8} h={40} className="box-chair-back" />
    </>
  );
}
