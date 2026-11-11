import { useState } from "react";
import Button from "../ui/Button";
import { GoalTrackerCategories } from "../../types/tracker.types";
import Input from "../ui/Input";

export default function Goals() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  return (
    <div className="bg-secondary border rounded mb-5 p-4">
      <h2>Ziele</h2>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        styleType="primary"
        text={isOpen ? "v" : ">"}
        type="button"
      />

      {isOpen && (
        <div className="mt-3">
          <form onSubmit={(e) => e.preventDefault()}>
            {GoalTrackerCategories.map((item) => (
              <div key={item} className="mb-2">
                <label className="text-white mr-2">{item}</label>
                <input
                  type="checkbox"
                  name={item}
                  checked={selectedGoals.includes(item)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedGoals([...selectedGoals, item]);
                    } else {
                      setSelectedGoals(
                        selectedGoals.filter((goal) => goal !== item),
                      );
                    }
                  }}
                />
                <Input placeholder="Bedingungen..." name={`${item}-notes`} />
              </div>
            ))}
            <Button type="submit" styleType="primary" text="Speichern" />
          </form>
        </div>
      )}
    </div>
  );
}
