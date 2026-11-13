import Header from "./components/Header";
import PageBackground from "./components/ui/PageBackground";

function App() {
  return (
    <>
      <div className="relative isolate min-h-screen text-white">
        <PageBackground />
        <Header />
      </div>
    </>
  );
}
export default App;
