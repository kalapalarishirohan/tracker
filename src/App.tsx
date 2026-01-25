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
import ProClientsManagement from "@/pages/admin/ProClientsManagement";
import ClientLogin from "@/pages/client/ClientLogin";
import ClientLayout from "@/pages/client/ClientLayout";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ProjectForm from "@/pages/client/ProjectForm";
import TicketForm from "@/pages/client/TicketForm";
import FeedbackForm from "@/pages/client/FeedbackForm";
import TicketsHistory from "@/pages/client/TicketsHistory";
import ProClientLayout from "@/pages/pro/ProClientLayout";
import ProDashboard from "@/pages/pro/ProDashboard";
import AssetsPage from "@/pages/pro/AssetsPage";
import DevTrackingPage from "@/pages/pro/DevTrackingPage";
import ApproachPlansPage from "@/pages/pro/ApproachPlansPage";
import Contact from "@/pages/public/Contact";
import ProjectRequest from "@/pages/public/ProjectRequest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-project" element={<ProjectRequest />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="clients" element={<ClientsList />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="submissions" element={<SubmissionsList />} />
          <Route path="tickets" element={<TicketsList />} />
          <Route path="pro-clients" element={<ProClientsManagement />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client" element={<ClientLogin />} />
        <Route path="/client/portal" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="project-request" element={<ProjectForm />} />
          <Route path="tickets" element={<TicketForm />} />
          <Route path="tickets-history" element={<TicketsHistory />} />
          <Route path="feedback" element={<FeedbackForm />} />
        </Route>

        {/* Pro Client Routes */}
        <Route path="/pro/portal" element={<ProClientLayout />}>
          <Route index element={<ProDashboard />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="app-tracking" element={<DevTrackingPage projectType="app" />} />
          <Route path="web-tracking" element={<DevTrackingPage projectType="web" />} />
          <Route path="approach-plans" element={<ApproachPlansPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
