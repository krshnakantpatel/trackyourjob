import React from 'react'
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout