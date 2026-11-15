import { useEffect, useRef, type ReactNode } from 'react';

interface ModalDialogProps {
  open: boolean;
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
}

const isOutsideDialog = (event: PointerEvent, dialog: HTMLDialogElement) => {
  const rect = dialog.getBoundingClientRect();
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  );
};

export function ModalDialog({
  open,
  labelledBy,
  onClose,
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    // Fallback light dismiss for browsers without HTMLDialogElement.closedBy
    if ('closedBy' in HTMLDialogElement.prototype) {
      return () => {
        dialog.removeEventListener('close', handleClose);
      };
    }

    let pressedOutside = false;

    const handlePointerDown = (event: PointerEvent) => {
      pressedOutside = isOutsideDialog(event, dialog);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (pressedOutside && isOutsideDialog(event, dialog)) {
        dialog.close();
      }
      pressedOutside = false;
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);

    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="room-dialog"
      aria-labelledby={labelledBy}
      {...({ closedby: 'any' } as Record<string, string>)}
    >
      {open && children}
    </dialog>
  );
}

interface DialogFrameProps {
  titleId: string;
  eyebrow: string;
  title: string;
  summary?: ReactNode;
  children: ReactNode;
}

/** Consistent modal chrome: fixed header + independently scrolling body. */
export function DialogFrame({
  titleId,
  eyebrow,
  title,
  summary,
  children,
}: DialogFrameProps) {
  return (
    <article className="dialog-frame">
      <header className="dialog-header">
        <div className="dialog-header-text">
          <p className="dialog-eyebrow">{eyebrow}</p>
          <h2 id={titleId} className="dialog-title">
            {title}
          </h2>
          {summary && <p className="dialog-lede">{summary}</p>}
        </div>
        <form method="dialog">
          <button
            type="submit"
            className="dialog-close"
            aria-label="Close dialog"
            autoFocus
          >
            <span aria-hidden="true">✕</span>
            <span className="dialog-close-label">Close</span>
          </button>
        </form>
      </header>
      <div className="dialog-scroll">{children}</div>
    </article>
  );
}
