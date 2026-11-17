import { useEffect } from 'react';
import type { ProfileData } from '../data/profile';

interface HeaderProps {
  profile: ProfileData;
}

function toggleColorScheme() {
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="color-scheme"]',
  );
  if (!meta) return;

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemScheme = systemDark ? 'dark' : 'light';

  let stored: string | null = null;
  try {
    stored = localStorage.getItem('color-scheme');
  } catch {}

  const currentRendered =
    stored === 'dark' || stored === 'light' ? stored : systemScheme;
  const target = currentRendered === 'dark' ? 'light' : 'dark';

  try {
    if (target !== systemScheme) {
      localStorage.setItem('color-scheme', target);
      meta.content = target;
    } else {
      localStorage.removeItem('color-scheme');
      meta.content = 'light dark';
    }
  } catch {
    meta.content = target !== systemScheme ? target : 'light dark';
  }
}

export function Header({ profile }: HeaderProps) {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'color-scheme') return;
      const meta = document.querySelector<HTMLMetaElement>(
        'meta[name="color-scheme"]',
      );
      if (!meta) return;
      meta.content = event.newValue ?? 'light dark';
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const avatarUrl = profile.avatarUrl?.trim() ?? '';
  const initials = profile.shortName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <header className="corner-header">
      <div className="header-identity">
        <div className="header-avatar" aria-hidden={avatarUrl ? undefined : 'true'}>
          {avatarUrl ? (
            <img className="header-avatar-img" src={avatarUrl} alt={profile.name} />
          ) : (
            <span className="header-avatar-fallback">{initials}</span>
          )}
        </div>
        <div className="header-identity-text">
          <h1 id="main-content" tabIndex={-1} className="corner-title">
            {profile.name}
          </h1>
          <p className="corner-role">
            <span className="role-dot" aria-hidden="true" />
            <span>{profile.role}</span>
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="lighting-toggle"
          onClick={toggleColorScheme}
          aria-label="Toggle visual theme"
        >
          <span className="if-light">
            <span className="toggle-symbol" aria-hidden="true">☾</span>{' '}
            <span>Night Lamp</span>
            <span className="visually-hidden">(switch to dark theme)</span>
          </span>
          <span className="if-dark">
            <span className="toggle-symbol" aria-hidden="true">☀</span>{' '}
            <span>Daylight</span>
            <span className="visually-hidden">(switch to light theme)</span>
          </span>
        </button>
      </div>
    </header>
  );
}
