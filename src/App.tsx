import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TestCaseForm from "./pages/TestCaseForm";
import TestCase from "./pages/TestCase";


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
      </Routes>
    </BrowserRouter>
  );
}

export default App
