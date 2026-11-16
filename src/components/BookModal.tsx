import { useEffect, useId, useState } from 'react';
import type { BookEntry } from '../types/library';
import { DialogFrame, ModalDialog } from './ModalDialog';

interface BookModalProps {
  /** Entry the visitor clicked — opened selected in the workbench */
  book: BookEntry | null;
  books: BookEntry[];
  onClose: () => void;
}

function EntryDetailCanvas({ entry }: { entry: BookEntry }) {
  return (
    <div className="workbench-detail" data-tone={entry.tone}>
      <div className="workbench-hero">
        <div className="workbench-hero-meta">
          <span className="workbench-code-pill">{entry.callNumber}</span>
          <span className="workbench-period-pill">{entry.period}</span>
        </div>
        <h3 className="workbench-title">{entry.title}</h3>
        <p className="workbench-subtitle">{entry.subtitle}</p>
        <p className="workbench-summary">{entry.summary}</p>
      </div>

      {entry.metrics && entry.metrics.length > 0 && (
        <ul className="entry-metrics workbench-metrics" role="list" aria-label="Key impact">
          {entry.metrics.map((metric) => (
            <li key={metric.label} className="entry-metric">
              <span className="metric-value">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.pipeline && entry.pipeline.length > 0 && (
        <div className="entry-arch-block">
          <h4 className="dialog-subheading">System Architecture Pipeline</h4>
          <ol
            className="entry-pipeline"
            role="list"
            aria-label="System architecture pipeline"
          >
            {entry.pipeline.map((node, index) => (
              <li key={node.stage} className="pipeline-step">
                <div className="pipeline-node">
                  <span className="pipeline-index">0{index + 1}</span>
                  <span className="pipeline-stage">{node.stage}</span>
                  <span className="pipeline-detail">{node.detail}</span>
                </div>
                {index < entry.pipeline!.length - 1 && (
                  <span className="pipeline-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="workbench-lower-grid">
        {entry.tradeoff && (
          <div
            className="workbench-tradeoff-col"
            role="group"
            aria-label="Engineering challenge and fix"
          >
            <h4 className="dialog-subheading">Challenge &amp; Fix</h4>
            <div className="entry-tradeoff is-stacked">
              <div className="tradeoff-col is-bottleneck">
                <span className="tradeoff-badge is-bottleneck">Bottleneck</span>
                <p className="tradeoff-text">{entry.tradeoff.bottleneck}</p>
              </div>
              <div className="tradeoff-col is-decision">
                <span className="tradeoff-badge is-decision">Engineering Fix</span>
                <p className="tradeoff-text">{entry.tradeoff.decision}</p>
              </div>
            </div>
          </div>
        )}

        <div className="workbench-highlights-col">
          <h4 className="dialog-subheading">Highlights</h4>
          <ul className="dialog-highlights">
            {entry.highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4 className="dialog-subheading">Stack &amp; Methods</h4>
          <ul className="dialog-tags" role="list">
            {entry.tags.map((tag) => (
              <li key={tag} className="dialog-tag">
                {tag}
              </li>
            ))}
          </ul>

          {entry.links && entry.links.length > 0 && (
            <ul className="dialog-links" role="list">
              {entry.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectWorkbench({ focus, entries }: { focus: BookEntry; entries: BookEntry[] }) {
  const [selectedId, setSelectedId] = useState<string>(focus.id);
  const activeEntry = entries.find((entry) => entry.id === selectedId) ?? entries[0];

  useEffect(() => {
    setSelectedId(focus.id);
  }, [focus.id]);

  if (!activeEntry) return null;

  return (
    <div className="project-workbench">
      {/* Left Sidebar: 1-Click Project Selector */}
      <nav className="workbench-sidebar" aria-label="Key projects">
        <ul className="workbench-list" role="list">
          {entries.map((entry) => {
            const isSelected = entry.id === activeEntry.id;
            const heroMetric = entry.metrics?.[0];
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  className={`workbench-item ${isSelected ? 'is-selected' : ''}`}
                  data-tone={entry.tone}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <span className="workbench-item-top">
                    <span className="workbench-item-code">{entry.callNumber}</span>
                    <span className="workbench-item-period">{entry.period}</span>
                  </span>
                  <span className="workbench-item-title">{entry.title}</span>
                  {heroMetric && (
                    <span className="workbench-item-kpi">
                      <strong>{heroMetric.value}</strong> {heroMetric.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Right Detail Canvas: Case Study Breakdown */}
      <EntryDetailCanvas entry={activeEntry} />
    </div>
  );
}

function ExperienceWorkbench({ focus, entries }: { focus: BookEntry; entries: BookEntry[] }) {
  // Order chronologically left-to-right so the latest/current role sits on the right
  const chronological = [...entries].reverse();
  const [selectedId, setSelectedId] = useState<string>(focus.id);
  const activeIndex = Math.max(
    0,
    chronological.findIndex((entry) => entry.id === selectedId),
  );
  const activeEntry = chronological[activeIndex] ?? chronological[chronological.length - 1];

  useEffect(() => {
    setSelectedId(focus.id);
  }, [focus.id]);

  if (!activeEntry) return null;

  const progressPercent = ((activeIndex + 0.5) / Math.max(1, chronological.length)) * 100;

  return (
    <div className="experience-workbench">
      {/* Big Interactive Career Timeline */}
      <nav className="exp-timeline-bar" aria-label="Work experience timeline">
        <div className="exp-timeline-rail" aria-hidden="true">
          <div
            className="exp-timeline-fill"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="exp-timeline-runner"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        <ol className="exp-timeline-nodes" role="list">
          {chronological.map((entry, idx) => {
            const isSelected = entry.id === activeEntry.id;
            const isPassed = idx <= activeIndex;
            const heroMetric = entry.metrics?.[0];
            return (
              <li key={entry.id} className="exp-timeline-step">
                <button
                  type="button"
                  className={`exp-timeline-node ${isSelected ? 'is-selected' : ''} ${isPassed ? 'is-passed' : ''}`}
                  data-tone={entry.tone}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <span className="exp-node-marker" aria-hidden="true">
                    <span className="exp-node-core" />
                  </span>
                  <span className="exp-node-card">
                    <span className="exp-role-top">
                      <span className="exp-role-code">{entry.callNumber}</span>
                      <span className="exp-role-period">{entry.period}</span>
                    </span>
                    <span className="exp-role-title">{entry.title}</span>
                    <span className="exp-role-sub">
                      {entry.subtitle}
                      {heroMetric ? ` · ${heroMetric.value} ${heroMetric.label}` : ''}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Main Role Breakdown Canvas with Transition */}
      <div key={activeEntry.id} className="exp-detail-transition">
        <EntryDetailCanvas entry={activeEntry} />
      </div>
    </div>
  );
}

export function BookModal({ book, books, onClose }: BookModalProps) {
  const titleId = useId();
  const isProject = book?.category === 'project';
  const entries = book ? books.filter((b) => b.category === book.category) : [];

  const summary = isProject
    ? `${entries.length} builds spanning national-scale analytics, geospatial RAG and automation.`
    : `${entries.length} roles across national data engineering and ML research.`;

  return (
    <ModalDialog
      open={book !== null}
      labelledBy={titleId}
      onClose={onClose}
      className="room-dialog-wide"
    >
      {book && (
        <DialogFrame
          titleId={titleId}
          eyebrow={isProject ? 'Pipeline Telemetry · Key Projects' : 'Production Clusters · Experience'}
          title={isProject ? 'Key Projects' : 'Work Experience'}
          summary={summary}
        >
          {isProject ? (
            <ProjectWorkbench key={book.id} focus={book} entries={entries} />
          ) : (
            <ExperienceWorkbench key={book.id} focus={book} entries={entries} />
          )}
        </DialogFrame>
      )}
    </ModalDialog>
  );
}
