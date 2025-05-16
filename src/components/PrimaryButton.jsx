import React from 'react';

function PrimaryButton({ children, onClick, type = 'button', className = '', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
