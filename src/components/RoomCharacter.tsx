import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { IsoBox } from './IsoBox';

export type CharacterActivity =
  | 'desktop'
  | 'bookshelf'
  | 'coffee_table'
  | 'bed'
  | 'window';

type CharacterPhase =
  | 'performing'
  | 'walking_to_hub'
  | 'walking_to_target'
  | 'walking_to_custom'
  | 'custom_idle'
  | 'returning_to_last';

export interface RoomPoint {
  x: number;
  y: number;
}

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

const HUB_POS: RoomPoint = { x: 300, y: 156 };

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

function CharacterHead({
  baseZ = 80,
  faceDirection = 'front',
  children,
}: {
  baseZ?: number;
  faceDirection?: 'front' | 'back';
  children?: React.ReactNode;
}) {
  const faceContent = (
    <div className="char-face-features" aria-hidden="true">
      <span className="char-eye" />
      <span className="char-eye" />
    </div>
  );

  return (
    <>
      {/* Neck connecting shoulders to head (prevents floating head gap) */}
      <IsoBox x={-3} y={-3} z={baseZ - 4} w={6} d={6} h={5} className="box-char-skin" />
      {/* Head + minimalist glasses/eyes on the facing side */}
      <IsoBox
        x={-8}
        y={-8}
        z={baseZ}
        w={16}
        d={15}
        h={16}
        className="box-char-skin"
        frontContent={faceDirection === 'front' ? faceContent : undefined}
      />
      {/* Clean non-overlapping top & back/side hair */}
      <IsoBox x={-9} y={-9} z={baseZ + 16} w={18} d={17} h={5} className="box-char-hair" />
      {faceDirection === 'front' ? (
        <IsoBox x={-9} y={-10} z={baseZ + 2} w={18} d={2} h={14} className="box-char-hair" />
      ) : (
        <IsoBox x={-9} y={7} z={baseZ + 2} w={18} d={3} h={14} className="box-char-hair" />
      )}
      {children}
    </>
  );
}

function CharacterTorso({ z = 44, h = 34 }: { z?: number; h?: number }) {
  return (
    <>
      {/* Shirt torso with collar accent & engineer ID lanyard */}
      <IsoBox
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
      />
      {/* Waistband/belt separating torso and trousers */}
      <IsoBox x={-12} y={-7} z={z - 2} w={24} d={14} h={2} className="box-char-belt" />
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
  const [walkYawDeg, setWalkYawDeg] = useState<number>(0);

  const currentPosRef = useRef<RoomPoint>(STAND_POS.window);
  const lastActivityRef = useRef<CharacterActivity>('window');
  const walkDurationRef = useRef<number>(950);
  const yawRef = useRef<number>(-90);
  const customSeqRef = useRef<number>(0);

  const startWalkTo = (destination: RoomPoint) => {
    const from = currentPosRef.current;
    const { durationMs, yawDeg } = getWalkMetrics(from, destination, yawRef.current);
    walkDurationRef.current = durationMs;
    yawRef.current = yawDeg;
    setWalkDurationMs(durationMs);
    setWalkYawDeg(yawDeg);

    let rafInnerId = 0;
    const rafOuterId = window.requestAnimationFrame(() => {
      rafInnerId = window.requestAnimationFrame(() => {
        currentPosRef.current = destination;
        setWalkPos(destination);
      });
    });

    return {
      durationMs,
      cancelRaf: () => {
        window.cancelAnimationFrame(rafOuterId);
        if (rafInnerId) window.cancelAnimationFrame(rafInnerId);
      },
    };
  };

  // Handle user click-to-move anywhere in the room
  useEffect(() => {
    if (!walkTarget) return;
    customSeqRef.current = walkTarget.seq;
    if (phase === 'performing') {
      lastActivityRef.current = activity;
      currentPosRef.current = STAND_POS[activity];
      setWalkPos(STAND_POS[activity]);
    } else if (phase === 'walking_to_hub' || phase === 'walking_to_target') {
      lastActivityRef.current = targetActivity;
    }

    const destination = { x: walkTarget.x, y: walkTarget.y };
    const { durationMs, yawDeg } = getWalkMetrics(
      currentPosRef.current,
      destination,
      yawRef.current,
    );
    walkDurationRef.current = durationMs;
    yawRef.current = yawDeg;
    setWalkDurationMs(durationMs);
    setWalkYawDeg(yawDeg);
    setPhase('walking_to_custom');

    let rafInner = 0;
    const rafOuter = window.requestAnimationFrame(() => {
      rafInner = window.requestAnimationFrame(() => {
        currentPosRef.current = destination;
        setWalkPos(destination);
      });
    });

    return () => {
      window.cancelAnimationFrame(rafOuter);
      if (rafInner) window.cancelAnimationFrame(rafInner);
    };
  }, [walkTarget]);

  useEffect(() => {
    if (phase === 'performing') {
      lastActivityRef.current = activity;
      currentPosRef.current = PERFORM_POS[activity];
      const dwellMs =
        MIN_DWELL_MS + Math.random() * (MAX_DWELL_MS - MIN_DWELL_MS);
      const timerId = window.setTimeout(() => {
        const candidates = ACTIVITIES.filter((item) => item !== activity);
        const next = candidates[Math.floor(Math.random() * candidates.length)];
        setTargetActivity(next);
        currentPosRef.current = STAND_POS[activity];
        setWalkPos(STAND_POS[activity]);
        setPhase('walking_to_hub');
      }, dwellMs);

      return () => window.clearTimeout(timerId);
    }

    if (phase === 'walking_to_custom') {
      const timerId = window.setTimeout(() => {
        setPhase('custom_idle');
      }, walkDurationRef.current + 30);

      return () => window.clearTimeout(timerId);
    }

    if (phase === 'custom_idle') {
      const timerId = window.setTimeout(() => {
        setPhase('returning_to_last');
      }, CUSTOM_IDLE_FALLBACK_MS);

      return () => window.clearTimeout(timerId);
    }

    if (phase === 'returning_to_last') {
      const lastAct = lastActivityRef.current;
      const { durationMs, cancelRaf } = startWalkTo(STAND_POS[lastAct]);
      const timerId = window.setTimeout(() => {
        currentPosRef.current = PERFORM_POS[lastAct];
        setActivity(lastAct);
        setTargetActivity(lastAct);
        setPhase('performing');
      }, durationMs + 30);

      return () => {
        cancelRaf();
        window.clearTimeout(timerId);
      };
    }

    if (phase === 'walking_to_hub') {
      const { durationMs, cancelRaf } = startWalkTo(HUB_POS);
      const timerId = window.setTimeout(() => {
        setPhase('walking_to_target');
      }, durationMs + 30);

      return () => {
        cancelRaf();
        window.clearTimeout(timerId);
      };
    }

    // walking_to_target
    const { durationMs, cancelRaf } = startWalkTo(STAND_POS[targetActivity]);
    const timerId = window.setTimeout(() => {
      currentPosRef.current = PERFORM_POS[targetActivity];
      setActivity(targetActivity);
      setPhase('performing');
    }, durationMs + 30);

    return () => {
      cancelRaf();
      window.clearTimeout(timerId);
    };
  }, [phase, activity, targetActivity, walkTarget?.seq]);

  const isWalking =
    phase === 'walking_to_hub' ||
    phase === 'walking_to_target' ||
    phase === 'walking_to_custom' ||
    phase === 'returning_to_last';
  const isCustomIdle = phase === 'custom_idle';
  const anchorPos = isWalking || isCustomIdle ? walkPos : PERFORM_POS[activity];
  const charStyle = {
    '--char-x': `${anchorPos.x}px`,
    '--char-y': `${anchorPos.y}px`,
    '--walk-duration': `${walkDurationMs}ms`,
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
              <IsoBox x={-10} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
              <IsoBox x={-10} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
            </div>
            <div className="char-limb char-limb-right char-leg">
              <IsoBox x={2} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
              <IsoBox x={2} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
            </div>
            <CharacterTorso z={44} h={32} />
            <div className="char-limb char-limb-right char-arm">
              <IsoBox x={-18} y={-4} z={47} w={6} d={9} h={28} className="box-char-shirt" />
              <IsoBox x={-17} y={-3} z={42} w={5} d={7} h={5} className="box-char-skin" />
            </div>
            <div className="char-limb char-limb-left char-arm">
              <IsoBox x={12} y={-4} z={47} w={6} d={9} h={28} className="box-char-shirt" />
              <IsoBox x={12} y={-3} z={42} w={5} d={7} h={5} className="box-char-skin" />
            </div>
            <div className="char-limb char-head-idle">
              <CharacterHead baseZ={80} faceDirection="front" />
            </div>
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'desktop' && (
        <>
          <IsoBox x={-12} y={-20} z={37} w={24} d={24} h={9} className="box-char-pants" />
          <IsoBox x={-10} y={-22} z={8} w={8} d={8} h={29} className="box-char-pants" />
          <IsoBox x={-10} y={-25} z={3} w={8} d={11} h={5} className="box-char-shoe" />
          <IsoBox x={2} y={-22} z={8} w={8} d={8} h={29} className="box-char-pants" />
          <IsoBox x={2} y={-25} z={3} w={8} d={11} h={5} className="box-char-shoe" />
          {/* Seated torso extended to connect shoulders smoothly to keyboard-height arms */}
          <CharacterTorso z={48} h={38} />
          <div className="char-limb char-typing-left">
            <IsoBox x={-16} y={-26} z={80} w={6} d={22} h={7} className="box-char-shirt" />
            <IsoBox x={-15} y={-31} z={81} w={5} d={6} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-typing-right">
            <IsoBox x={10} y={-26} z={80} w={6} d={22} h={7} className="box-char-shirt" />
            <IsoBox x={10} y={-31} z={81} w={5} d={6} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-head-work">
            <CharacterHead baseZ={89} faceDirection="back" />
          </div>
        </>
      )}

      {!isWalking && !isCustomIdle && activity === 'bookshelf' && (
        <div className="char-pose-north">
          <div className="char-shadow" />
          <IsoBox x={-10} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={-10} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <IsoBox x={2} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={2} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <CharacterTorso z={44} h={32} />
          {/* Chest-level forearms + hands holding diagnostic tablet toward wall monitor */}
          <IsoBox x={-17} y={4} z={62} w={6} d={16} h={7} className="box-char-shirt" />
          <IsoBox x={-16} y={18} z={63} w={5} d={5} h={5} className="box-char-skin" />
          <IsoBox x={11} y={4} z={62} w={6} d={16} h={7} className="box-char-shirt" />
          <IsoBox x={11} y={18} z={63} w={5} d={5} h={5} className="box-char-skin" />
          <div className="char-limb char-prop-book">
            <IsoBox x={-11} y={18} z={66} w={22} d={10} h={3} className="box-char-phone" />
          </div>
          <div className="char-limb char-head-read">
            <CharacterHead baseZ={80} faceDirection="front" />
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'coffee_table' && (
        <div className="char-pose-west">
          <div className="char-shadow" />
          <IsoBox x={-10} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={-10} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <IsoBox x={2} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={2} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <CharacterTorso z={44} h={32} />
          <div className="char-limb char-table-arms">
            <IsoBox x={-17} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <IsoBox x={-16} y={18} z={62} w={5} d={5} h={5} className="box-char-skin" />
            <IsoBox x={11} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <IsoBox x={11} y={18} z={62} w={5} d={5} h={5} className="box-char-skin" />
          </div>
          <div className="char-limb char-head-read">
            <CharacterHead baseZ={80} faceDirection="front" />
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'bed' && (
        <div className="char-pose-east">
          <div className="char-shadow" />
          <IsoBox x={-10} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={-10} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <IsoBox x={2} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
          <IsoBox x={2} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
          <CharacterTorso z={44} h={32} />
          <div className="char-limb char-gaming-rig">
            <IsoBox x={-17} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <IsoBox x={-16} y={18} z={62} w={5} d={5} h={5} className="box-char-skin" />
            <IsoBox x={11} y={4} z={61} w={6} d={15} h={7} className="box-char-shirt" />
            <IsoBox x={11} y={18} z={62} w={5} d={5} h={5} className="box-char-skin" />
            <IsoBox x={-10} y={18} z={65} w={20} d={9} h={3} className="box-char-phone" />
          </div>
          <div className="char-limb char-head-work">
            <CharacterHead baseZ={80} faceDirection="front" />
          </div>
        </div>
      )}

      {!isWalking && !isCustomIdle && activity === 'window' && (
        <>
          <div className="char-pose-east">
            <div className="char-shadow" />
            <IsoBox x={-10} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
            <IsoBox x={-10} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
            <IsoBox x={2} y={-4} z={0} w={8} d={12} h={6} className="box-char-shoe" />
            <IsoBox x={2} y={-4} z={6} w={8} d={9} h={36} className="box-char-pants" />
            <CharacterTorso z={44} h={32} />
            <IsoBox x={-18} y={-4} z={47} w={6} d={9} h={28} className="box-char-shirt" />
            <IsoBox x={-17} y={-3} z={42} w={5} d={7} h={5} className="box-char-skin" />
            <IsoBox x={12} y={-4} z={47} w={6} d={9} h={28} className="box-char-shirt" />
            <IsoBox x={12} y={-3} z={42} w={5} d={7} h={5} className="box-char-skin" />
            <div className="char-limb char-head-gaze">
              <CharacterHead baseZ={80} faceDirection="front" />
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
