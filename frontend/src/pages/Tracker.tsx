import { useState } from "react";
import Goals from "../components/tracker/Goals";
import Today from "../components/tracker/Today";
import Graphs from "../components/tracker/Graphs";
import { AuroraText } from "@/components/ui/aurora-text";

export default function Tracker() {
  const [goalsVersion, setGoalsVersion] = useState(0);
  const [entryVersion, setEntryVersion] = useState(0);

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <AuroraText children={"Tracker"} className="text-4xl pb-2" />
      <Goals onSaved={() => setGoalsVersion((v) => v + 1)} />
      <Today key={goalsVersion} onSaved={() => setEntryVersion((v) => v + 1)} />
      <Graphs refreshKey={entryVersion} />
    </div>
  );
}
