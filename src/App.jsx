//package imports
//local imports
import "./App.less";
import { RootLayout } from "./components/layouts/RootLayout";
import { useGA4React } from "ga-4-react";

function App() {
  const ga = useGA4React();
  console.log(ga)
  return (
    <div className="App">
      <RootLayout />
    </div>
  );
}

export default App;
