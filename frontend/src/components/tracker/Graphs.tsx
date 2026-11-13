import LinearDiagram from "./TrackerChart";

export default function Graphs({ refreshKey }: { refreshKey?: number }) {
  return (
    <>
      <h2 className="mb-2 pt-4 text-2xl font-medium">Verlauf</h2>
      {/* todo: more graphs here (maybe a github contributions like graph) */}
      <LinearDiagram refreshKey={refreshKey} />
    </>
  );
}
