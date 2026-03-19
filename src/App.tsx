import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import YearPage from "./pages/YearPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/year/:yearId" element={<YearPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
