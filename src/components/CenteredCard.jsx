import React from 'react';

function CenteredCard({ children, className = '' }) {
  return (
    <div className={`w-full max-w-sm bg-white p-8 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}

export default CenteredCard;
