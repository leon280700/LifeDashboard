import { useState } from "react";
import Goals from "../components/tracker/Goals";
import Today from "../components/tracker/Today";

export default function Tracker() {
  const [goalsVersion, setGoalsVersion] = useState(0);

  return (
    <div className="container mt-5 ">
      <h1 className="text-white pt-2">Tracker</h1>
      <Goals onSaved={() => setGoalsVersion((v) => v + 1)} />
      <Today key={goalsVersion} />
    </div>
  );
}
