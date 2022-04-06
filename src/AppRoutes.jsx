import React from 'react';
import { AppLayout } from 'layout/AppLayout';
import ApplicationForm from 'pages/ApplicationForm';
import { HomePage } from 'pages/HomePage/HomePage';
import { Route, Routes, useLocation } from 'react-router-dom';

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location.state?.backgroundLocation || location}>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="application" element={<ApplicationForm />} />
      </Route>
    </Routes>
  );
};
