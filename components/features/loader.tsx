import React from 'react';

const Progress = () => {
  return (
    
      <div className="min-h-screen bg-white text-black p-6">
        {/* Cards Section */}
        <div className=" w-full grid-cols-3 flex gap-4 mb-6">
        <div className="p-4 rounded-lg w-full bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Total Cases</h3>
          <div className="h-8 bg-gray-300 rounded w-3/4 mt-2 animate-pulse"></div>
        </div>
        <div className="p-4 rounded-lg w-full bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Active Cases</h3>
          <div className="h-8 bg-gray-300 rounded w-3/4 mt-2 animate-pulse"></div>
        </div>
        <div className="p-4 rounded-lg w-full bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Closed Cases</h3>
          <div className="h-8 bg-gray-300 rounded w-3/4 mt-2 animate-pulse"></div>
        </div>
        <div className="p-4 rounded-lg w-full bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Comments Not Filed Cases</h3>
          <div className="h-8 bg-gray-300 rounded w-3/4 mt-2 animate-pulse"></div>
        </div>
      </div>
      {/*  */}
      <div className="w-full grid grid-cols-2 gap-4 mb-6">
      <div className="p-2 rounded-lg w-full bg-white border border-gray-400 shadow-sm">
        <h3 className="text-sm font-bold text-yellow-600">Hearing in 6 Days</h3>
      
            <div className="h-8 bg-gray-300 rounded w-full mt-2 animate-pulse"></div>
        
      </div>
      <div className="p-2 rounded-lg w-full bg-white border border-gray-400 shadow-sm">
        <h3 className="text-sm font-bold text-red-700 ">Hearing in 3 Days ⚠️</h3>
       
          <div className="h-8 bg-gray-300 rounded w-full mt-2 animate-pulse"></div>
          
      </div>
    </div>
      {/*  */}
  
        {/* Buttons Section */}
        <div className="flex items-center justify-center gap-4 mb-6">
        {/* Placeholder for Filter Button */}
        <div  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Filter
          </div>
        {/* Placeholder for Scroll to Bottom */}
        <div className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
        Scroll to Bottom</div>
        {/* Placeholder for Search Input */}
        <div className="w-full max-w-md p-2 relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2   rounded border border-gray-500 bg-white text-black"
      />
    </div>
          {/* Placeholder for Add Case Button */}
        <div className="flex gap-2">
          <div className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Add Case</div>
        </div>
      </div>
  
        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  SR. NO
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  DATE OF HEARING
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  CP/SA /SUIT
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  SUBJECT
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  PETITIONER
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  COURT
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  CONCERNED OFFICE
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  COMMENTS FILED (Y/N)
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  LAST HEARING DATE
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  REMARKS
                </th>
                <th className="py-3 px-4 text-left font-semibold border-b text-xs">
                  ATTACHMENT
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(11)].map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-300 p-2 text-sm text-black"
                    >
                      <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Scroll Button */}
        <div className="mt-6">
          <div className="h-10 bg-gray-300 rounded w-32 animate-pulse"></div>
        </div>
      </div>
  );
};

export default Progress;