import { useState } from "react";
import { GoalTrackerCategories } from "../../types/tracker/tracker.types";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function Today() {
  const [trackedToday, setTrackedToday] = useState(false);
  const goals = GoalTrackerCategories; // todo

  if (trackedToday) {
    return (
      <div className="pb-2">
        <p className="text-white">Heute getrackt</p>
        <Button
          type="button"
          styleType="primary"
          text="Zurücksetzen"
          onClick={() => setTrackedToday(false)}
        />
      </div>
    );
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ...
    setTrackedToday(true);
  };

  return (
    <div className="pb-2">
      <form onSubmit={handleSubmit}>
        {goals.map((item, index) => (
          <div key={index} className="mb-2">
            <label className="text-white mr-2">{item}</label>
            <input type="checkbox" name={item} />
          </div>
        ))}
        <Input placeholder="Zusätzliche Notizen" name="notes" />
        <Button
          type="submit"
          styleType="primary"
          text="Fertig"
          onClick={() => handleSubmit}
        />
      </form>
    </div>
  );
}
