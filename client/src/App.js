import React, { Suspense, lazy } from "react";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components
const Hero = lazy(() => import("./components/sections/Hero"));
const Skills = lazy(() => import("./components/sections/Skills"));
const Experience = lazy(() => import("./components/sections/Experience"));
const Education = lazy(() => import("./components/sections/Education"));
const StartCanvas = lazy(() => import("./components/canvas/Stars"));
const Projects = lazy(() => import("./components/sections/Projects"));
const Contact = lazy(() => import("./components/sections/Contact"));
const Footer = lazy(() => import("./components/sections/Footer"));
const Login = lazy(() => import("./pages/auth/Login"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));

// Admin components
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProjectManager = lazy(() => import("./pages/admin/ProjectManager"));
const SkillManager = lazy(() => import("./pages/admin/SkillManager"));
const ExperienceManager = lazy(() => import("./pages/admin/ExperienceManager"));
const EducationManager = lazy(() => import("./pages/admin/EducationManager"));
const SocialManager = lazy(() => import("./pages/admin/SocialManager"));
const ResumeManager = lazy(() => import("./pages/admin/ResumeManager"));
const MessageCenter = lazy(() => import("./pages/admin/MessageCenter"));
const ProfileManager = lazy(() => import("./pages/admin/ProfileManager"));

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
`;

const HomePage = () => (
  <>
    <StartCanvas />
    <div>
      <Hero />
      <Wrapper>
        <Skills />
        <Experience />
      </Wrapper>
      <Projects />
      <Wrapper>
        <Education />
        <Contact />
      </Wrapper>
      <Footer />
    </div>
  </>
);

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Body>
        <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
          <Outlet />
        </Suspense>
      </Body>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/login" element={<Login />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<ProjectManager />} />
                <Route path="profile" element={<ProfileManager />} />
                <Route path="skills" element={<SkillManager />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="education" element={<EducationManager />} />
                <Route path="social" element={<SocialManager />} />
                <Route path="messages" element={<MessageCenter />} />
                <Route path="resume" element={<ResumeManager />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
