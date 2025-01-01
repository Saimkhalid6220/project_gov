import React, { useState } from "react";

interface FilterProps {
  headers: string[];
  cases: any[];
  setFilteredCases: React.Dispatch<React.SetStateAction<any[]>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>; // Pass setShowModal to close the modal
}

const Filter: React.FC<FilterProps> = ({ headers, cases, setFilteredCases, setShowModal }) => {
  const [filterValues, setFilterValues] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const fieldsPerPage = 3; // Number of fields to show per page

  const currentFields = headers.slice(
    (currentPage - 1) * fieldsPerPage,
    currentPage * fieldsPerPage
  );

  const handleFilterChange = (header: string, value: string) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      [header]: value,
    }));
  };

  const handleApplyFilter = () => {
    let filtered = [...cases];

    for (const [header, value] of Object.entries(filterValues)) {
      if (value) {
        filtered = filtered.filter((row) =>
          row[header]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    }

    setFilteredCases(filtered);
    setShowModal(false); // Close the modal when "Done" is clicked
  };

  const handleRefreshFilters = () => {
    setFilterValues({}); // Reset all filters
    setFilteredCases(cases); // Reset the filtered cases to show all
    setShowModal(false); // Close the modal when "Refresh" is clicked
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(headers.length / fieldsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {/* Form for filtering */}
      <div className="space-y-4">
        {currentFields.map((header) => (
          <div key={header}>
            <label className="block text-sm font-medium text-gray-700">{header}</label>
            <input
              type="text"
              value={filterValues[header] || ""}
              onChange={(e) => handleFilterChange(header, e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`Filter by ${header}`}
            />
          </div>
        ))}
      </div>

      {/* Pagination and action buttons */}
      <div className="mt-6 flex justify-between gap-4">
        <button
          onClick={goToPreviousPage}
          className="w-full py-2 px-4 hover:bg-gray-700 bg-gray-600 text-white rounded-md  focus:outline-none focus:ring-2 focus:ring-gray-800"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          onClick={goToNextPage}
          className="w-full py-2 px-4 hover:bg-gray-700 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={currentPage === Math.ceil(headers.length / fieldsPerPage)}
        >
          Next
        </button>
      </div>

      {/* Done button to apply filters (visible on all pages) */}
      <div className="mt-4">
        <button
          onClick={handleApplyFilter}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Done
        </button>
      </div>

      {/* Refresh button to reset filters */}
      <div className="mt-4">
        <button
          onClick={handleRefreshFilters}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default Filter;
