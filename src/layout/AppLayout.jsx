import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export const AppLayout = ({ children }) => (
  <div className="app-layout-container">
    <Navbar />
    <div className="app-layout-content">
      <Outlet />
    </div>
  </div>
);
