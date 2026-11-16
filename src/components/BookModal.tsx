import { useEffect, useId, useRef, useState } from 'react';
import type { BookEntry } from '../types/library';
import { DialogFrame, ModalDialog } from './ModalDialog';

interface BookModalProps {
  /** Entry the visitor clicked — opened expanded and scrolled into view */
  book: BookEntry | null;
  books: BookEntry[];
  onClose: () => void;
}

interface EntryCardProps {
  entry: BookEntry;
  expanded: boolean;
  onToggle: () => void;
  focusRef?: React.Ref<HTMLLIElement>;
}

function EntryCard({ entry, expanded, onToggle, focusRef }: EntryCardProps) {
  const panelId = useId();

  return (
    <li
      ref={focusRef}
      className={`entry-card ${expanded ? 'is-expanded' : ''}`}
      data-tone={entry.tone}
    >
      <button
        type="button"
        className="entry-toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="entry-heading">
          <span className="entry-title">{entry.title}</span>
          <span className="entry-subtitle">{entry.subtitle}</span>
        </span>
        <span className="entry-side">
          <span className="entry-period">{entry.period}</span>
          <span className="entry-chevron" aria-hidden="true" />
        </span>
      </button>

      {entry.metrics && entry.metrics.length > 0 && (
        <ul className="entry-metrics" role="list" aria-label="Key impact">
          {entry.metrics.map((metric) => (
            <li key={metric.label} className="entry-metric">
              <span className="metric-value">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
            </li>
          ))}
        </ul>
      )}

      <div id={panelId} className="entry-panel" hidden={!expanded}>
        <p className="entry-summary">{entry.summary}</p>

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

        {entry.tradeoff && (
          <div
            className="entry-tradeoff"
            role="group"
            aria-label="Engineering challenge and fix"
          >
            <div className="tradeoff-col is-bottleneck">
              <span className="tradeoff-badge is-bottleneck">
                Bottleneck
              </span>
              <p className="tradeoff-text">{entry.tradeoff.bottleneck}</p>
            </div>
            <div className="tradeoff-col is-decision">
              <span className="tradeoff-badge is-decision">
                Engineering Fix
              </span>
              <p className="tradeoff-text">{entry.tradeoff.decision}</p>
            </div>
          </div>
        )}

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
    </li>
  );
}

function SectionBody({ focus, entries }: { focus: BookEntry; entries: BookEntry[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(focus.id);
  const focusRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    focusRef.current?.scrollIntoView({ block: 'nearest' });
  }, []);

  return (
    <ol
      className={`entry-list ${focus.category === 'experience' ? 'is-timeline' : ''}`}
      role="list"
    >
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          expanded={expandedId === entry.id}
          onToggle={() =>
            setExpandedId((current) => (current === entry.id ? null : entry.id))
          }
          focusRef={entry.id === focus.id ? focusRef : undefined}
        />
      ))}
    </ol>
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
    <ModalDialog open={book !== null} labelledBy={titleId} onClose={onClose}>
      {book && (
        <DialogFrame
          titleId={titleId}
          eyebrow={isProject ? 'Bookshelf · Top row' : 'Bookshelf · Bottom row'}
          title={isProject ? 'Key Projects' : 'Work Experience'}
          summary={summary}
        >
          <SectionBody key={book.id} focus={book} entries={entries} />
        </DialogFrame>
      )}
    </ModalDialog>
  );
}
