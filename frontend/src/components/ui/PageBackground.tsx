// Seitenhintergrund für die ganze App: dunkle Basis mit weichen Farbschleiern
// in den Farben der Headline (AuroraText), feinem Punktraster und Vignette.
// Liegt fixiert hinter dem Inhalt und scrollt nicht mit.
export default function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-950"
    >
      <div className="absolute -top-48 -left-40 size-160 rounded-full bg-fuchsia-600/15 blur-[140px] motion-safe:animate-drift" />
      <div className="absolute top-1/4 -right-48 size-144 rounded-full bg-blue-600/15 blur-[140px] motion-safe:animate-drift-reverse" />
      <div className="absolute -bottom-64 left-1/4 size-176 rounded-full bg-violet-700/15 blur-[160px] motion-safe:animate-drift" />

      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(0_0_0/0.45))]" />
    </div>
  );
}
