import { useState } from "react";

export default function Today() {
    const [trackedToday, setTrackedToday] = useState(false);

    if (trackedToday) {
        return (
            <div>
                <h1 className="text-white">Heute bereits getrackt</h1>
            </div>
        )
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // ...
        setTrackedToday(true);
    }


  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" name="notes" placeholder="Zusätzliche Notizen" className="bg-dark text-white border rounded p-2 w-full" />
            <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2">Fertig</button>
        </form>

    </div>
  )
}
