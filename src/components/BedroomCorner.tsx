import { useState, type MouseEvent } from 'react';
import type { ProfileData } from '../data/profile';
import type { BookEntry } from '../types/library';
import { DeskSetup } from './DeskSetup';
import { IsoBox } from './IsoBox';
import type { RoomSectionTab } from './PcModal';
import { RoomCharacter, type WalkTarget } from './RoomCharacter';

function clampToWalkableFloor(rawX: number, rawY: number) {
  let x = Math.max(28, Math.min(512, Math.round(rawX)));
  let y = Math.max(28, Math.min(352, Math.round(rawY)));

  // Nudge clear of Desk + Chair zone (x: 0..205, y: 0..115)
  if (x < 205 && y < 115) {
    y = 124;
  }
  // Nudge clear of Edge NAS server box (x: 210..290, y: 0..72)
  if (x >= 210 && x <= 290 && y < 72) {
    y = 78;
  }
  // Nudge clear of Rectangular Holotable (x: 114..272, y: 218..308)
  if (x >= 114 && x <= 272 && y >= 218 && y <= 308) {
    const distRight = Math.abs(276 - x);
    const distTop = Math.abs(y - 212);
    const distBot = Math.abs(314 - y);
    if (distRight <= distTop && distRight <= distBot) {
      x = 278;
    } else if (distTop <= distBot) {
      y = 210;
    } else {
      y = 316;
    }
  }
  // Nudge clear of Server Plinth along back-right wall (x >= 440, y >= 44)
  if (x >= 440 && y >= 44) {
    x = 434;
  }

  return { x, y };
}

interface BedroomCornerProps {
  profile: ProfileData;
  books: BookEntry[];
  onSelectBook: (book: BookEntry) => void;
  onOpenSection: (tab: RoomSectionTab) => void;
}

type CalloutKey =
  | 'projects'
  | 'experience'
  | 'skills'
  | 'education'
  | 'publications'
  | 'contact';

export function BedroomCorner({
  profile,
  books,
  onSelectBook,
  onOpenSection,
}: BedroomCornerProps) {
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [hoveredPc, setHoveredPc] = useState(false);
  const [hoveredCallout, setHoveredCallout] = useState<CalloutKey | null>(null);
  const [walkTarget, setWalkTarget] = useState<WalkTarget | null>(null);

  const handleFloorClick = (event: MouseEvent<HTMLDivElement>) => {
    const { x, y } = clampToWalkableFloor(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );
    setWalkTarget((prev) => ({ x, y, seq: (prev?.seq ?? 0) + 1 }));
  };

  const projectBooks = books.filter((b) => b.category === 'project');
  const experienceBooks = books.filter((b) => b.category === 'experience');

  const hoveredBook = books.find((b) => b.id === hoveredBookId);
  const isProjectsActive =
    hoveredCallout === 'projects' || hoveredBook?.category === 'project';
  const isExperienceActive =
    hoveredCallout === 'experience' || hoveredBook?.category === 'experience';
  const isSkillsActive = hoveredCallout === 'skills' || hoveredPc;
  const isEducationActive = hoveredCallout === 'education';
  const isPublicationsActive = hoveredCallout === 'publications';
  const isContactActive = hoveredCallout === 'contact';

  const handleBookFocus = (book: BookEntry) => {
    setHoveredBookId(book.id);
    setHoveredPc(false);
  };

  return (
    <div className="iso-stage">
      {/* Full-Width 3D Isometric Bedroom Viewport */}
      <div className="iso-camera-viewport">
        <div className="iso-camera">
          {/* SVG Leader Lines & Anchor Target Dots Layer */}
          <svg
            className="iso-callout-svg"
            viewBox="0 0 820 570"
            aria-hidden="true"
          >
            {/* 1. Projects Leader Line */}
            <g className={`callout-branch ${isProjectsActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="344,119 310,48 272,48"
              />
              <circle className="callout-target-ring" cx="344" cy="119" r="7" />
              <circle className="callout-target-dot pin-dot-cobalt" cx="344" cy="119" r="3.5" />
            </g>

            {/* 2. Experience Leader Line */}
            <g className={`callout-branch ${isExperienceActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="325,188 235,126 196,126"
              />
              <circle className="callout-target-ring" cx="325" cy="188" r="7" />
              <circle className="callout-target-dot pin-dot-teal" cx="325" cy="188" r="3.5" />
            </g>

            {/* 3. Technical Skills Leader Line (routed below desk so callout never blocks PC) */}
            <g className={`callout-branch ${isSkillsActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="142,352 112,424 112,432"
              />
              <circle className="callout-target-ring" cx="142" cy="352" r="7" />
              <circle className="callout-target-dot pin-dot-sky" cx="142" cy="352" r="3.5" />
            </g>

            {/* 4. Education Leader Line (points to Rack 3: UITM · MSC IT) */}
            <g className={`callout-branch ${isEducationActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="475,163 560,62 644,62"
              />
              <circle className="callout-target-ring" cx="475" cy="163" r="7" />
              <circle className="callout-target-dot pin-dot-indigo" cx="475" cy="163" r="3.5" />
            </g>

            {/* 5. Contact Leader Line (points to Rack 2: 32B LLM · RAG) */}
            <g className={`callout-branch ${isContactActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="605,294 625,286 646,286"
              />
              <circle className="callout-target-ring" cx="605" cy="294" r="7" />
              <circle className="callout-target-dot pin-dot-mint" cx="605" cy="294" r="3.5" />
            </g>

            {/* 6. Publications Leader Line */}
            <g className={`callout-branch ${isPublicationsActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="376,401 368,510 350,510"
              />
              <circle className="callout-target-ring" cx="376" cy="401" r="7" />
              <circle className="callout-target-dot pin-dot-violet" cx="376" cy="401" r="3.5" />
            </g>
          </svg>

          {/* 3D Isometric World */}
          <div className="iso-world">
            {/* 3D Isometric Rectangular Floor Slab (540 x 380) */}
            <IsoBox
              x={0}
              y={0}
              z={-16}
              w={540}
              d={380}
              h={16}
              className="box-floor-slab"
            />
            {/* Clickable Floor Plane for Click-to-Move Character */}
            <div
              className="iso-floor-clickplane"
              onClick={handleFloorClick}
              aria-hidden="true"
            />
            {walkTarget && (
              <div
                key={walkTarget.seq}
                className="walk-target-ring"
                style={{ left: `${walkTarget.x}px`, top: `${walkTarget.y}px` }}
                aria-hidden="true"
              />
            )}

            {/* Solid 3D Extruded Cutaway Wall Slabs (14px thick) */}
            <IsoBox
              x={0}
              y={-14}
              z={-16}
              w={540}
              d={14}
              h={252}
              className="box-wall-slab"
            />
            <IsoBox
              x={540}
              y={-14}
              z={-16}
              w={14}
              d={394}
              h={252}
              className="box-wall-slab"
            />

            {/* Back-Left Wall Inner Surface */}
            <div className="iso-wall iso-wall-back-left" aria-hidden="true">
              <div className="wall-string-lights">
                <span className="string-bulb" />
                <span className="string-bulb" />
                <span className="string-bulb" />
                <span className="string-bulb" />
                <span className="string-bulb" />
                <span className="string-bulb" />
                <span className="string-bulb" />
              </div>
            </div>

            {/* Back-Right Wall Inner Surface */}
            <div className="iso-wall iso-wall-back-right" aria-hidden="true">
              <div className="iso-poster" />
            </div>

            {/* Ambient Floor Contact Shadows */}
            <div className="shadow-patch shadow-nightstand" aria-hidden="true" />
            <div className="shadow-patch shadow-bed" aria-hidden="true" />
            <div className="shadow-patch shadow-rug" aria-hidden="true" />

            {/* Center Anti-Static Grid Mat + Rectangular 3D Data Pipeline Holotable */}
            <div className="iso-lab-mat" aria-hidden="true" />
            <IsoBox x={152} y={248} z={3} w={84} d={32} h={31} className="box-holo-pedestal" />
            <IsoBox x={126} y={230} z={36} w={136} d={68} h={8} className="box-holo-table" />
            <IsoBox
              x={132}
              y={236}
              z={45}
              w={124}
              d={56}
              h={2}
              className="box-holo-surface"
              topContent={
                <div className="holo-pipeline-board" aria-hidden="true">
                  <span className="holo-grid-overlay" />
                  {/* Glowing Pipeline Tracks & Animated Moving Data Dots */}
                  <div className="holo-track holo-track-main">
                    <span className="holo-data-dot" />
                    <span className="holo-data-dot is-delayed" />
                  </div>
                  <div className="holo-track holo-track-branch-top">
                    <span className="holo-data-dot is-emerald" />
                  </div>
                  <div className="holo-track holo-track-branch-bot">
                    <span className="holo-data-dot is-emerald is-delayed" />
                  </div>
                </div>
              }
            />

            {/* 3D Holographic Miniature Data Pipeline Stages on Top of Rectangular Holotable */}
            <IsoBox
              x={142}
              y={258}
              z={48}
              w={11}
              d={12}
              h={6}
              className="box-holo-node is-ingest"
            />
            <IsoBox
              x={172}
              y={246}
              z={48}
              w={12}
              d={10}
              h={8}
              className="box-holo-node is-transform"
            />
            <IsoBox
              x={172}
              y={272}
              z={48}
              w={12}
              d={10}
              h={5}
              className="box-holo-node is-ml"
            />
            <IsoBox
              x={208}
              y={256}
              z={48}
              w={13}
              d={14}
              h={10}
              className="box-holo-node is-warehouse"
            />
            <IsoBox
              x={238}
              y={258}
              z={48}
              w={10}
              d={12}
              h={7}
              className="box-holo-node is-serve"
            />

            {/* 3D Elevated Pipeline Conduits with Moving Packet Dots */}
            <div className="holo-pipe-3d holo-pipe-1" aria-hidden="true">
              <span className="holo-pipe-dot" />
            </div>
            <div className="holo-pipe-3d holo-pipe-2" aria-hidden="true">
              <span className="holo-pipe-dot is-emerald" />
            </div>
            <div className="holo-pipe-3d holo-pipe-3" aria-hidden="true">
              <span className="holo-pipe-dot" />
            </div>

            {/* Edge NAS & Ingestion Appliance beside Desk */}
            <IsoBox
              x={224}
              y={10}
              z={0}
              w={54}
              d={48}
              h={48}
              className="box-nightstand"
              frontContent={
                <div className="nas-front-bays">
                  <span className="nas-bay" />
                  <span className="nas-bay" />
                  <span className="nas-bay" />
                </div>
              }
            />
            <IsoBox
              x={236}
              y={18}
              z={50}
              w={30}
              d={24}
              h={12}
              className="box-clock"
              frontContent={<span className="nas-status-led" />}
            />

            {/* Homelab Server Racks (4 Towers) along Back-Right Wall */}
            <IsoBox
              x={454}
              y={54}
              z={0}
              w={72}
              d={290}
              h={10}
              className="box-server-plinth"
            />
            {/* Rack 3 (Education Target): MSc IT Academic Compute Node */}
            <IsoBox
              x={464}
              y={64}
              z={12}
              w={52}
              d={58}
              h={112}
              className={`box-server-rack ${isEducationActive ? 'is-rack-active' : ''}`}
              leftContent={
                <div className="server-rack-face">
                  <span className="rack-label">UITM · MSC IT</span>
                  <span className="server-blade is-cyan" />
                  <span className="server-blade is-emerald" />
                  <span className="server-blade is-cyan" />
                  <span className="server-blade is-cyan" />
                </div>
              }
            />
            {/* Rack 4: Dagster ETL Worker Node */}
            <IsoBox
              x={464}
              y={134}
              z={12}
              w={52}
              d={58}
              h={112}
              className="box-server-rack"
              leftContent={
                <div className="server-rack-face">
                  <span className="rack-label">DAGSTER · ETL</span>
                  <span className="server-blade is-emerald" />
                  <span className="server-blade is-emerald" />
                  <span className="server-blade is-cyan" />
                  <span className="server-blade is-emerald" />
                </div>
              }
            />
            {/* Rack 1: PostgreSQL 22M-Row Storage Tower */}
            <IsoBox
              x={464}
              y={204}
              z={12}
              w={52}
              d={58}
              h={112}
              className="box-server-rack"
              leftContent={
                <div className="server-rack-face">
                  <span className="rack-label">PGSQL · 22M</span>
                  <span className="server-blade is-emerald" />
                  <span className="server-blade is-cyan" />
                  <span className="server-blade is-cyan" />
                  <span className="server-blade is-emerald" />
                </div>
              }
            />
            {/* Rack 2 (Contact Target): Local 32B LLM & ChromaDB Vector Tower */}
            <IsoBox
              x={464}
              y={274}
              z={12}
              w={52}
              d={58}
              h={112}
              className={`box-server-rack ${isContactActive ? 'is-rack-active' : ''}`}
              leftContent={
                <div className="server-rack-face">
                  <span className="rack-label">32B LLM · RAG</span>
                  <span className="server-blade is-cyan" />
                  <span className="server-blade is-emerald" />
                  <span className="server-blade is-cyan" />
                  <span className="server-blade is-emerald" />
                </div>
              }
            />

            {/* Glowing Fiber-Optic Wires Connecting Server Racks to Pipeline Screen & Desk Server Box */}
            <div className="server-wire server-wire-floor-1" aria-hidden="true" />
            <div className="server-wire server-wire-floor-2 is-emerald" aria-hidden="true" />
            <div className="server-wire server-wire-wall-1" aria-hidden="true" />
            <div className="server-wire server-wire-wall-2 is-emerald" aria-hidden="true" />
            <div className="server-wire desk-wire-1a" aria-hidden="true" />
            <div className="server-wire desk-wire-1b" aria-hidden="true" />
            <div className="server-wire desk-wire-1c" aria-hidden="true" />
            <div className="server-wire desk-wire-2a is-emerald" aria-hidden="true" />
            <div className="server-wire desk-wire-2b is-emerald" aria-hidden="true" />
            <div className="server-wire desk-wire-2c is-emerald" aria-hidden="true" />
            {/* Glowing Floor Wire from 2nd Server Block (DAGSTER · ETL) to Pipeline Table */}
            <div className="server-wire table-wire-1a is-emerald" aria-hidden="true" />
            <div className="server-wire table-wire-1b is-emerald" aria-hidden="true" />
            <div className="server-wire table-wire-1c is-emerald" aria-hidden="true" />

            {/* Wall-Mounted Flat Pipeline Monitoring System Screen */}
            <IsoBox
              x={296}
              y={2}
              z={78}
              w={230}
              d={2}
              h={142}
              className="box-wall-backplane"
              frontContent={
                <div className="dag-wall-board">
                  <div className="dag-wall-header">
                    <span className="dag-wall-dot" />
                    <span className="dag-wall-title">PIPELINE MONITOR // DAGSTER NOC</span>
                    <span className="dag-wall-badges">
                      <span className="dag-status-pill is-ok">142 OK</span>
                      <span className="dag-status-pill is-err">2 ERR</span>
                      <span className="dag-wall-sla">99.1% SLA</span>
                    </span>
                  </div>

                  {/* Middle Telemetry Area: Throughput Graph Chart + Run Status Feed */}
                  <div className="dag-monitor-grid">
                    <div className="dag-chart-card">
                      <div className="dag-chart-head">
                        <span>THROUGHPUT · ROWS/HR</span>
                        <span className="dag-chart-val">22.4M</span>
                      </div>
                      <svg className="dag-chart-svg" viewBox="0 0 120 46" aria-hidden="true">
                        <defs>
                          <linearGradient id="dagAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(56 189 248 / 0.42)" />
                            <stop offset="100%" stopColor="rgb(56 189 248 / 0.02)" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line className="dag-chart-grid" x1="0" y1="12" x2="120" y2="12" />
                        <line className="dag-chart-grid" x1="0" y1="24" x2="120" y2="24" />
                        <line className="dag-chart-grid" x1="0" y1="36" x2="120" y2="36" />
                        {/* Area + Line */}
                        <path
                          className="dag-chart-area"
                          d="M0,36 L14,30 L28,32 L42,20 L56,23 L70,13 L84,18 L98,9 L112,12 L120,7 L120,46 L0,46 Z"
                          fill="url(#dagAreaGrad)"
                        />
                        <polyline
                          className="dag-chart-line"
                          points="0,36 14,30 28,32 42,20 56,23 70,13 84,18 98,9 112,12 120,7"
                        />
                        {/* Success SLA baseline */}
                        <polyline
                          className="dag-chart-line is-emerald"
                          points="0,41 24,39 48,38 72,36 96,35 120,34"
                        />
                        {/* Error spike marker */}
                        <circle className="dag-chart-err-dot" cx="56" cy="23" r="2.2" />
                        <circle className="dag-chart-ok-dot" cx="98" cy="9" r="2.2" />
                      </svg>
                      <div className="dag-chart-axis">
                        <span>00:00</span>
                        <span>LATENCY 240ms</span>
                        <span>NOW</span>
                      </div>
                    </div>

                    <div className="dag-log-card">
                      <div className="dag-chart-head">
                        <span>RUN HEALTH</span>
                        <span className="dag-log-live">LIVE</span>
                      </div>
                      <div className="dag-log-list">
                        <div className="dag-log-row">
                          <span className="dag-log-badge is-ok">OK</span>
                          <span className="dag-log-name">etl_demography</span>
                          <span className="dag-log-ms">240ms</span>
                        </div>
                        <div className="dag-log-row">
                          <span className="dag-log-badge is-ok">OK</span>
                          <span className="dag-log-name">rag_embed_32b</span>
                          <span className="dag-log-ms">1.1s</span>
                        </div>
                        <div className="dag-log-row is-err-row">
                          <span className="dag-log-badge is-err">ERR</span>
                          <span className="dag-log-name">geo_sync_retry</span>
                          <span className="dag-log-ms">504</span>
                        </div>
                        <div className="dag-log-row">
                          <span className="dag-log-badge is-ok">OK</span>
                          <span className="dag-log-name">banci_econ_dag</span>
                          <span className="dag-log-ms">98%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Interactive Asset Strip (Projects + Experience Nodes) */}
                  <div className="dag-asset-strip">
                    {projectBooks.map((book) => {
                      const isActive = hoveredBookId === book.id || isProjectsActive;
                      return (
                        <button
                          key={book.id}
                          type="button"
                          className={`dag-screen-node ${isActive ? 'is-active' : ''}`}
                          data-tone={book.tone}
                          aria-label={`${book.spineTitle} (Project, ${book.period})`}
                          onMouseEnter={() => handleBookFocus(book)}
                          onMouseLeave={() => setHoveredBookId(null)}
                          onFocus={() => handleBookFocus(book)}
                          onBlur={() => setHoveredBookId(null)}
                          onClick={() => onSelectBook(book)}
                        >
                          <span className="dag-node-top">
                            <span className="dag-node-dot" />
                            <span className="dag-node-code">{book.callNumber}</span>
                          </span>
                          <span className="dag-node-name">{book.spineTitle}</span>
                        </button>
                      );
                    })}
                    {experienceBooks.map((book) => {
                      const isActive = hoveredBookId === book.id || isExperienceActive;
                      return (
                        <button
                          key={book.id}
                          type="button"
                          className={`dag-screen-node is-exp ${isActive ? 'is-active' : ''}`}
                          data-tone={book.tone}
                          aria-label={`${book.spineTitle} (Work Experience, ${book.period})`}
                          onMouseEnter={() => handleBookFocus(book)}
                          onMouseLeave={() => setHoveredBookId(null)}
                          onFocus={() => handleBookFocus(book)}
                          onBlur={() => setHoveredBookId(null)}
                          onClick={() => onSelectBook(book)}
                        >
                          <span className="dag-node-top">
                            <span className="dag-node-dot" />
                            <span className="dag-node-code">{book.callNumber}</span>
                          </span>
                          <span className="dag-node-name">{book.spineTitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              }
            />

            {/* Desk + Clickable PC Setup */}
            <DeskSetup
              profile={profile}
              isHovered={isSkillsActive}
              isZoneHighlighted={isSkillsActive}
              previewBook={hoveredBook ?? null}
              onHoverChange={(active) => {
                setHoveredBookId(null);
                setHoveredPc(active);
              }}
              onOpenPc={() => onOpenSection('skills')}
            />

            {/* Animated Isometric Character */}
            <RoomCharacter walkTarget={walkTarget} />
          </div>

          {/* Callout Labels Positioned Just Outside/Along Room Boundary */}
          <div className="iso-callouts-layer">
            {/* 1. Key Projects Callout (Above Back-Left Wall) */}
            <button
              type="button"
              className={`room-callout callout-projects ${isProjectsActive ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredCallout('projects')}
              onMouseLeave={() => setHoveredCallout(null)}
              onFocus={() => setHoveredCallout('projects')}
              onBlur={() => setHoveredCallout(null)}
              onClick={() => {
                if (projectBooks[0]) onSelectBook(projectBooks[0]);
              }}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-cobalt" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Key Projects</span>
                  <span className="callout-sub">22M+ Rows · Geo-RAG · ETL</span>
                </span>
                <span className="callout-arrow" aria-hidden="true">›</span>
              </span>
            </button>

            {/* 2. Work Experience Callout (Off Upper-Left Wall Edge) */}
            <button
              type="button"
              className={`room-callout callout-experience ${isExperienceActive ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredCallout('experience')}
              onMouseLeave={() => setHoveredCallout(null)}
              onFocus={() => setHoveredCallout('experience')}
              onBlur={() => setHoveredCallout(null)}
              onClick={() => {
                if (experienceBooks[0]) onSelectBook(experienceBooks[0]);
              }}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-teal" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Work Experience</span>
                  <span className="callout-sub">DOSM &amp; UTP · 95% DAG SLA</span>
                </span>
                <span className="callout-arrow" aria-hidden="true">›</span>
              </span>
            </button>

            {/* 3. Data & AI Stack (Below Left Floor Edge — clear of Desk PC) */}
            <button
              type="button"
              className={`room-callout callout-skills ${isSkillsActive ? 'is-active' : ''}`}
              onMouseEnter={() => {
                setHoveredCallout('skills');
                setHoveredPc(true);
              }}
              onMouseLeave={() => {
                setHoveredCallout(null);
                setHoveredPc(false);
              }}
              onFocus={() => {
                setHoveredCallout('skills');
                setHoveredPc(true);
              }}
              onBlur={() => {
                setHoveredCallout(null);
                setHoveredPc(false);
              }}
              onClick={() => onOpenSection('skills')}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-sky" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Data &amp; AI Stack</span>
                  <span className="callout-sub">Python · Dagster · PostgreSQL</span>
                </span>
                <span className="callout-arrow" aria-hidden="true">›</span>
              </span>
            </button>

            {/* 4. Education Callout (Above Back-Right Wall) */}
            <button
              type="button"
              className={`room-callout callout-education ${isEducationActive ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredCallout('education')}
              onMouseLeave={() => setHoveredCallout(null)}
              onFocus={() => setHoveredCallout('education')}
              onBlur={() => setHoveredCallout(null)}
              onClick={() => onOpenSection('education')}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-indigo" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Education</span>
                  <span className="callout-sub">MSc IT &amp; BSc CS · UiTM</span>
                </span>
                <span className="callout-arrow" aria-hidden="true">›</span>
              </span>
            </button>

            {/* 5. Contact & References (Off Right Wall Edge beside Server Cluster) */}
            <button
              type="button"
              className={`room-callout callout-contact ${isContactActive ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredCallout('contact')}
              onMouseLeave={() => setHoveredCallout(null)}
              onFocus={() => setHoveredCallout('contact')}
              onBlur={() => setHoveredCallout(null)}
              onClick={() => onOpenSection('contact')}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-mint" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Contact &amp; References</span>
                  <span className="callout-sub">Direct Uplink &amp; Referees</span>
                </span>
                <span className="callout-arrow" aria-hidden="true">›</span>
              </span>
            </button>

            {/* 6. Research Publications (Off Front Floor Edge below Holotable) */}
            <button
              type="button"
              className={`room-callout callout-publications ${isPublicationsActive ? 'is-active' : ''}`}
              onMouseEnter={() => setHoveredCallout('publications')}
              onMouseLeave={() => setHoveredCallout(null)}
              onFocus={() => setHoveredCallout('publications')}
              onBlur={() => setHoveredCallout(null)}
              onClick={() => onOpenSection('publications')}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-violet" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Publications (4)</span>
                  <span className="callout-sub">IEEE &amp; Indexed ML Research</span>
                </span>
                <span className="callout-arrow" aria-hidden="true">›</span>
              </span>
            </button>

            {hoveredBook && (
              <div
                className="shelf-preview-card"
                data-tone={hoveredBook.tone}
                aria-hidden="true"
              >
                <div className="shelf-preview-top">
                  <span className="shelf-preview-code">
                    {hoveredBook.callNumber}
                  </span>
                  <span className="shelf-preview-period">
                    {hoveredBook.period}
                  </span>
                </div>
                <p className="shelf-preview-title">{hoveredBook.title}</p>
                {hoveredBook.metrics && hoveredBook.metrics.length > 0 && (
                  <div className="shelf-preview-metrics">
                    {hoveredBook.metrics.slice(0, 2).map((m) => (
                      <span key={m.label} className="shelf-preview-metric">
                        <strong>{m.value}</strong> {m.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
