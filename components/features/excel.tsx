"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Search from "./search";
import { Trash2, Edit } from "lucide-react";
import { FaUpload, FaEye } from "react-icons/fa";
import AddCaseModal from "@/components/AddCaseModal";
import styles from './excel.module.css';
import Progress from "@/components/features/loader";
import Filter from "./filter";
import { PDFDocument } from 'pdf-lib';
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const ExcelComponent = () => {
  interface Case {
    date_of_hearing: string;
    cp_sa_suit: string;
    subject: string;
    petitioner: string;
    court: string;
    concerned_office: string;
    comments: string;
    last_hearing_date: string;
    remarks: string;
    pdf_url?: string;
    status?: string;
  }
  
  const {toast} = useToast();

  const {data:session} = useSession({required:true})

  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<Case>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [remarksIndex, setRemarksIndex] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const headers = [
    "SR.NO",
    "DATE OF HEARING",
    "CP/SA /SUIT",
    "SUBJECT",
    "PETITIONER",
    "COURT",
    "CONCERNED OFFICE",
    "COMMENTS FILED (Y/N)",
    "LAST HEARING DATE",
    "REMARKS",
    "ACTIONS",
    "UPLOAD PDF",
    "VIEW PDF"
  ];
  const columnWidths = {
    "SR.NO": "50px",
    "DATE OF HEARING": "150px",
    "CP/SA /SUIT": "100px",
    "SUBJECT": "200px",
    "PETITIONER": "150px",
    "COURT": "100px",
    "CONCERNED OFFICE": "150px",
    "COMMENTS FILED (Y/N)": "150px",
    "LAST HEARING DATE": "150px",
    "REMARKS": "200px",
    "ACTIONS": "100px",
    "UPLOAD PDF": "100px",
    "VIEW PDF": "100px"
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [error,setError] = useState()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/CourtCases');
        const data = await response.json();

        const updatedCases = data.map((caseItem: Case) => {
          const remarks = caseItem.remarks.trim().toLowerCase();
          if (remarks === '' || remarks === 'pending' || remarks === '-') {
            caseItem.status = 'Active';
          } else {
            caseItem.status = 'Closed';
          }
          return caseItem;
        });

        setCases(updatedCases);
        setFilteredCases(updatedCases);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    const filtered = cases.filter((caseItem) =>
      Object.values(caseItem).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCases(filtered);
  };


  const totalCases = cases.length;

  const activeCases = cases.filter(row => {
    if (remarksIndex !== null) {
      const value = row[headers[remarksIndex]]?.toString().toLowerCase().trim() || '';
      return value === 'pending' || value === '' || value === '-';
    }
    return false;
  }).length;

  const closedCases = totalCases - activeCases;

  const handleEdit = (rowIndex: number) => {
    setEditingRow(rowIndex);
    setEditedData(filteredCases[rowIndex]);
  };

  const handleSave = async (rowIndex: number) => {
    // Check if the user is an admin
      toast({
        title: "saving in the database",
        description: "please wait",
      });
    try {
      // Prepare the data to send to the API
      const updatedData = editedData as Case;
      const updatedCase = { sr_no: cases[rowIndex].sr_no, updateData: updatedData };

      // Send the update request to the API
      const response = await fetch('/api/CourtCases', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCase),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the cases state with the new data if the request was successful
        const updatedCases = [...cases];
        updatedCases[rowIndex] = updatedData;
        setCases(updatedCases);
        setFilteredCases(updatedCases);

        // Close the editing state
        setEditingRow(null);
        setEditedData({});
        handleSaveChanges(); // Optionally save changes to localStorage
      } else {
        // If the API returns an error, show a message
        console.error('Error updating case:', data.message);
      }
    } catch (error) {
      setError(error)
      console.error('Error:', error);
    } finally{
      if(!error){
        toast({
          title: "success",
          description: "your data has been updated",
          variant:"success"
        });
      } else {
        toast({
          title: "Error",
          description: "error updating ,please try again",
          variant:"destructive"
        });
      }
    }
  };

  const handleDelete = async (rowIndex: number) => {

    toast({
      title: "deleting from the database",
      description: "please wait",
    })

    try {
      const caseToDelete = cases[rowIndex];
      const sr_no = cases[rowIndex].sr_no;

      // Send the DELETE request to the API
      const response = await fetch('/api/CourtCases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sr_no: caseToDelete.sr_no }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedCases = cases.filter((_, index) => index !== rowIndex);
        setCases(updatedCases);
        setFilteredCases(updatedCases);
      } else {
        console.error('Error deleting case');
      }
    } catch (error) {
      setError(error)
      console.error('Error:', error);
    } finally{
      if(!error){
        toast({
          title: "success",
          description: "your data has been deleted",
          variant:"success"
        });
      } else {
        toast({
          title: "Error",
          description: "error deleting ,please try again",
          variant:"destructive"
        });
      }
    }
  };

  const handleEdit = (rowIndex: number) => {
    setEditingRow(rowIndex);
    setEditedData(filteredCases[rowIndex]);
  };

  const handleSave = async () => {
    try {
      if (editingRow !== null) {
        const updatedCases = [...cases];
        updatedCases[editingRow] = { ...updatedCases[editingRow], ...editedData };

        const response = await fetch('/api/CourtCases', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sr_no: updatedCases[editingRow].sr_no, updateData: editedData }),
        });

        if (response.ok) {
          setCases(updatedCases);
          setFilteredCases(updatedCases);
          setEditingRow(null);
          setEditedData({});
        } else {
          console.error('Error updating case');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleAddCaseClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const scrollToBottom = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const handleUploadPDF = async (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });

        // In this example, we assume that the PDF is uploaded to a server and we get the URL.
        const updatedCases = [...cases];
        updatedCases[rowIndex].pdf_url = 'URL_OF_THE_UPLOADED_PDF'; // Replace this with actual URL after upload
        setCases(updatedCases);
        setFilteredCases(updatedCases);
      } catch (error) {
        console.error('Error uploading PDF:', error);
      }
    }
  };



  if (loading) {
    return (
      <Progress />
    );
  }

  const getDateDifference = (hearingDate: string): number => {
    const today = new Date();
    const hearing = new Date(hearingDate);
    const difference = (hearing.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return difference;
  };

  const getRowClass = (hearingDate: string) => {
    const diff = getDateDifference(hearingDate);
    if (diff <= 7 && diff > 3) {
      return "bg-yellow-200"; // Yellow if within a week
    } else if (diff <= 3 && diff >= 2) {
      return "bg-red-200"; // Red if within 3 to 2 days
    }
    return ""; // No class if outside these ranges
  };

  if (loading) {
    return <Progress />;
  }


  return (
    <div ref={topRef} className="min-h-screen bg-white text-black p-6" style={{ zoom: 0.75 }}>
      {/* Stats for cases */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Total Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-blue-700">{cases.length}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Active Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-green-600">{cases.filter(c => c.status === 'Active').length}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Closed Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-red-600">{cases.filter(c => c.status === 'Closed').length}</p>
        </div>
      </div>

      {/* Filter, Scroll, and Search buttons */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Filter Modal */}
        {isFilterModalOpen ? (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Filter Cases</h2>
              <Filter
                headers={headers}
                cases={cases}
                setFilteredCases={setFilteredCases}
                setShowModal={setShowModal}
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button onClick={handleCloseFilterModal} className="hover:bg-gray-700 bg-gray-600 text-white text-white px-4 py-2 rounded">

                  Close
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button onClick={handleOpenFilterModal} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Filter
          </Button>
        )}
        <Button onClick={scrollToBottom} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
          Scroll to Bottom
        </Button>

        <Search onSearch={handleSearch} />

        <div className="flex gap-2">
          <Button onClick={handleAddCaseClick} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
            Add Case
          </Button>
          <AddCaseModal isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
      </div>

      {/* Table of Cases */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table ref={tableRef} className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-2 py-4 text-sm font-semibold text-black bg-gray-100 text-center"
                  style={{ width: columnWidths[header] }}
                >
                  {header}
                </th>
              ))}
            </tr>
            <tr>
        <th>SR. NO</th>
        <th>DATE OF HEARING</th>
        <th>CP/SA /SUIT</th>
        <th>SUBJECT</th>
        <th>PETITIONER</th>
        <th>COURT</th>
        <th>CONCERNED OFFICE</th>
        <th>COMMENTS FILED (Y/N)</th>
        <th>LAST HEARING DATE</th>
        <th>REMARKS</th>
        {session?.user?.role && (

          <th>ACTIONS</th>
        )
        }
      </tr>

    </thead>
    <tbody>
      {filteredCases.map((row, rowIndex) => (
        <tr
        key={rowIndex}
        className={`${getRowClass(row.date_of_hearing)} ${editingRow === rowIndex ? "bg-white text-black" : ""
          }`}
      >
          {headers.map((header, cellIndex) => (
            <td
              key={cellIndex}
              className="border border-gray-300 p-2 text-sm text-black"
            >
              {editingRow === rowIndex ? (
                <input
                  type="text"
                  value={editedData[header] || row[header] || ""}
                  onChange={(e) => {
                    const newData = { ...editedData };
                    newData[header] = e.target.value;
                    setEditedData(newData);
                  }}
                  className="w-full p-1 border rounded bg-white text-black"
                />
              ) : (
                row[header] || "-" // Add a hyphen if the cell value is empty or null
              )}
            </td>
          ))}
          { session?.user?.role && (

            
            <td className="border border-gray-300 p-2">
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
                    className="text-black hover:text-green-800 hover:bg-gray-50"
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
                <td className="border border-gray-300 p-2 text-sm text-black" style={{ width: columnWidths["UPLOAD PDF"] }}>
                  <label htmlFor={upload-pdf-${rowIndex}} className="cursor-pointer">
                    <FaUpload className="h-4 w-4 text-black hover:text-blue-600" />
                  </label>
                  <input
                    id={upload-pdf-${rowIndex}}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleUploadPDF(e, rowIndex)}
                    className="hidden"
                  />
                </td>
                <td className="border border-gray-300 p-2 text-sm text-black" style={{ width: columnWidths["VIEW PDF"] }}>
                  {row.pdf_url ? (
                    <Button variant="ghost" size="sm" className="text-black hover:text-blue-600 hover:bg-gray-50" onClick={() => window.open(row.pdf_url, '_blank')}>
                      <FaEye className="h-4 w-4" />
                    </Button>
                  ) : (
                    "No PDF"
                  )}
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
