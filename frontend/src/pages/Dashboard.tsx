import LinearDiagram from "../components/tracker/LinearDiagram";

export default function Dashboard() {
  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <div
              className="border rounded p-3 bg-secondary"
              style={{ minHeight: "300px" }}
            >
              Platzhalter 1
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="border rounded p-3 bg-secondary"
              style={{ minHeight: "300px" }}
            >
              Platzhalter 2
            </div>
          </div>
        </div>
        <div className="mt-4">
          <LinearDiagram />
        </div>
      </div>
    </>
  );
}
