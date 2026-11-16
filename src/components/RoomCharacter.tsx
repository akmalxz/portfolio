import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { findRoomPath, type RoomPoint } from '../utils/roomPathfinding';
import { IsoBox } from './IsoBox';

export type { RoomPoint };

export type CharacterActivity =
  | 'desktop'
  | 'bookshelf'
  | 'coffee_table'
  | 'bed'
  | 'window';

type CharacterPhase =
  | 'performing'
  | 'walking_to_target'
  | 'walking_to_custom'
  | 'custom_idle'
  | 'returning_to_last';

export interface WalkTarget extends RoomPoint {
  seq: number;
}

const ACTIVITIES: readonly CharacterActivity[] = [
  'desktop',
  'bookshelf',
  'coffee_table',
  'bed',
  'window',
];

const STAND_POS: Record<CharacterActivity, RoomPoint> = {
  desktop: { x: 162, y: 136 },
  bookshelf: { x: 406, y: 68 },
  coffee_table: { x: 280, y: 264 },
  bed: { x: 344, y: 268 },
  window: { x: 426, y: 112 },
};

const PERFORM_POS: Record<CharacterActivity, RoomPoint> = {
  desktop: { x: 116, y: 126 },
  bookshelf: { x: 406, y: 66 },
  coffee_table: { x: 274, y: 264 },
  bed: { x: 350, y: 268 },
  window: { x: 426, y: 112 },
};

const WALK_SPEED_PX_PER_SEC = 135;
const MIN_WALK_MS = 320;
const MAX_WALK_MS = 2200;
const MIN_DWELL_MS = 6000;
const MAX_DWELL_MS = 9500;
const CUSTOM_IDLE_FALLBACK_MS = 4500;

function getShortestAngle(currentDeg: number, targetDeg: number) {
  const delta = (((targetDeg - currentDeg) % 360) + 540) % 360 - 180;
  return currentDeg + delta;
}

function getWalkMetrics(from: RoomPoint, to: RoomPoint, currentYaw: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const durationMs =
    dist < 2
      ? 140
      : Math.round(
          Math.min(MAX_WALK_MS, Math.max(MIN_WALK_MS, (dist / WALK_SPEED_PX_PER_SEC) * 1000)),
        );
  // Character model faces +y by default (0deg). RotateZ aligns +y to (dx, dy).
  const rawYaw = dist < 2 ? currentYaw : Math.round((Math.atan2(dy, dx) * 180) / Math.PI - 90);
  const yawDeg = getShortestAngle(currentYaw, rawYaw);
  return { durationMs, yawDeg };
}

function CharBox(props: React.ComponentProps<typeof IsoBox>) {
  return <IsoBox allFaces {...props} />;
}

function CharacterHead({
  baseZ = 80,
  children,
}: {
  baseZ?: number;
  children?: React.ReactNode;
}) {
  return (
    <>
      {/* Neck connecting shoulders to head */}
      <CharBox x={-3} y={-3} z={baseZ - 4} w={6} d={6} h={5} className="box-char-skin" />
      {/* Solid 6-sided head + minimalist eyes on the +Y facing side */}
      <CharBox
        x={-7}
        y={-7}
        z={baseZ}
        w={14}
        d={14}
        h={16}
        className="box-char-skin"
        frontContent={
          <div className="char-face-features" aria-hidden="true">
            <span className="char-eye" />
            <span className="char-eye" />
          </div>
        }
      />
      {/* Flush top hair cap + full back hair curtain + sideburns */}
      <CharBox x={-8} y={-9} z={baseZ + 16} w={16} d={17} h={5} className="box-char-hair" />
      <CharBox x={-8} y={-9} z={baseZ + 3} w={16} d={2} h={13} className="box-char-hair" />
      <CharBox x={-8} y={-7} z={baseZ + 8} w={1} d={8} h={8} className="box-char-hair" />
      <CharBox x={7} y={-7} z={baseZ + 8} w={1} d={8} h={8} className="box-char-hair" />
      {children}
    </>
  );
}

function CharacterTorso({ z = 44, h = 32 }: { z?: number; h?: number }) {
  return (
    <>
      {/* Hoodie torso with front collar/badge and back hood/hem details */}
      <CharBox
        x={-12}
        y={-7}
        z={z}
        w={24}
        d={14}
        h={h}
        className="box-char-shirt"
        frontContent={
          <div className="char-shirt-detail" aria-hidden="true">
            <span className="char-collar" />
            <span className="char-badge" />
          </div>
        }
        backContent={
          <div className="char-shirt-back-detail" aria-hidden="true">
            <span className="char-hood-seam" />
            <span className="char-jacket-hem" />
          </div>
        }
      />
      {/* Folded hoodie collar on upper back */}
      <CharBox x={-6} y={-9} z={z + h - 5} w={12} d={2} h={5} className="box-char-hood" />
      {/* Waistband/belt separating torso and trousers */}
      <CharBox x={-12} y={-7} z={z - 2} w={24} d={14} h={2} className="box-char-belt" />
    </>
  );
}

function StandingLegs() {
  return (
    <>
      <CharBox x={-10} y={-4} z={1} w={8} d={11} h={6} className="box-char-shoe" />
      <CharBox x={-10} y={-4} z={7} w={8} d={8} h={35} className="box-char-pants" />
      <CharBox x={2} y={-4} z={1} w={8} d={11} h={6} className="box-char-shoe" />
      <CharBox x={2} y={-4} z={7} w={8} d={8} h={35} className="box-char-pants" />
    </>
  );
}

interface RoomCharacterProps {
  walkTarget?: WalkTarget | null;
}

export function RoomCharacter({ walkTarget = null }: RoomCharacterProps) {
  const [activity, setActivity] = useState<CharacterActivity>('window');
  const [targetActivity, setTargetActivity] =
    useState<CharacterActivity>('window');
  const [phase, setPhase] = useState<CharacterPhase>('performing');
  const [walkPos, setWalkPos] = useState<RoomPoint>(STAND_POS.window);
  const [walkDurationMs, setWalkDurationMs] = useState<number>(950);
  const [walkEasing, setWalkEasing] = useState<string>('cubic-bezier(0.35, 0, 0.25, 1)');
  const [walkYawDeg, setWalkYawDeg] = useState<number>(-90);

  const currentPosRef = useRef<RoomPoint>(STAND_POS.window);
  const lastActivityRef = useRef<CharacterActivity>('window');
  const customDestRef = useRef<RoomPoint>(STAND_POS.window);
  const handledSeqRef = useRef<number>(0);
  const yawRef = useRef<number>(-90);
  const segStartRef = useRef<RoomPoint>(STAND_POS.window);
  const segEndRef = useRef<RoomPoint>(STAND_POS.window);
  const segStartTimeRef = useRef<number>(0);
  const segDurationRef = useRef<number>(0);

  const getLivePos = (): RoomPoint => {
    if (segDurationRef.current <= 0) return currentPosRef.current;
    const elapsed = performance.now() - segStartTimeRef.current;
    const t = Math.min(1, Math.max(0, elapsed / segDurationRef.current));
    return {
      x: Math.round(segStartRef.current.x + (segEndRef.current.x - segStartRef.current.x) * t),
      y: Math.round(segStartRef.current.y + (segEndRef.current.y - segStartRef.current.y) * t),
    };
  };

  // Handle user click-to-move anywhere on the walkable floor
  useEffect(() => {
    if (!walkTarget) return;
    handledSeqRef.current = walkTarget.seq;

    if (phase === 'performing') {
      lastActivityRef.current = activity;
      const startPt = STAND_POS[activity];
      currentPosRef.current = startPt;
      setWalkDurationMs(0);
      setWalkPos(startPt);
    } else if (phase === 'walking_to_target') {
      lastActivityRef.current = targetActivity;
      const live = getLivePos();
      currentPosRef.current = live;
      setWalkDurationMs(0);
      setWalkPos(live);
    } else if (phase === 'walking_to_custom' || phase === 'returning_to_last') {
      const live = getLivePos();
      currentPosRef.current = live;
      setWalkDurationMs(0);
      setWalkPos(live);
    } else {
      setWalkDurationMs(0);
    }

    customDestRef.current = { x: walkTarget.x, y: walkTarget.y };
    setPhase('walking_to_custom');
  }, [walkTarget]);

  useEffect(() => {
    if (phase === 'performing') {
      if (walkTarget && walkTarget.seq === handledSeqRef.current) return;
      lastActivityRef.current = activity;
      currentPosRef.current = PERFORM_POS[activity];
      segDurationRef.current = 0;
      const dwellMs =
        MIN_DWELL_MS + Math.random() * (MAX_DWELL_MS - MIN_DWELL_MS);
      const timerId = window.setTimeout(() => {
        const candidates = ACTIVITIES.filter((item) => item !== activity);
        const next = candidates[Math.floor(Math.random() * candidates.length)];
        setTargetActivity(next);
        currentPosRef.current = STAND_POS[activity];
        setWalkDurationMs(0);
        setWalkPos(STAND_POS[activity]);
        setPhase('walking_to_target');
      }, dwellMs);

      return () => window.clearTimeout(timerId);
    }

    if (phase === 'custom_idle') {
      segDurationRef.current = 0;
      const timerId = window.setTimeout(() => {
        setPhase('returning_to_last');
      }, CUSTOM_IDLE_FALLBACK_MS);

      return () => window.clearTimeout(timerId);
    }

    // Shared multi-waypoint obstacle-avoiding path runner
    let destination: RoomPoint;
    let onArrival: () => void;

    if (phase === 'walking_to_custom') {
      destination = customDestRef.current;
      onArrival = () => setPhase('custom_idle');
    } else if (phase === 'returning_to_last') {
      const lastAct = lastActivityRef.current;
      destination = STAND_POS[lastAct];
      onArrival = () => {
        currentPosRef.current = PERFORM_POS[lastAct];
        setActivity(lastAct);
        setTargetActivity(lastAct);
        setPhase('performing');
      };
    } else {
      destination = STAND_POS[targetActivity];
      onArrival = () => {
        currentPosRef.current = PERFORM_POS[targetActivity];
        setActivity(targetActivity);
        setPhase('performing');
      };
    }

    const waypoints = findRoomPath(currentPosRef.current, destination);
    let stepIndex = 0;
    let rafOuterId = 0;
    let rafInnerId = 0;
    let timerId = 0;
    let cancelled = false;

    const runNextSegment = () => {
      if (cancelled) return;
      const from = currentPosRef.current;
      const to = waypoints[stepIndex];
      const isLast = stepIndex === waypoints.length - 1;
      const { durationMs, yawDeg } = getWalkMetrics(from, to, yawRef.current);

      yawRef.current = yawDeg;
      setWalkYawDeg(yawDeg);

      rafOuterId = window.requestAnimationFrame(() => {
        rafInnerId = window.requestAnimationFrame(() => {
          if (cancelled) return;
          segStartRef.current = from;
          segEndRef.current = to;
          segStartTimeRef.current = performance.now();
          segDurationRef.current = durationMs;
          currentPosRef.current = to;

          setWalkDurationMs(durationMs);
          setWalkEasing(isLast ? 'cubic-bezier(0.25, 0.1, 0.25, 1)' : 'linear');
          setWalkPos(to);

          timerId = window.setTimeout(
            () => {
              if (cancelled) return;
              if (isLast) {
                onArrival();
              } else {
                stepIndex += 1;
                runNextSegment();
              }
            },
            isLast ? durationMs + 30 : durationMs,
          );
        });
      });
    };

    runNextSegment();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafOuterId);
      if (rafInnerId) window.cancelAnimationFrame(rafInnerId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, [phase, activity, targetActivity, walkTarget?.seq]);

  const isWalking =
    phase === 'walking_to_target' ||
    phase === 'walking_to_custom' ||
    phase === 'returning_to_last';
  const isCustomIdle = phase === 'custom_idle';
  const anchorPos = isWalking || isCustomIdle ? walkPos : PERFORM_POS[activity];
  const charStyle = {
    '--char-x': `${anchorPos.x}px`,
    '--char-y': `${anchorPos.y}px`,
    '--walk-duration': `${walkDurationMs}ms`,
    '--walk-easing': walkEasing,
    '--char-yaw': `${walkYawDeg}deg`,
  } as CSSProperties;

  return (
    <div
      key={isWalking || isCustomIdle ? 'dynamic-rig' : `perform-${activity}`}
      className={`iso-character ${
        isWalking ? 'is-walking' : isCustomIdle ? 'is-custom-idle' : `is-${activity}`
      }`}
      style={charStyle}
      aria-hidden="true"
    >
      {(isWalking || isCustomIdle) && (
        <div className="char-turn-rig">
          <div className="char-shadow" />
          <div className="char-body-bob">
            {/* Forward-pointing shoes (+y bias) & trousers */}
            <div className="char-limb char-limb-left char-leg">
              <CharBox x={-10} y={-4} z={1} w={8} d={11} h={6} className="box-char-shoe" />
              <CharBox x={-10} y={-4} z={7} w={8} d={8} h={35} className="box-char-pants" />
            </div>
            <div className="char-limb char-limb-right char-leg">
              <CharBox x={2} y={-4} z={1} w={8} d={11} h={6} className="box-char-shoe" />
              <CharBox x={2} y={-4} z={7} w={8} d={8} h={35} className="box-char-pants" />
            </div>
            <CharacterTorso z={44} h={32} />
            <div className="char-limb char-limb-right char-arm">
              <CharBox x={-18} y={-4} z={47} w={6} d={8} h={28} className="box-char-shirt" />
              <CharBox x={-17} y={-3} z={42} w={4} d={6} h={5} className="box-char-skin" />
            </div>
            <div className="char-limb char-limb-left char-arm">
              <CharBox x={12} y={-4} z={47} w={6} d={8} h={28} className="box-char-shirt" />
              <CharBox x={13} y={-3} z={42} w={4} d={6} h={5} className="box-char-skin" />
            </div>
            <div className="char-limb char-head-idle">
              <CharacterHead baseZ={80} />
            </div>
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'desktop' && (
        <div className="char-pose-back">
          <CharBox x={-12} y={-5} z={37} w={24} d={22} h={9} className="box-char-pants" />
          <CharBox x={-10} y={9} z={7} w={8} d={8} h={30} className="box-char-pants" />
          <CharBox x={-10} y={9} z={1} w={8} d={11} h={6} className="box-char-shoe" />
          <CharBox x={2} y={9} z={7} w={8} d={8} h={30} className="box-char-pants" />
          <CharBox x={2} y={9} z={1} w={8} d={11} h={6} className="box-char-shoe" />
          {/* Seated torso facing desk monitor (-Y via char-pose-back) */}
          <CharacterTorso z={48} h={36} />
          <div className="char-limb char-typing-left">
            <CharBox x={-17} y={2} z={76} w={6} d={21} h={7} className="box-char-shirt" />
            <CharBox x={-16} y={23} z={77} w={4} d={5} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-typing-right">
            <CharBox x={11} y={2} z={76} w={6} d={21} h={7} className="box-char-shirt" />
            <CharBox x={12} y={23} z={77} w={4} d={5} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-head-work">
            <CharacterHead baseZ={87} />
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'bookshelf' && (
        <div className="char-pose-north">
          <div className="char-shadow" />
          <StandingLegs />
          <CharacterTorso z={44} h={32} />
          {/* Chest-level forearms + hands holding diagnostic tablet toward wall monitor */}
          <CharBox x={-17} y={4} z={62} w={6} d={16} h={7} className="box-char-shirt" />
          <CharBox x={-16} y={19} z={63} w={4} d={5} h={5} className="box-char-skin" />
          <CharBox x={11} y={4} z={62} w={6} d={16} h={7} className="box-char-shirt" />
          <CharBox x={12} y={19} z={63} w={4} d={5} h={5} className="box-char-skin" />
          <div className="char-limb char-prop-book">
            <CharBox x={-11} y={18} z={66} w={22} d={10} h={3} className="box-char-phone" />
          </div>
          <div className="char-limb char-head-read">
            <CharacterHead baseZ={80} />
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'coffee_table' && (
        <div className="char-pose-west">
          <div className="char-shadow" />
          <StandingLegs />
          <CharacterTorso z={44} h={32} />
          <div className="char-limb char-table-arms">
            <CharBox x={-17} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <CharBox x={-16} y={18} z={62} w={4} d={5} h={5} className="box-char-skin" />
            <CharBox x={11} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <CharBox x={12} y={18} z={62} w={4} d={5} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-head-read">
            <CharacterHead baseZ={80} />
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'bed' && (
        <div className="char-pose-east">
          <div className="char-shadow" />
          <StandingLegs />
          <CharacterTorso z={44} h={32} />
          <div className="char-limb char-gaming-rig">
            <CharBox x={-17} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <CharBox x={-16} y={18} z={62} w={4} d={5} h={5} className="box-char-skin" />
            <CharBox x={11} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <CharBox x={12} y={18} z={62} w={4} d={5} h={5} className="box-char-skin" />
            <CharBox x={-10} y={18} z={65} w={20} d={9} h={3} className="box-char-phone" />
          </div>
          <div className="char-limb char-head-work">
            <CharacterHead baseZ={80} />
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'window' && (
        <>
          <div className="char-pose-east">
            <div className="char-shadow" />
            <StandingLegs />
            <CharacterTorso z={44} h={32} />
            <CharBox x={-18} y={-4} z={47} w={6} d={8} h={28} className="box-char-shirt" />
            <CharBox x={-17} y={-3} z={42} w={4} d={6} h={5} className="box-char-skin" />
            <CharBox x={12} y={-4} z={47} w={6} d={8} h={28} className="box-char-shirt" />
            <CharBox x={13} y={-3} z={42} w={4} d={6} h={5} className="box-char-skin" />
            <div className="char-limb char-head-gaze">
              <CharacterHead baseZ={80} />
            </div>
          </div>
          {/* Subtle floating cloudy thought bubble kept unrotated toward camera */}
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
