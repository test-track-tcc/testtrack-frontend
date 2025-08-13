import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/auth/Onboarding";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/home/Dashboard";
import TestCaseForm from "./pages/testCases/form/TestCaseForm";
import TestCase from "./pages/testCases/TestCase";
import Projects from "./pages/projects/Projects";

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
        <Route path="/addTestCase" element={<TestCaseForm />} />
        <Route path="/projects" element={<Projects />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App
