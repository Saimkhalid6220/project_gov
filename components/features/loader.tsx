import React from 'react';

const Progress = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-700 border-t-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Progress;