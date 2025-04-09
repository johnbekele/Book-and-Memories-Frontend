import React from 'react';

const SmallSpinner = () => {
  return (
    <div className="flex justify-center items-center h-40 md:h-64">
      <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default SmallSpinner;
