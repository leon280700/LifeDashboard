import MoodChart from "@/components/diary/MoodChart";
import TrackerChart from "@/components/tracker/TrackerChart";

export default function Dashboard() {
  return (
    <div className="mx-auto mt-12 max-w-6xl px-4">
      <div className="mt-6">
        <TrackerChart />
      </div>
      <div className="mt-6">
        <MoodChart />
      </div>
    </div>
  );
}
