import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Onboarding from "./pages/Onboarding/Onboarding";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import TestCase from "./pages/TestCase/TestCase";
import Projects from "./pages/Project/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/testCase" element={<TestCase />} />
        <Route path="/projects" element={<Projects />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App
