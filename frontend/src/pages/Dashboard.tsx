import LinearDiagram from "../components/tracker/LinearDiagram";

const placeholder =
  "min-h-[300px] rounded border border-neutral-600 bg-neutral-700 p-3";

export default function Dashboard() {
  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={placeholder}>Platzhalter 1</div>
        <div className={placeholder}>Platzhalter 2</div>
      </div>
      <div className="mt-6">
        <LinearDiagram />
      </div>
    </div>
  );
}
