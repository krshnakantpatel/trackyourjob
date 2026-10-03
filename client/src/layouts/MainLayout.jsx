import React from 'react'
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1" >
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout