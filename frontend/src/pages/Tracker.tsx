import { useState } from "react";
import { useGoalApi } from "../api/useGoalApi";
import Goals from "../components/tracker/Goals";
import Today from "../components/tracker/Today";
import Graphs from "../components/tracker/Graphs";
import Headline from "@/components/ui/Headline";

export default function Tracker() {
  const [entryVersion, setEntryVersion] = useState(0);
  const goalApi = useGoalApi();

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <Headline children="Tracker" />
      <Goals
        goals={goalApi.goals}
        error={goalApi.error}
        saving={goalApi.saving}
        saveGoals={goalApi.saveGoals}
        onSaved={() => setEntryVersion((v) => v + 1)}
      />
      <Today
        goals={goalApi.goals}
        goalsLoading={goalApi.loading}
        goalsError={goalApi.error}
        onSaved={() => setEntryVersion((v) => v + 1)}
      />
      <Graphs refreshKey={entryVersion} />
    </div>
  );
}
