import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/auth/Onboarding";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/home/Dashboard";
import TestCaseForm from "./pages/testCases/form/TestCaseForm";
import TestCase from "./pages/testCases/TestCase";
import Projects from "./pages/projects/Projects";
import SelectOrganization from "./pages/organization/SelectOrganization";
import CreateOrganization1 from "./pages/organization/form/CreateOrganization1";
import CreateOrganization2 from "./pages/organization/form/CreateOrganization2";
import CreateOrganization3 from "./pages/organization/form/CreateOrganization3";
import CreateOrganization4 from "./pages/organization/form/CreateOrganization4";

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
        <Route path="/organization" element={<SelectOrganization />} /> 
        <Route path="/create-organization-1" element={<CreateOrganization1 />} /> 
        <Route path="/create-organization-2" element={<CreateOrganization2 />} /> 
        <Route path="/create-organization-3" element={<CreateOrganization3 />} /> 
        <Route path="/create-organization-4" element={<CreateOrganization4 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
