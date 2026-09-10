
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import '@/style/global.css'
import { HomePage } from './pages/homepage'
import Login from '@/pages/auth/login';
import SignUp from '@/pages/auth/signup';
import Layout from "@/pages/layout";
import Dashboard from "@/pages/admin/dashboard";
import Students from "@/pages/admin/students";
import Classes from "@/pages/admin/classes";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="classes" element={<Classes />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
