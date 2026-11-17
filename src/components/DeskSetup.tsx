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
  const leftMonitorVars = {
    '--x': '33px',
    '--y': '20px',
    '--z': '82px',
    '--w': '74px',
    '--d': '7px',
    '--h': '52px',
  } as CSSProperties;

  const rightMonitorVars = {
    '--x': '109px',
    '--y': '20px',
    '--z': '82px',
    '--w': '74px',
    '--d': '7px',
    '--h': '52px',
  } as CSSProperties;

  const isPcActive = isHovered || isZoneHighlighted;

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

      {/* Desk mat + centered keyboard */}
      <IsoBox x={64} y={44} z={76} w={96} d={36} h={3} className="box-desk-mat" />
      <IsoBox x={85} y={53} z={81} w={54} d={18} h={4} className="box-keyboard" />

      {/* Left Monitor Stand & Neck */}
      <IsoBox x={58} y={24} z={76} w={26} d={16} h={3} className="box-monitor-stand" />
      <IsoBox x={67} y={23} z={79} w={8} d={5} h={16} className="box-monitor-neck" />

      {/* Right Monitor Stand & Neck */}
      <IsoBox x={132} y={24} z={76} w={26} d={16} h={3} className="box-monitor-stand" />
      <IsoBox x={141} y={23} z={79} w={8} d={5} h={16} className="box-monitor-neck" />

      {/* Left Angled Primary Monitor */}
      <button
        type="button"
        className={`iso-box iso-pc-button iso-pc-left ${
          isPcActive ? 'is-active' : ''
        } ${previewBook ? 'is-previewing' : ''}`}
        data-preview-tone={previewBook?.tone}
        style={leftMonitorVars}
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

      {/* Right Angled Companion Monitor */}
      <button
        type="button"
        className={`iso-box iso-pc-button iso-pc-right ${
          isPcActive ? 'is-active' : ''
        }`}
        style={rightMonitorVars}
        aria-label={`Open Work Experience for ${profile.shortName}`}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        onClick={onOpenPc}
      >
        <span className="iso-face iso-face-top" />
        <span className="iso-face iso-face-front iso-pc-screen-face">
          <span className="iso-pc-screen iso-pc-screen-telemetry">
            <span className="iso-pc-bar">cluster_metrics</span>
            <span className="side-mini-bars is-dual-bars" aria-hidden="true">
              <span className="side-bar" style={{ height: '42%' }} />
              <span className="side-bar is-cyan" style={{ height: '76%' }} />
              <span className="side-bar is-emerald" style={{ height: '58%' }} />
              <span className="side-bar is-cyan" style={{ height: '92%' }} />
              <span className="side-bar is-emerald" style={{ height: '84%' }} />
            </span>
            <span className="side-log-line is-cyan" />
          </span>
        </span>
        <span className="iso-face iso-face-left" />
      </button>

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
