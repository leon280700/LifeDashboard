import LinearDiagram from "./LinearDiagram";

export default function Graphs({ refreshKey }: { refreshKey?: number }) {
  return (
    <>
      <h2 className="mb-2 text-2xl font-medium">Verlauf</h2>
      <LinearDiagram refreshKey={refreshKey} />;
    </>
  );
}
