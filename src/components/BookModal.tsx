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
    <article className="workbench-detail case-study">
      <header className="case-hero">
        <p className="case-meta">
          <span>{entry.period}</span>
          <span aria-hidden="true">·</span>
          <span>{entry.subtitle}</span>
        </p>
        <h3 className="case-title">{entry.title}</h3>
        <p className="case-summary">{entry.summary}</p>
      </header>

      {entry.metrics && entry.metrics.length > 0 && (
        <ul className="case-metrics" role="list" aria-label="Key impact">
          {entry.metrics.map((metric) => (
            <li key={metric.label} className="case-metric">
              <span className="case-metric-value">{metric.value}</span>
              <span className="case-metric-label">{metric.label}</span>
            </li>
          ))}
        </ul>
      )}

      {entry.pipeline && entry.pipeline.length > 0 && (
        <section className="case-section" aria-label="Architecture flow">
          <h4 className="case-section-title">Architecture</h4>
          <ol className="case-pipeline" role="list">
            {entry.pipeline.map((node, index) => (
              <li key={node.stage} className="case-pipeline-step">
                <span className="case-pipeline-dot" aria-hidden="true" />
                <span className="case-pipeline-num">0{index + 1}</span>
                <span className="case-pipeline-stage">{node.stage}</span>
                <span className="case-pipeline-detail">{node.detail}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {entry.tradeoff && (
        <section className="case-section" aria-label="Challenge and solution">
          <div className="case-tradeoff">
            <div className="case-tradeoff-item">
              <h4 className="case-section-title">Challenge</h4>
              <p className="case-prose">{entry.tradeoff.bottleneck}</p>
            </div>
            <div className="case-tradeoff-item is-solution">
              <h4 className="case-section-title">Approach</h4>
              <p className="case-prose">{entry.tradeoff.decision}</p>
            </div>
          </div>
        </section>
      )}

      <section className="case-section" aria-label="Key outcomes and stack">
        <h4 className="case-section-title">Key Details</h4>
        <ul className="case-highlights">
          {entry.highlights.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <ul className="case-tags" role="list" aria-label="Technologies used">
          {entry.tags.map((tag) => (
            <li key={tag} className="case-tag">
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
      </section>
    </article>
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
      {/* Left Editorial Index: Clean Borderless Project List */}
      <nav className="workbench-sidebar" aria-label="Key projects">
        <ul className="workbench-list" role="list">
          {entries.map((entry) => {
            const isSelected = entry.id === activeEntry.id;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  className={`workbench-item ${isSelected ? 'is-selected' : ''}`}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <span className="workbench-item-title">{entry.title}</span>
                  <span className="workbench-item-period">{entry.period}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Right Detail Canvas: Editorial Case Study */}
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
      {/* Clean Horizontal Career Timeline */}
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
            return (
              <li key={entry.id} className="exp-timeline-step">
                <button
                  type="button"
                  className={`exp-timeline-node ${isSelected ? 'is-selected' : ''} ${isPassed ? 'is-passed' : ''}`}
                  aria-current={isSelected ? 'true' : undefined}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <span className="exp-node-marker" aria-hidden="true">
                    <span className="exp-node-core" />
                  </span>
                  <span className="exp-node-card">
                    <span className="exp-role-period">{entry.period}</span>
                    <span className="exp-role-title">{entry.title}</span>
                    <span className="exp-role-sub">{entry.subtitle}</span>
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
          eyebrow={isProject ? 'Selected Work' : 'Career History'}
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
