import LinearDiagram from "./LinearDiagram";

export default function Graphs({ refreshKey }: { refreshKey?: number }) {
  return (
    <>
      <h2>Verlauf</h2>
      <LinearDiagram refreshKey={refreshKey} />;
    </>
  );
}
