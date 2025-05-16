import React from 'react';

function MessageDisplay({ message, isError = false }) {
  if (!message) return null;

  const textColorClass = isError ? 'text-red-600' : 'text-green-600';

  return (
    <p className={`text-center text-sm mb-4 ${textColorClass}`}>
      {message}
    </p>
  );
}

export default MessageDisplay;
