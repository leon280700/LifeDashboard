import Button from "@/components/ui/Button";
import Headline from "@/components/ui/Headline";
import Input from "@/components/ui/Input";
import { activities, moods } from "@/types/diary.types";
import { useState } from "react";

export default function Diary() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <Headline children="Tagebuch" />
      <form className="mt-4">
        {moods.map((mood) => (
          <>
            <input
              type="radio"
              name="mood"
              checked={selectedMood === mood}
              onChange={() => setSelectedMood(mood)}
            />
            <label key={mood} className="mr-4 cursor-pointer text-3xl">
              {mood}
            </label>
          </>
        ))}
        {activities.map((activity) => (
          <div key={activity} className="flex items-center gap-2">
            <input type="checkbox" name={activity} />
            <label className="text-white">{activity}</label>
          </div>
        ))}

        <Input placeholder="Weitere Notizen..." />
        <Button type="submit" styleType="primary" text="Speichern" />
      </form>
    </div>
  );
}
