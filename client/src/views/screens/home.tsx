import React from 'react';
import { Redirect } from 'react-router-dom';

import { useSessionState } from '@/hooks/session';


export function Home (props: {}) {
  const { isAuthenticated, user } = useSessionState();
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  if (user.id === 0) {
    return <div />
  }
  if (user.is_admin) {
    return <Redirect to="/employees" />;
  }
  return <Redirect to="/feedbacks" />;
}
