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
  const [editedData, setEditedData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/DATA.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        setHeaders(json[0]);
        setCases(json.slice(1));
        setFilteredCases(json.slice(1));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (selectedOptions) => {
    setSelectedHeadings(selectedOptions);
    
    if (selectedOptions.length === 0) {
      setFilteredCases(cases);
      return;
    }

    const filtered = cases.filter(row =>
      selectedOptions.some(heading => {
        const columnIndex = headers.indexOf(heading);
        return columnIndex !== -1 && row[columnIndex]?.toString().trim() !== '';
      })
    );

    setFilteredCases(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    let filtered = [...cases];

    if (query) {
      filtered = filtered.filter(row =>
        row.some(cell =>
          cell?.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (selectedHeadings.length > 0) {
      filtered = filtered.filter(row =>
        selectedHeadings.some(heading => {
          const columnIndex = headers.indexOf(heading);
          return columnIndex !== -1 && row[columnIndex]?.toString().trim() !== '';
        })
      );
    }

    setFilteredCases(filtered);
  };

  const handleEdit = (rowIndex) => {
    setEditingRow(rowIndex);
    setEditedData(filteredCases[rowIndex]);
  };

  const handleSave = (rowIndex) => {
    const updatedCases = [...cases];
    updatedCases[rowIndex] = editedData;
    setCases(updatedCases);
    setFilteredCases(updatedCases);
    setEditingRow(null);
    setEditedData({});
    handleSaveChanges();
  };

  const handleDelete = (rowIndex) => {
    const updatedCases = cases.filter((_, index) => index !== rowIndex);
    setCases(updatedCases);
    setFilteredCases(updatedCases);
    handleSaveChanges();
  };

  const handleSaveChanges = () => {
    localStorage.setItem('tableData', JSON.stringify(cases));
  };

  // Stats calculation
  const totalCases = cases.length;
  const activeCases = cases.filter(row => {
    const statusIndex = headers.indexOf('Status');
    const remarksIndex = headers.indexOf('Remarks');
    const status = row[statusIndex]?.toString().toLowerCase();
    const remarks = row[remarksIndex]?.toString().toLowerCase();
    return status === 'active' || remarks === 'pending' || remarks === '';
  }).length;
  const closedCases = cases.filter(row => {
    const statusIndex = headers.indexOf('Status');
    const status = row[statusIndex]?.toString().toLowerCase();
    return status === 'closed' || status === 'dismissed' || status === 'disposed off';
  }).length;

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
      <div className="flex items-center justify-center gap-4 mb-6">
        <div>

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
            </div>
        <Search onSearch={handleSearch} className="flex-1" />
        <div className="flex gap-2">
          <Button
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="border-b border-gray-200 p-3 text-left text-sm font-semibold text-black bg-white">
                  {header}
                </th>
              ))}
              <th className="border-b border-gray-200 p-3 text-center text-sm font-semibold text-black bg-white w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((row, rowIndex) => (
              <tr key={rowIndex} className={`hover:bg-gray-50 ${editingRow === rowIndex ? 'bg-white text-black' : ''}`}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-b border-gray-200 p-3 text-sm text-black">
                    {editingRow === rowIndex ? (
                      <input
                        type="text"
                        value={editedData[cellIndex] || cell}
                        onChange={(e) => {
                          const newData = { ...editedData };
                          newData[cellIndex] = e.target.value;
                          setEditedData(newData);
                        }}
                        className="w-full p-1 border rounded bg-white text-black"
                      />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                <td className="border-b border-gray-200 p-3">
                  <div className="flex justify-center gap-2">
                    {editingRow === rowIndex ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(rowIndex)}
                        className="text-green-600 hover:bg-gray-50"
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-black hover:text-white hover:bg-gray-50"
                          onClick={() => handleEdit(rowIndex)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-black hover:text-red-600 hover:bg-gray-50"
                          onClick={() => handleDelete(rowIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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