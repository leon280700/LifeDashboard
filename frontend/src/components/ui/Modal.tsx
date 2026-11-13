import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import IconButton from "./IconButton";

type ModalProps = {
  title: ReactNode;
  onClose: () => void;
  actions?: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDialogElement>) => void;
  children: ReactNode;
};

export default function Modal({
  title,
  onClose,
  actions,
  onKeyDown,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    // Seite dahinter nicht mitscrollen
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
      className="m-auto max-h-[90dvh] w-[min(100%-2rem,72rem)] overflow-hidden rounded-2xl border border-neutral-700/70 bg-neutral-900/95 p-0 text-white shadow-2xl shadow-black/50 backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-in open:fade-in open:zoom-in-95"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <header className="flex items-center gap-3 border-b border-neutral-800 px-4 py-3 sm:px-6">
          <h2
            id={titleId}
            className="min-w-0 flex-1 truncate text-lg font-semibold"
          >
            {title}
          </h2>
          {actions}
          <IconButton icon={X} label="Schließen" onClick={onClose} />
        </header>
        <div className="overflow-y-auto px-4 py-6 sm:px-6">{children}</div>
      </div>
    </dialog>
  );
}
