//package imports
import { QueryClient, QueryClientProvider } from "react-query";
//local imports
import "./App.less";
import { RootLayout } from "./components/layouts/RootLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <RootLayout />
      </div>
    </QueryClientProvider>
  );
}

export default App;
