import { useEffect, useId, useState, type ReactNode } from 'react';
import type { ProfileData } from '../data/profile';
import { DialogFrame, ModalDialog } from './ModalDialog';

export type RoomSectionTab = 'skills' | 'education' | 'publications' | 'contact';

interface PcModalProps {
  activeTab: RoomSectionTab | null;
  profile: ProfileData;
  onClose: () => void;
}

/** Name variants used for the author across citation styles */
const SELF_AUTHOR_PATTERN =
  /(Ahmad Asmawi, M\. A\. H\.|Asmawi, M\. A\. H\. A\.)/;

function highlightSelf(authors: string): ReactNode {
  return authors.split(SELF_AUTHOR_PATTERN).map((part, index) =>
    SELF_AUTHOR_PATTERN.test(part) ? (
      <strong key={index} className="pub-self">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/** "Python (Pandas, GeoPandas)" → primary "Python", detail "Pandas, GeoPandas" */
function splitSkill(item: string) {
  const match = item.match(/^(.*?)\s*\((.*)\)$/);
  return match ? { primary: match[1], detail: match[2] } : { primary: item };
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      className={`copy-btn ${copied ? 'is-copied' : ''}`}
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
    >
      <span aria-hidden="true">{copied ? '✓' : '⧉'}</span>
      <span className="copy-btn-text" aria-live="polite">
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}

export function PcModal({ activeTab, profile, onClose }: PcModalProps) {
  const titleId = useId();

  const journals = profile.publications.filter((p) => p.type === 'Journal').length;
  const conferences = profile.publications.length - journals;

  const meta: Record<RoomSectionTab, { eyebrow: string; title: string; summary: string }> = {
    skills: {
      eyebrow: 'Holotable',
      title: 'Tech Stack',
      summary: profile.role,
    },
    education: {
      eyebrow: 'Server 01',
      title: 'Education',
      summary: `${profile.education.length} degrees · ${profile.education[0]?.institution ?? ''}`,
    },
    publications: {
      eyebrow: 'Server 02',
      title: 'Academic Publications',
      summary: `${profile.publications.length} peer-reviewed papers · ${journals} journal, ${conferences} conference`,
    },
    contact: {
      eyebrow: 'Server 04',
      title: 'Contact & References',
      summary: 'Open to data engineering and AI roles — reach out directly.',
    },
  };

  const current = activeTab ? meta[activeTab] : meta.skills;

  const contactChannels = [
    {
      kind: 'Email',
      icon: '✉',
      value: profile.email,
      href: `mailto:${profile.email}`,
      external: false,
    },
    {
      kind: 'Phone',
      icon: '☏',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s+/g, '')}`,
      external: false,
    },
    {
      kind: 'LinkedIn',
      icon: 'in',
      value: profile.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      href: profile.linkedin,
      external: true,
    },
  ];

  return (
    <ModalDialog
      open={activeTab !== null}
      labelledBy={titleId}
      onClose={onClose}
      className={activeTab === 'education' ? 'room-dialog-editorial' : undefined}
    >
      {activeTab && (
        <DialogFrame
          titleId={titleId}
          eyebrow={current.eyebrow}
          title={current.title}
          summary={current.summary}
        >
          {activeTab === 'skills' && (
            <>
              <div className="dialog-prose">
                {profile.aboutBody.map((paragraph, index) => (
                  <p key={index} className="dialog-summary">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="skill-groups-grid">
                {profile.skillGroups.map((group) => (
                  <section key={group.category} className="skill-group-card">
                    <h3 className="dialog-subheading">{group.category}</h3>
                    <ul className="dialog-tags" role="list">
                      {group.items.map((item) => {
                        const { primary, detail } = splitSkill(item);
                        return (
                          <li key={item} className="dialog-tag" title={detail}>
                            {primary}
                            {detail && <span className="tag-detail">{detail}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}

          {activeTab === 'education' && (
            <ol className="edu-timeline" role="list">
              {profile.education.map((edu, idx) => {
                const thesisHref = edu.thesisUrl?.trim() ?? '';
                const hasThesisUrl = thesisHref.length > 0;
                const thesisLabel = edu.thesisTitle?.trim() || 'Online Master Thesis';

                return (
                  <li key={edu.degree} className="edu-entry">
                    <span
                      className={`edu-dot ${idx === 0 ? 'is-latest' : ''}`}
                      aria-hidden="true"
                    />
                    <div className="edu-body">
                      <p className="case-meta">
                        <span>{edu.period}</span>
                        <span aria-hidden="true">·</span>
                        <span>{edu.institution}</span>
                      </p>
                      <h3 className="edu-degree">{edu.degree}</h3>
                      <div className="edu-meta-row">
                        <div
                          className={`case-tradeoff-item ${idx === 0 ? 'is-solution' : ''}`}
                        >
                          <span className="case-section-title">Standing</span>
                          <p className="case-prose">{edu.highlight}</p>
                        </div>
                      </div>
                      {hasThesisUrl && (
                        <div className="edu-thesis-row">
                          <a
                            className="edu-thesis-link"
                            href={thesisHref}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{thesisLabel}</span>
                            <span aria-hidden="true">↗</span>
                            <span className="visually-hidden"> (opens in new tab)</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {activeTab === 'publications' && (
            <ol className="pub-list" role="list">
              {profile.publications.map((pub, idx) => {
                const href = pub.url?.trim() ?? '';
                const hasUrl = href.length > 0;
                const content = (
                  <>
                    <span className="pub-index" aria-hidden="true">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="pub-body">
                      <div className="pub-top">
                        <span className={`pub-type pub-type-${pub.type.toLowerCase()}`}>
                          {pub.type}
                        </span>
                        {hasUrl && (
                          <span className="pub-external" aria-hidden="true">
                            Read paper ↗
                          </span>
                        )}
                      </div>
                      <p className="pub-title">
                        {pub.title}
                        {hasUrl && (
                          <span className="visually-hidden"> (opens in new tab)</span>
                        )}
                      </p>
                      <p className="pub-venue">{pub.venue}</p>
                      <p className="pub-authors">{highlightSelf(pub.authors)}</p>
                    </div>
                  </>
                );

                return (
                  <li key={pub.title} className="pub-item">
                    {hasUrl ? (
                      <a
                        className="pub-link"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="pub-static">{content}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {activeTab === 'contact' && (
            <>
              <ul className="contact-grid" role="list">
                {contactChannels.map((channel) => (
                  <li key={channel.kind} className="contact-tile">
                    <a
                      className="contact-link"
                      href={channel.href}
                      {...(channel.external
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      <span className="contact-icon" aria-hidden="true">
                        {channel.icon}
                      </span>
                      <span className="contact-text">
                        <span className="contact-kind">
                          {channel.kind}
                          {channel.external && (
                            <span aria-hidden="true"> ↗</span>
                          )}
                          {channel.external && (
                            <span className="visually-hidden"> (opens in new tab)</span>
                          )}
                        </span>
                        <span className="contact-value">{channel.value}</span>
                      </span>
                    </a>
                    <CopyButton value={channel.value} label={channel.kind} />
                  </li>
                ))}
              </ul>

              <section>
                <h3 className="dialog-subheading">References</h3>
                <ul className="reference-grid" role="list">
                  {profile.references.map((ref) => (
                    <li key={ref.email} className="reference-card">
                      <p className="entry-title">{ref.name}</p>
                      <p className="entry-subtitle">{ref.role}</p>
                      <p className="reference-org">{ref.organization}</p>
                      <div className="reference-actions">
                        <a href={`mailto:${ref.email}`} className="info-card-link">
                          {ref.email}
                        </a>
                        <CopyButton value={ref.email} label={`${ref.name} email`} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </DialogFrame>
      )}
    </ModalDialog>
  );
}
