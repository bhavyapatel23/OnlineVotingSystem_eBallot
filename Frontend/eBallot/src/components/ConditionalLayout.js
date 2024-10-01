import React from 'react';
import {useLocation } from 'react-router-dom';
import Layout from './Layout';

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const noLayoutRoutes = ['/', '/login', '/register']; // Add routes that should not use Layout

  const shouldRenderLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {shouldRenderLayout ? <Layout>{children}</Layout> : children}
    </>
  );
};

export default ConditionalLayout;
