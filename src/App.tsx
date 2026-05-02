import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import Session from "./pages/Session";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/session/:clientId" element={<Session />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
