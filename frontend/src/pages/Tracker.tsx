import { useState } from "react";
import Goals from "../components/tracker/Goals";
import Today from "../components/tracker/Today";
import Graphs from "../components/tracker/Graphs";
import Headline from "@/components/ui/Headline";

export default function Tracker() {
  const [goalsVersion, setGoalsVersion] = useState(0);
  const [entryVersion, setEntryVersion] = useState(0);

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <Headline children="Tracker" />
      <Goals onSaved={() => setGoalsVersion((v) => v + 1)} />
      <Today key={goalsVersion} onSaved={() => setEntryVersion((v) => v + 1)} />
      <Graphs refreshKey={entryVersion} />
    </div>
  );
}
