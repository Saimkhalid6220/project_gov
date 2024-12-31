"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import Search from "./search";
import MultiSelect from '@/components/features/filter';
import { Trash2, Edit } from "lucide-react";

const ExcelComponent = () => {
  const [cases, setCases] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedHeadings, setSelectedHeadings] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Add save changes functionality
  const handleSaveChanges = () => {
    localStorage.setItem('tableData', JSON.stringify(cases));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Update the path to point to your public directory
        const response = await fetch('/DATA.xlsx');
        if (!response.ok) {
          throw new Error('Failed to fetch Excel file');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (json.length > 0) {
          setHeaders(json[0]);
          setCases(json.slice(1));
          setFilteredCases(json.slice(1));
        }
      } catch (error) {
        console.error('Error loading Excel file:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (selectedOptions) => {
    setSelectedHeadings(selectedOptions);
    
    let filtered = [...cases];

    if (selectedOptions.length > 0) {
      filtered = filtered.map(row => {
        const newRow = new Array(headers.length).fill(''); // Initialize with empty strings
        selectedOptions.forEach(heading => {
          const columnIndex = headers.indexOf(heading);
          if (columnIndex !== -1) {
            newRow[columnIndex] = row[columnIndex] || ''; // Keep original data or empty string
          }
        });
        return newRow;
      });

      // Remove rows where all selected columns are empty
      filtered = filtered.filter(row =>
        selectedOptions.some(heading => {
          const columnIndex = headers.indexOf(heading);
          return columnIndex !== -1 && 
            row[columnIndex]?.toString().trim() !== '';
        })
      );
    }

    // Apply search filter if exists
    if (searchQuery) {
      filtered = filtered.filter(row =>
        row.some(cell =>
          cell?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredCases(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    let filtered = [...cases];

    // Apply search filter
    if (query) {
      filtered = filtered.filter(row =>
        row.some(cell =>
          cell?.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    // Apply column filters if any selected
    if (selectedHeadings.length > 0) {
      filtered = filtered.filter(row =>
        selectedHeadings.some(heading => {
          const columnIndex = headers.indexOf(heading);
          return columnIndex !== -1 && 
            row[columnIndex]?.toString().toLowerCase().trim() !== '';
        })
      );
    }

    setFilteredCases(filtered);
  };

  // Stats calculation
  const totalCases = cases.length;
  const activeCases = cases.filter(row => row[headers.indexOf('Status')] === 'Active').length;
  const closedCases = cases.filter(row => row[headers.indexOf('Status')] === 'Closed').length;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Total Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-black">{totalCases}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Active Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-green-600">{activeCases}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700">Closed Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-red-600">{closedCases}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Search onSearch={handleSearch} className="flex-1" />
        {headers.length > 0 && (
          <div className="flex gap-2">
            <MultiSelect
              options={headers}
              selectedOptions={selectedHeadings}
              onChange={handleFilterChange}
              className="w-48 bg-white text-black border border-gray-200 rounded-md shadow-sm"
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'white',
                  color: 'black',
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: 'white',
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
                  color: 'black',
                })
              }}
            />
            <Button
              onClick={handleSaveChanges}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-gray-900 bg-white">
                  {header}
                </th>
              ))}
              <th className="border-b border-gray-200 p-3 text-center text-sm font-semibold text-gray-900 bg-white w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-b border-gray-200 p-3 text-sm text-gray-900">
                    {cell}
                  </td>
                ))}
                <td className="border-b border-gray-200 p-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:text-black hover:bg-gray-100"
                      onClick={() => handleEdit(rowIndex)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-700 hover:text-red-600 hover:bg-gray-100"
                      onClick={() => handleDelete(rowIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelComponent;