import { useEffect, useState, type CSSProperties } from 'react';
import { IsoBox } from './IsoBox';

export type CharacterActivity =
  | 'desktop'
  | 'bookshelf'
  | 'coffee_table'
  | 'bed'
  | 'window';

type CharacterPhase = 'performing' | 'walking_to_hub' | 'walking_to_target';

interface RoomPoint {
  x: number;
  y: number;
}

const ACTIVITIES: readonly CharacterActivity[] = [
  'desktop',
  'bookshelf',
  'coffee_table',
  'bed',
  'window',
];

const HUB_POS: RoomPoint = { x: 268, y: 156 };

const STAND_POS: Record<CharacterActivity, RoomPoint> = {
  desktop: { x: 162, y: 136 },
  bookshelf: { x: 406, y: 68 },
  coffee_table: { x: 256, y: 264 },
  bed: { x: 344, y: 268 },
  window: { x: 426, y: 112 },
};

const PERFORM_POS: Record<CharacterActivity, RoomPoint> = {
  desktop: { x: 116, y: 126 },
  bookshelf: { x: 406, y: 66 },
  coffee_table: { x: 248, y: 264 },
  bed: { x: 350, y: 268 },
  window: { x: 426, y: 112 },
};

const WALK_DURATION_MS = 950;
const MIN_DWELL_MS = 6000;
const MAX_DWELL_MS = 9500;

export function RoomCharacter() {
  const [activity, setActivity] = useState<CharacterActivity>('window');
  const [targetActivity, setTargetActivity] =
    useState<CharacterActivity>('window');
  const [phase, setPhase] = useState<CharacterPhase>('performing');
  const [walkPos, setWalkPos] = useState<RoomPoint>(STAND_POS.window);

  useEffect(() => {
    if (phase === 'performing') {
      const dwellMs =
        MIN_DWELL_MS + Math.random() * (MAX_DWELL_MS - MIN_DWELL_MS);
      const timerId = window.setTimeout(() => {
        const candidates = ACTIVITIES.filter((item) => item !== activity);
        const next = candidates[Math.floor(Math.random() * candidates.length)];
        setTargetActivity(next);
        setWalkPos(STAND_POS[activity]);
        setPhase('walking_to_hub');
      }, dwellMs);

      return () => window.clearTimeout(timerId);
    }

    if (phase === 'walking_to_hub') {
      let rafInnerId = 0;
      const rafOuterId = window.requestAnimationFrame(() => {
        rafInnerId = window.requestAnimationFrame(() => {
          setWalkPos(HUB_POS);
        });
      });

      const timerId = window.setTimeout(() => {
        setPhase('walking_to_target');
      }, WALK_DURATION_MS + 30);

      return () => {
        window.cancelAnimationFrame(rafOuterId);
        if (rafInnerId) window.cancelAnimationFrame(rafInnerId);
        window.clearTimeout(timerId);
      };
    }

    setWalkPos(STAND_POS[targetActivity]);
    const timerId = window.setTimeout(() => {
      setActivity(targetActivity);
      setPhase('performing');
    }, WALK_DURATION_MS);

    return () => window.clearTimeout(timerId);
  }, [phase, activity, targetActivity]);

  const isWalking = phase !== 'performing';
  const anchorPos = isWalking ? walkPos : PERFORM_POS[activity];
  const charStyle = {
    '--char-x': `${anchorPos.x}px`,
    '--char-y': `${anchorPos.y}px`,
  } as CSSProperties;

  return (
    <div
      key={isWalking ? 'walker' : `perform-${activity}`}
      className={`iso-character ${isWalking ? 'is-walking' : `is-${activity}`}`}
      style={charStyle}
      aria-hidden="true"
    >
      {isWalking && (
        <>
          <div className="char-shadow" />
          <div className="char-limb char-limb-left char-leg">
            <IsoBox x={-10} y={-7} z={0} w={8} d={12} h={6} className="box-char-shoe" />
            <IsoBox x={-10} y={-5} z={6} w={8} d={9} h={36} className="box-char-pants" />
          </div>
          <div className="char-limb char-limb-right char-leg">
            <IsoBox x={2} y={-7} z={0} w={8} d={12} h={6} className="box-char-shoe" />
            <IsoBox x={2} y={-5} z={6} w={8} d={9} h={36} className="box-char-pants" />
          </div>
          <IsoBox x={-12} y={-7} z={42} w={24} d={14} h={36} className="box-char-shirt" />
          <div className="char-limb char-limb-right char-arm">
            <IsoBox x={-18} y={-5} z={46} w={6} d={9} h={30} className="box-char-shirt" />
          </div>
          <div className="char-limb char-limb-left char-arm">
            <IsoBox x={12} y={-5} z={46} w={6} d={9} h={30} className="box-char-shirt" />
          </div>
          <IsoBox x={-8} y={-8} z={78} w={16} d={15} h={16} className="box-char-skin" />
          <IsoBox x={-9} y={-9} z={92} w={18} d={17} h={6} className="box-char-hair" />
        </>
      )}

      {!isWalking && activity === 'desktop' && (
        <>
          <IsoBox x={-12} y={-20} z={37} w={24} d={24} h={9} className="box-char-pants" />
          <IsoBox x={-10} y={-22} z={8} w={8} d={8} h={29} className="box-char-pants" />
          <IsoBox x={-10} y={-25} z={3} w={8} d={11} h={5} className="box-char-shoe" />
          <IsoBox x={2} y={-22} z={8} w={8} d={8} h={29} className="box-char-pants" />
          <IsoBox x={2} y={-25} z={3} w={8} d={11} h={5} className="box-char-shoe" />
          <IsoBox x={-12} y={-6} z={46} w={24} d={14} h={36} className="box-char-shirt" />
          <div className="char-limb char-typing-left">
            <IsoBox x={-16} y={-26} z={86} w={6} d={22} h={7} className="box-char-shirt" />
            <IsoBox x={-15} y={-31} z={87} w={5} d={6} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-typing-right">
            <IsoBox x={10} y={-26} z={86} w={6} d={22} h={7} className="box-char-shirt" />
            <IsoBox x={10} y={-31} z={87} w={5} d={6} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-head-work">
            <IsoBox x={-8} y={-8} z={82} w={16} d={15} h={16} className="box-char-skin" />
            <IsoBox x={-9} y={-9} z={96} w={18} d={17} h={6} className="box-char-hair" />
          </div>
        </>
      )}

      {!isWalking && activity === 'bookshelf' && (
        <>
          <div className="char-shadow" />
          <IsoBox x={-10} y={-7} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={-10} y={-5} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <IsoBox x={2} y={-7} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={2} y={-5} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <IsoBox x={-12} y={-7} z={42} w={24} d={14} h={36} className="box-char-shirt" />
          <IsoBox x={-17} y={-20} z={54} w={6} d={20} h={8} className="box-char-shirt" />
          <IsoBox x={11} y={-20} z={54} w={6} d={20} h={8} className="box-char-shirt" />
          <div className="char-limb char-prop-book">
            <IsoBox x={-11} y={-25} z={58} w={22} d={12} h={3} className="box-char-phone" />
          </div>
          <div className="char-limb char-head-read">
            <IsoBox x={-8} y={-9} z={78} w={16} d={15} h={16} className="box-char-skin" />
            <IsoBox x={-9} y={-10} z={92} w={18} d={17} h={6} className="box-char-hair" />
          </div>
        </>
      )}

      {!isWalking && activity === 'coffee_table' && (
        <>
          <div className="char-shadow" />
          {/* Standing facing -x toward the Geospatial & ML Research Holotable */}
          <IsoBox x={-7} y={-10} z={0} w={12} d={8} h={6} className="box-char-shoe" />
          <IsoBox x={-4} y={-10} z={6} w={9} d={8} h={36} className="box-char-pants" />
          <IsoBox x={-7} y={2} z={0} w={12} d={8} h={6} className="box-char-shoe" />
          <IsoBox x={-4} y={2} z={6} w={9} d={8} h={36} className="box-char-pants" />
          <IsoBox x={-7} y={-12} z={42} w={14} d={24} h={36} className="box-char-shirt" />
          <div className="char-limb char-table-arms">
            <IsoBox x={-18} y={-16} z={54} w={16} d={6} h={7} className="box-char-shirt" />
            <IsoBox x={-18} y={10} z={54} w={16} d={6} h={7} className="box-char-shirt" />
            <IsoBox x={-22} y={-15} z={55} w={5} d={5} h={5} className="box-char-skin" />
            <IsoBox x={-22} y={10} z={55} w={5} d={5} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-head-read">
            <IsoBox x={-8} y={-8} z={78} w={15} d={16} h={16} className="box-char-skin" />
            <IsoBox x={-8} y={-9} z={92} w={17} d={18} h={6} className="box-char-hair" />
            <IsoBox x={4} y={-9} z={80} w={5} d={18} h={12} className="box-char-hair" />
          </div>
        </>
      )}

      {!isWalking && activity === 'bed' && (
        <>
          <div className="char-shadow" />
          {/* Standing facing +x toward the Server Rack & GPU Cluster */}
          <IsoBox x={-5} y={-10} z={0} w={12} d={8} h={6} className="box-char-shoe" />
          <IsoBox x={-5} y={-10} z={6} w={9} d={8} h={36} className="box-char-pants" />
          <IsoBox x={-5} y={2} z={0} w={12} d={8} h={6} className="box-char-shoe" />
          <IsoBox x={-5} y={2} z={6} w={9} d={8} h={36} className="box-char-pants" />
          <IsoBox x={-7} y={-12} z={42} w={14} d={24} h={36} className="box-char-shirt" />
          {/* Arms raised holding diagnostic tablet */}
          <div className="char-limb char-gaming-rig">
            <IsoBox x={4} y={-16} z={54} w={16} d={6} h={8} className="box-char-shirt" />
            <IsoBox x={4} y={10} z={54} w={16} d={6} h={8} className="box-char-shirt" />
            <IsoBox x={18} y={-11} z={58} w={6} d={22} h={4} className="box-char-phone" />
          </div>
          <div className="char-limb char-head-work">
            <IsoBox x={-7} y={-8} z={78} w={15} d={16} h={16} className="box-char-skin" />
            <IsoBox x={-9} y={-9} z={92} w={17} d={18} h={6} className="box-char-hair" />
            <IsoBox x={-9} y={-9} z={80} w={5} d={18} h={12} className="box-char-hair" />
          </div>
        </>
      )}

      {!isWalking && activity === 'window' && (
        <>
          <div className="char-shadow" />
          {/* Standing facing +x toward the back-right window */}
          <IsoBox x={-5} y={-10} z={0} w={12} d={8} h={6} className="box-char-shoe" />
          <IsoBox x={-5} y={-10} z={6} w={9} d={8} h={36} className="box-char-pants" />
          <IsoBox x={-5} y={2} z={0} w={12} d={8} h={6} className="box-char-shoe" />
          <IsoBox x={-5} y={2} z={6} w={9} d={8} h={36} className="box-char-pants" />
          <IsoBox x={-7} y={-12} z={42} w={14} d={24} h={36} className="box-char-shirt" />
          {/* Arms relaxed at sides */}
          <IsoBox x={-5} y={-18} z={48} w={9} d={6} h={28} className="box-char-shirt" />
          <IsoBox x={-4} y={-18} z={43} w={7} d={6} h={5} className="box-char-skin" />
          <IsoBox x={-5} y={12} z={48} w={9} d={6} h={28} className="box-char-shirt" />
          <IsoBox x={-4} y={12} z={43} w={7} d={6} h={5} className="box-char-skin" />
          {/* Head & Hair turned toward the window (+x) */}
          <div className="char-limb char-head-gaze">
            <IsoBox x={-7} y={-8} z={78} w={15} d={16} h={16} className="box-char-skin" />
            <IsoBox x={-9} y={-9} z={92} w={17} d={18} h={6} className="box-char-hair" />
            <IsoBox x={-9} y={-9} z={80} w={5} d={18} h={12} className="box-char-hair" />
          </div>
          {/* Subtle floating cloudy thought bubble above head */}
          <div className="char-thought-anchor">
            <div className="char-thought-cloud">
              <svg
                className="char-thought-svg"
                viewBox="0 0 64 48"
                aria-hidden="true"
              >
                <circle className="thought-trail-bubble trail-1" cx="27" cy="43" r="2.4" />
                <circle className="thought-trail-bubble trail-2" cx="30" cy="35.5" r="3.8" />
                <path
                  className="thought-cloud-path"
                  d="M20 28 H45 C50.5 28 55 23.8 55 18.5 C55 13.8 51.3 9.9 46.6 9.3 C44.8 4.5 40.1 1.2 34.6 1.2 C28.5 1.2 23.4 5.2 22.1 10.7 C21.2 10.4 20.2 10.2 19.2 10.2 C13.6 10.2 9 14.5 9 19.8 C9 24.4 13.8 28 20 28 Z"
                />
                <circle className="thought-dot dot-1" cx="25" cy="17.5" r="1.8" />
                <circle className="thought-dot dot-2" cx="32" cy="17.5" r="1.8" />
                <circle className="thought-dot dot-3" cx="39" cy="17.5" r="1.8" />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
