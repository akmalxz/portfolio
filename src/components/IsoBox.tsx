import type { CSSProperties, ReactNode } from 'react';

interface IsoBoxProps {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  className?: string;
  style?: CSSProperties;
  topContent?: ReactNode;
  frontContent?: ReactNode;
  leftContent?: ReactNode;
  ariaHidden?: boolean;
}

export function IsoBox({
  x,
  y,
  z,
  w,
  d,
  h,
  className = '',
  style,
  topContent,
  frontContent,
  leftContent,
  ariaHidden = true,
}: IsoBoxProps) {
  const boxVars = {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--z': `${z}px`,
    '--w': `${w}px`,
    '--d': `${d}px`,
    '--h': `${h}px`,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`iso-box ${className}`.trim()}
      style={boxVars}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      <div className="iso-face iso-face-top">{topContent}</div>
      <div className="iso-face iso-face-front">{frontContent}</div>
      <div className="iso-face iso-face-left">{leftContent}</div>
    </div>
  );
}
