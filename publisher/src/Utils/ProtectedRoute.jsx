import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Navigate } from 'react-router-dom';
import CustomLoadingPage from './CustomLoadingPage';

const ProtectedRoute = ({ element }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <CustomLoadingPage />;
  }

  if (keycloak?.authenticated) {
    return element;
  } else {
    keycloak.login({
      redirectUri: window.location.origin + window.location.pathname,
    });
    return <CustomLoadingPage />;
  }
};

export default ProtectedRoute;