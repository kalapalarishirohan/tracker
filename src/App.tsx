import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import { Toaster } from "@/components/ui/sonner";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import DashboardOverview from "@/pages/admin/Dashboard";
import ClientsList from "@/pages/admin/ClientsList";
import ProjectsList from "@/pages/admin/ProjectsList";
import SubmissionsList from "@/pages/admin/SubmissionsList";
import TicketsList from "@/pages/admin/TicketsList";
import ClientLogin from "@/pages/client/ClientLogin";
import ClientLayout from "@/pages/client/ClientLayout";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ProjectForm from "@/pages/client/ProjectForm";
import TicketForm from "@/pages/client/TicketForm";
import FeedbackForm from "@/pages/client/FeedbackForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="clients" element={<ClientsList />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="submissions" element={<SubmissionsList />} />
          <Route path="tickets" element={<TicketsList />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client" element={<ClientLogin />} />
        <Route path="/client/portal" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="new-project" element={<ProjectForm />} />
          <Route path="tickets" element={<TicketForm />} />
          <Route path="feedback" element={<FeedbackForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
