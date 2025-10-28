import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/auth/Onboarding";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/home/Dashboard";
import TestScenarios from "./pages/testScenario/TestScenario";
import TestCase from "./pages/testCases/TestCase";
import Projects from "./pages/projects/Projects";
import KanbanPage from "./pages/kanban/KanbanPage";
import SelectOrganization from "./pages/organization/SelectOrganization";
import CreateOrganization1 from "./pages/organization/form/CreateOrganization1";
import CreateOrganization2 from "./pages/organization/form/CreateOrganization2";
import CreateOrganization3 from "./pages/organization/form/CreateOrganization3";
import CreateOrganization4 from "./pages/organization/form/CreateOrganization4";
import BugsPage from "./pages/bugs/BugsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import ScriptsPage from "./pages/scripts/ScriptsPage";

function App() {
  const user = localStorage.getItem("userData");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/organization" replace /> : <Login />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/organization" replace /> : <Login />}
        />

        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/projects/:projectId/test-cases" element={<TestCase />} />

        <Route path="/organization" element={<SelectOrganization />} />

        <Route path="/organization/:orgId/dashboard" element={<Dashboard />} />
            <Route path="/organization/:orgId/projects" element={<Projects />} />
            
            <Route path="/organization/:orgId/project/:projectId/dashboard" element={<Dashboard />} />
            <Route path="/organization/:orgId/project/:projectId/testCase" element={<TestCase />} />
            <Route path="/organization/:orgId/project/:projectId/testScenario" element={<TestScenarios />} />
            <Route path="/organization/:orgId/project/:projectId/kanban" element={<KanbanPage />} />
            <Route path="/organization/:orgId/project/:projectId/bugs" element={<BugsPage />} />
            <Route path="/organization/:orgId/project/:projectId/reports" element={<ReportsPage />} />
            <Route path="/organization/:orgId/project/:projectId/scripts" element={<ScriptsPage />} />

        <Route
          path="/organization/:orgId/projects"
          element={<Projects />}
        />
        <Route
          path="/create-organization/step-1"
          element={<CreateOrganization1 />}
        />
        <Route
          path="/create-organization/step-2"
          element={<CreateOrganization2 />}
        />
        <Route
          path="/create-organization/step-3"
          element={<CreateOrganization3 />}
        />
        <Route
          path="/create-organization/step-4"
          element={<CreateOrganization4 />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
