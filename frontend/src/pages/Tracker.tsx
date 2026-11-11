import { useState } from "react";
import Goals from "../components/tracker/Goals";
import Today from "../components/tracker/Today";
import Graphs from "../components/tracker/Graphs";

export default function Tracker() {
  const [goalsVersion, setGoalsVersion] = useState(0);
  const [entryVersion, setEntryVersion] = useState(0);

  return (
    <div className="container mt-5 flex-row">
      <h1 className="text-white pt-2">Tracker</h1>
      <Goals onSaved={() => setGoalsVersion((v) => v + 1)} />
      <Today key={goalsVersion} onSaved={() => setEntryVersion((v) => v + 1)} />
      <Graphs refreshKey={entryVersion} />
    </div>
  );
}
