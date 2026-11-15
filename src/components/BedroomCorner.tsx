import { useState, type CSSProperties } from 'react';
import type { ProfileData } from '../data/profile';
import type { BookEntry } from '../types/library';
import { DeskSetup } from './DeskSetup';
import { IsoBox } from './IsoBox';
import type { RoomSectionTab } from './PcModal';
import { RoomCharacter } from './RoomCharacter';

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

const BOOK_WIDTH: Record<NonNullable<BookEntry['thickness']>, number> = {
  thin: 16,
  regular: 20,
  thick: 26,
};

const BOOK_HEIGHT: Record<NonNullable<BookEntry['height']>, number> = {
  short: 38,
  medium: 46,
  tall: 54,
};

const SHELF_Z: Record<'project' | 'experience', number> = {
  project: 162,
  experience: 96,
};

export function BedroomCorner({
  profile,
  books,
  onSelectBook,
  onOpenSection,
}: BedroomCornerProps) {
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [hoveredPc, setHoveredPc] = useState(false);
  const [hoveredCallout, setHoveredCallout] = useState<CalloutKey | null>(null);

  const projectBooks = books.filter((b) => b.category === 'project');
  const experienceBooks = books.filter((b) => b.category === 'experience');

  const layoutShelfBooks = (items: BookEntry[], shelfZ: number) => {
    let cursorX = 228;
    return items.map((book) => {
      const w = BOOK_WIDTH[book.thickness ?? 'regular'];
      const h = BOOK_HEIGHT[book.height ?? 'medium'];
      const x = cursorX;
      cursorX += w + 4;
      return { book, x, w, h, z: shelfZ + 8 };
    });
  };

  const positionedBooks = [
    ...layoutShelfBooks(projectBooks, SHELF_Z.project),
    ...layoutShelfBooks(experienceBooks, SHELF_Z.experience),
  ];

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
            viewBox="0 0 780 560"
            aria-hidden="true"
          >
            {/* 1. Projects Leader Line */}
            <g className={`callout-branch ${isProjectsActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="305,109 285,60 250,60"
              />
              <circle className="callout-target-ring" cx="305" cy="109" r="7" />
              <circle className="callout-target-dot pin-dot-cobalt" cx="305" cy="109" r="3.5" />
            </g>

            {/* 2. Experience Leader Line */}
            <g className={`callout-branch ${isExperienceActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="277,180 230,135 195,135"
              />
              <circle className="callout-target-ring" cx="277" cy="180" r="7" />
              <circle className="callout-target-dot pin-dot-teal" cx="277" cy="180" r="3.5" />
            </g>

            {/* 3. Technical Skills Leader Line */}
            <g className={`callout-branch ${isSkillsActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="188,263 188,295 170,295"
              />
              <circle className="callout-target-ring" cx="188" cy="263" r="7" />
              <circle className="callout-target-dot pin-dot-sky" cx="188" cy="263" r="3.5" />
            </g>

            {/* 4. Education Leader Line */}
            <g className={`callout-branch ${isEducationActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="567,197 580,70 600,70"
              />
              <circle className="callout-target-ring" cx="567" cy="197" r="7" />
              <circle className="callout-target-dot pin-dot-indigo" cx="567" cy="197" r="3.5" />
            </g>

            {/* 5. Contact Leader Line */}
            <g className={`callout-branch ${isContactActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="510,325 565,270 595,270"
              />
              <circle className="callout-target-ring" cx="510" cy="325" r="7" />
              <circle className="callout-target-dot pin-dot-mint" cx="510" cy="325" r="3.5" />
            </g>

            {/* 6. Publications Leader Line */}
            <g className={`callout-branch ${isPublicationsActive ? 'is-active' : ''}`}>
              <polyline
                className="callout-line"
                points="390,398 375,490 350,490"
              />
              <circle className="callout-target-ring" cx="390" cy="398" r="7" />
              <circle className="callout-target-dot pin-dot-violet" cx="390" cy="398" r="3.5" />
            </g>
          </svg>

          {/* 3D Isometric World */}
          <div className="iso-world">
            {/* 3D Isometric Floor Slab */}
            <IsoBox
              x={0}
              y={0}
              z={-16}
              w={420}
              d={420}
              h={16}
              className="box-floor-slab"
            />

            {/* Solid 3D Extruded Cutaway Wall Slabs (14px thick) */}
            <IsoBox
              x={0}
              y={-14}
              z={-16}
              w={420}
              d={14}
              h={266}
              className="box-wall-slab"
            />
            <IsoBox
              x={420}
              y={-14}
              z={-16}
              w={14}
              d={434}
              h={266}
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
              <div className="iso-window">
                <span className="iso-window-pane" />
                <span className="iso-window-pane" />
                <span className="iso-window-pane" />
                <span className="iso-window-pane" />
                <span className="iso-curtain iso-curtain-left" />
                <span className="iso-curtain iso-curtain-right" />
              </div>
              <div className="iso-poster" />
            </div>

            {/* Ambient Floor Contact Shadows */}
            <div className="shadow-patch shadow-nightstand" aria-hidden="true" />
            <div className="shadow-patch shadow-bed" aria-hidden="true" />
            <div className="shadow-patch shadow-rug" aria-hidden="true" />

            {/* Center Round Rug + Coffee Table + Publications Stack */}
            <div className="iso-round-rug" aria-hidden="true" />
            <IsoBox
              x={126}
              y={266}
              z={0}
              w={6}
              d={6}
              h={22}
              className="box-table-leg"
            />
            <IsoBox
              x={156}
              y={266}
              z={0}
              w={6}
              d={6}
              h={22}
              className="box-table-leg"
            />
            <IsoBox
              x={126}
              y={296}
              z={0}
              w={6}
              d={6}
              h={22}
              className="box-table-leg"
            />
            <IsoBox
              x={156}
              y={296}
              z={0}
              w={6}
              d={6}
              h={22}
              className="box-table-leg"
            />
            <IsoBox
              x={116}
              y={256}
              z={22}
              w={56}
              d={56}
              h={5}
              className="box-coffee-table"
            />
            <IsoBox
              x={126}
              y={266}
              z={27}
              w={22}
              d={18}
              h={6}
              className="box-table-book"
            />
            <IsoBox
              x={152}
              y={286}
              z={27}
              w={8}
              d={8}
              h={8}
              className="box-mug"
            />

            {/* Nightstand beside Desk */}
            <IsoBox
              x={224}
              y={10}
              z={0}
              w={56}
              d={52}
              h={50}
              className="box-nightstand"
            />
            <IsoBox
              x={244}
              y={24}
              z={50}
              w={16}
              d={14}
              h={14}
              className="box-clock"
            />

            {/* Bed tucked along Back-Right Wall */}
            <IsoBox
              x={396}
              y={214}
              z={0}
              w={14}
              d={156}
              h={84}
              className="box-bed-headboard"
            />
            <IsoBox
              x={236}
              y={214}
              z={0}
              w={160}
              d={156}
              h={18}
              className="box-bed-frame"
            />
            <IsoBox
              x={240}
              y={218}
              z={18}
              w={154}
              d={148}
              h={16}
              className="box-bed-mattress"
            />
            <IsoBox
              x={326}
              y={218}
              z={34}
              w={22}
              d={148}
              h={5}
              className="box-bed-sheet"
            />
            <IsoBox
              x={240}
              y={218}
              z={34}
              w={92}
              d={148}
              h={6}
              className="box-bed-blanket"
            />
            <IsoBox
              x={354}
              y={236}
              z={34}
              w={32}
              d={50}
              h={10}
              className="box-bed-pillow"
            />
            <IsoBox
              x={354}
              y={298}
              z={34}
              w={32}
              d={50}
              h={10}
              className="box-bed-pillow"
            />

            {/* Two Floating 3D Wall Shelves */}
            <IsoBox
              x={222}
              y={2}
              z={SHELF_Z.project}
              w={172}
              d={34}
              h={8}
              className="box-wall-shelf"
            />
            <IsoBox
              x={222}
              y={2}
              z={SHELF_Z.experience}
              w={172}
              d={34}
              h={8}
              className="box-wall-shelf"
            />

            {/* Shelf decorative plant & bookend */}
            <IsoBox
              x={368}
              y={10}
              z={SHELF_Z.project + 8}
              w={16}
              d={16}
              h={14}
              className="box-plant-pot"
            />
            <IsoBox
              x={365}
              y={8}
              z={SHELF_Z.project + 22}
              w={22}
              d={20}
              h={18}
              className="box-plant-leaf"
            />
            <IsoBox
              x={298}
              y={8}
              z={SHELF_Z.experience + 8}
              w={28}
              d={20}
              h={24}
              className="box-bookend"
            />

            {/* Clickable 3D Books on the Shelves */}
            {positionedBooks.map(({ book, x, w, h, z }) => {
              const isHovered = hoveredBookId === book.id;
              const isCategoryHovered =
                (book.category === 'project' && isProjectsActive) ||
                (book.category === 'experience' && isExperienceActive);

              const bookVars = {
                '--x': `${x}px`,
                '--y': '6px',
                '--z': `${z}px`,
                '--w': `${w}px`,
                '--d': '24px',
                '--h': `${h}px`,
              } as CSSProperties;

              return (
                <button
                  key={book.id}
                  type="button"
                  className={`iso-box iso-book-btn ${
                    isHovered || isCategoryHovered ? 'is-active' : ''
                  }`}
                  data-tone={book.tone}
                  style={bookVars}
                  aria-label={`${book.spineTitle} (${book.category === 'project' ? 'Project' : 'Work Experience'}, ${book.period})`}
                  onMouseEnter={() => handleBookFocus(book)}
                  onMouseLeave={() => setHoveredBookId(null)}
                  onFocus={() => handleBookFocus(book)}
                  onBlur={() => setHoveredBookId(null)}
                  onClick={() => onSelectBook(book)}
                >
                  <span className="iso-face iso-face-top" />
                  <span className="iso-face iso-face-front">
                    <span className="iso-book-band" />
                  </span>
                  <span className="iso-face iso-face-left" />
                </button>
              );
            })}

            {/* Desk + Clickable PC Setup */}
            <DeskSetup
              profile={profile}
              isHovered={isSkillsActive}
              isZoneHighlighted={isSkillsActive}
              onHoverChange={(active) => {
                setHoveredBookId(null);
                setHoveredPc(active);
              }}
              onOpenPc={() => onOpenSection('skills')}
            />

            {/* Animated Isometric Character */}
            <RoomCharacter />
          </div>

          {/* Callout Labels Positioned Just Outside/Along Room Boundary */}
          <div className="iso-callouts-layer">
            {/* 1. Key Projects Callout (Above Back-Left Wall) */}
            <button
              type="button"
              className={`room-callout callout-projects ${isProjectsActive ? 'is-active' : ''}`}
              onMouseEnter={() => {
                setHoveredCallout('projects');
                if (projectBooks[0]) setHoveredBookId(projectBooks[0].id);
              }}
              onMouseLeave={() => {
                setHoveredCallout(null);
                setHoveredBookId(null);
              }}
              onFocus={() => {
                setHoveredCallout('projects');
                if (projectBooks[0]) setHoveredBookId(projectBooks[0].id);
              }}
              onBlur={() => {
                setHoveredCallout(null);
                setHoveredBookId(null);
              }}
              onClick={() => {
                if (projectBooks[0]) onSelectBook(projectBooks[0]);
              }}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-cobalt" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Key Projects</span>
                  <span className="callout-sub">5 Volumes</span>
                </span>
              </span>
            </button>

            {/* 2. Work Experience Callout (Off Upper-Left Wall Edge) */}
            <button
              type="button"
              className={`room-callout callout-experience ${isExperienceActive ? 'is-active' : ''}`}
              onMouseEnter={() => {
                setHoveredCallout('experience');
                if (experienceBooks[0]) setHoveredBookId(experienceBooks[0].id);
              }}
              onMouseLeave={() => {
                setHoveredCallout(null);
                setHoveredBookId(null);
              }}
              onFocus={() => {
                setHoveredCallout('experience');
                if (experienceBooks[0]) setHoveredBookId(experienceBooks[0].id);
              }}
              onBlur={() => {
                setHoveredCallout(null);
                setHoveredBookId(null);
              }}
              onClick={() => {
                if (experienceBooks[0]) onSelectBook(experienceBooks[0]);
              }}
            >
              <span className="callout-card">
                <span className="callout-dot pin-dot-teal" aria-hidden="true" />
                <span className="callout-text">
                  <span className="callout-title">Work Experience</span>
                  <span className="callout-sub">DOSM &amp; UTP</span>
                </span>
              </span>
            </button>

            {/* 3. Technical Skills & Bio (Off Left Floor Edge beside Desk) */}
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
                  <span className="callout-title">Technical Skills &amp; Bio</span>
                  <span className="callout-sub">ETL, AI &amp; Web</span>
                </span>
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
                  <span className="callout-sub">MSc IT &amp; BSc CS</span>
                </span>
              </span>
            </button>

            {/* 5. Contact & References (Off Right Wall Edge beside Bed) */}
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
                  <span className="callout-sub">Direct Info &amp; Referees</span>
                </span>
              </span>
            </button>

            {/* 6. Research Publications (Off Front Floor Edge below Coffee Table) */}
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
                  <span className="callout-sub">Research Archive</span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
