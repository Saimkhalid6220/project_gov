"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import Search from "./search";

const ExcelComponent = ({ data }) => {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
    if (selectedFilter) {
      setFilteredData(data.filter(item => item.heading === selectedFilter));
    } else {
      setFilteredData(data);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
      {/* Filter Button */}
      <div className="flex justify-center mt-4">
        <select value={filter} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded">
          <option value="">Select a heading to filter</option>
          {data.map((item, index) => (
            <option key={index} value={item.heading}>{item.heading}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 w-full">
        {filteredData.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {/* Add your table headers here */}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* Add your table row data here */}
                  <td>
                    <Button onClick={() => handleSaveRow(rowIndex)}>
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">
            No data to display. Upload files to populate the table.
          </p>
        )}
      </div>

      {/* Add Case Button */}
      <div className="mt-4 flex justify-center">
        <Button variant="secondary" onClick={handleAddRow}>
          Add Case
        </Button>
      </div>
    </div>
  );
};

export default function LegalDashboard() {
  const [cases, setCases] = useState<any[][]>([]);
  const [filteredCases, setFilteredCases] = useState<any[][]>([]);
  const [dragging, setDragging] = useState(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<any[]>([]);

  // Handle File Upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Assuming only one sheet is uploaded
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

      const formattedSheetData = sheetData.map((row: any[]) => {
        return row.map((cell) => (cell === "" ? "" : String(cell)));
      });

      setCases(formattedSheetData); // Set the data to the state
      setFilteredCases(formattedSheetData); // Initialize filtered cases
      setOriginalFile(file); // Save the original file for later export
    };
    reader.readAsBinaryString(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleEditRow = (rowIndex: number) => {
    setEditingRow(rowIndex);
    setEditedRow([...cases[rowIndex]]);
  };

  const handleSaveRow = (rowIndex: number) => {
    const updatedCases = [...cases];
    updatedCases[rowIndex] = editedRow.map((cell) => (cell === "" ? "" : cell));
    setCases(updatedCases);
    setFilteredCases(updatedCases);
    setEditingRow(null);
  };

  const handleChangeCell = (value: string, cellIndex: number) => {
    const updatedRow = [...editedRow];
    updatedRow[cellIndex] = value;
    setEditedRow(updatedRow);
  };

  const handleAddRow = () => {
    const newRow = Array(cases[0].length).fill(""); // Add a new row with empty values
    const lastSrNo = cases.length > 1 ? parseInt(cases[cases.length - 1][0], 10) : 0;
    newRow[0] = (lastSrNo + 1).toString(); // Set the "Sr. No" to the next number
    newRow[newRow.length - 1] = "Pending"; // Set the "Status" to "Pending"
    setCases([...cases, newRow]);
    setFilteredCases([...cases, newRow]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updatedCases = cases.filter((_, index) => index !== rowIndex);
    setCases(updatedCases);
    setFilteredCases(updatedCases);
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredCases(cases);
      return;
    }
    const lowercasedQuery = query.toLowerCase();
    const filtered = cases.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredCases(filtered);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
      {/* Summary Cards */}
      <div className="flex flex-wrap justify-center gap-8 mt-20 lg:mt-32">
        <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-xl p-6 w-64 h-48 shadow-lg">
          <h2 className="text-2xl font-bold">Total Cases</h2>
          <p className="text-4xl font-semibold">{cases.length - 1}</p>
        </div>

        <div className="flex flex-col items-center justify-center bg-green-500 text-white rounded-xl p-6 w-64 h-48 shadow-lg">
          <h2 className="text-2xl font-bold">Active Cases</h2>
          <p className="text-4xl font-semibold">{cases.slice(1).filter((row) => row[row.length - 1] !== "Disposed off").length}</p>
        </div>

        <div className="flex flex-col items-center justify-center bg-red-500 text-white rounded-xl p-6 w-64 h-48 shadow-lg">
          <h2 className="text-2xl font-bold">Closed Cases</h2>
          <p className="text-4xl font-semibold">{cases.slice(1).filter((row) => row[row.length - 1] === "Disposed off").length}</p>
        </div>
      </div>

      {/* Drag-and-Drop Section */}
      <div
        className={`mt-4 p-4 border-2 ${dragging ? "border-gray-300 bg-gray-100" : "border-gray-500"} rounded-lg flex flex-col items-center justify-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-sm mb-2">Drag and drop your Excel files here, or click the button to upload.</p>
        <Button
          variant="secondary"
          onClick={() => document.querySelector('input[type="file"]')?.click()}
        >
          Select File
        </Button>
        <input
          type="file"
          accept=".xlsx, .xls"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {/* Search Section */}
      <div className="mt-4 w-full max-w-6xl flex justify-center">
        <Search onSearch={handleSearch} />
      </div>

      {/* Table Section */}
      <div className="mt-4 overflow-auto w-full max-w-6xl">
        {filteredCases.length > 0 ? (
          <table className="w-full border-collapse border border-gray-500 bg-white text-black text-sm">
            <thead>
              <tr className="border-b border-gray-500">
                {cases[0].map((header, index) => (
                  <th key={index} className="border border-gray-500 p-2 text-center">
                    {header}
                  </th>
                ))}
                <th className="border border-gray-500 p-2 text-center">Actions</th>
                <th className="border border-gray-500 p-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-500">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`p-2 text-center ${editingRow === rowIndex ? "" : "border border-gray-500"}`}
                    >
                      {editingRow === rowIndex ? (
                        <input
                          type="text"
                          value={editedRow[cellIndex] || ""}
                          onChange={(e) => handleChangeCell(e.target.value, cellIndex)}
                          className="bg-transparent text-center w-full"
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                  <td className="border border-gray-500 p-2 text-center">
                    {editingRow === rowIndex ? (
                      <Button variant="primary" onClick={() => handleSaveRow(rowIndex)}>
                        Save
                      </Button>
                    ) : (
                      <Button variant="secondary" onClick={() => handleEditRow(rowIndex)}>
                        Edit
                      </Button>
                    )}
                  </td>
                  <td className="border border-gray-500 p-2 text-center">
                    <Button variant="danger" onClick={() => handleDeleteRow(rowIndex + 1)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">
            No data to display. Upload files to populate the table.
          </p>
        )}
      </div>

      {/* Add Case Button */}
      <div className="mt-4 flex justify-center">
        <Button variant="secondary" onClick={handleAddRow}>
          Add Case
        </Button>
      </div>
    </div>
  );
}