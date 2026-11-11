import Goals from "../components/tracker/Goals";
import Today from "../components/tracker/Today";

export default function Tracker() {
  return (
    <div className="container mt-5 ">
      <h1 className="text-white pt-2">Tracker</h1>
      <Goals />
      <Today />
    </div>
  );
}
