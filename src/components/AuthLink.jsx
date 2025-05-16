import React from 'react';
import { Link } from 'react-router-dom';

function AuthLink({ to, children }) {
  return (
    <div className="text-center">
      <Link to={to} className="inline-block text-sm text-gray-600 hover:underline">
        {children}
      </Link>
    </div>
  );
}

export default AuthLink;
