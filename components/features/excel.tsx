"use client";

import { FaUpload, FaEye, FaDownload, FaEdit, FaTrashAlt } from 'react-icons/fa';
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Search from "./search";
import { Trash2, Edit } from "lucide-react";
import AddCaseModal from "@/components/AddCaseModal";
import styles from './excel.module.css';
import Progress from "@/components/features/loader"
import Filter from "./filter";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { FaSpinner } from "react-icons/fa"; // Import a spinner icon

const ExcelComponent = () => {
  // Case Interface Updated to include 'attachment'
  interface Case {
    sr_no: number;
    date_of_hearing: string;
    cp_sa_suit: string;
    subject: string;
    petitioner: string;
    court: string;
    concerned_office: string;
    comments: string;
    last_hearing_date: string;
    remarks: string;
    attachment?: string; // Added attachment field
  }


  const { toast } = useToast();

  const { data: session } = useSession({ required: true })

  const [cases, setCases] = useState<Case[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<Case[]>([]);

  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<Case>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [remarksIndex, setRemarksIndex] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [pdfId, setpdfId] = useState();

  const [isFilterModalOpen, setFilterModalOpen] = useState(false);


  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/CourtCases');
        const json = await response.json();
        if (json && Array.isArray(json)) {
          setData(json);
          console.log("Data fetched: ", json); // Log data here

          // Filter out the '_id' property
          const filteredHeaders = Object.keys(json[0]).filter(header => header !== '_id');
          setHeaders(filteredHeaders);
          setCases(json);
          setFilteredCases(json);

          // Dynamically find the Remarks column index
          const remarksIdx = filteredHeaders.findIndex(header => header.toLowerCase() === 'remarks');
          setRemarksIndex(remarksIdx);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, []);

  const handleSaveChanges = () => {
    localStorage.setItem('tableData', JSON.stringify(cases));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    let filtered = [...cases];

    if (query) {
      filtered = filtered.filter(row =>
        Object.values(row).some(cell =>
          cell?.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
    }

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
    } finally {
      if (!error) {
        toast({
          title: "success",
          description: "your data has been updated",
          variant: "success"
        });
      } else {
        toast({
          title: "Error",
          description: "error updating ,please try again",
          variant: "destructive"
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
      const sr_no = cases[rowIndex].sr_no;

      // Send the DELETE request to the API
      const response = await fetch('/api/CourtCases', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sr_no }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the deleted case from the state
        const updatedCases = cases.filter((_, index) => index !== rowIndex);
        setCases(updatedCases);
        setFilteredCases(updatedCases);
        handleSaveChanges(); // Optionally save changes to localStorage
      } else {
        // If the API returns an error, show a message
        console.error('Error deleting case:', data.message);
      }
    } catch (error) {
      setError(error)
      console.error('Error:', error);
    } finally {
      if (!error) {
        toast({
          title: "success",
          description: "your data has been deleted",
          variant: "success"
        });
      } else {
        toast({
          title: "Error",
          description: "error deleting ,please try again",
          variant: "destructive"
        });
      }
    }
  };


  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAddCaseClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleOpenFilterModal = () => {
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
  };

  // Handle file upload for PDF attachments
  const handleFileUpload = async (file: File, cp_sa_suit: string) => {
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      // Show toast notification during upload
      toast({
        title: "Uploading file",
        description: `Uploading PDF for case: ${cp_sa_suit}`,
      });

      const response = await fetch('/api/Upload', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      setpdfId(result.data)

      if (response.ok) {
        // Update the specific case's attachment in state
        const updatedCases = cases.map((c) =>
          c.cp_sa_suit === cp_sa_suit ? { ...c, attachment: result.fileUrl } : c
        );

        setCases(updatedCases);
        setFilteredCases(updatedCases); // Reflect changes in filtered data

        toast({
          title: "File uploaded successfully",
          description: `The PDF has been uploaded for case: ${cp_sa_suit}`,
          variant: "success",
        });
      } else {
        throw new Error(result.message || "Failed to upload the file");
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: `Error uploading PDF for case: ${cp_sa_suit}`,
        variant: "destructive",
      });
    }
  };

  const [downloading, setDownloading] = useState(false); // Add downloading state

  const handleDownload = async () => {
    setDownloading(true); // Show loader
    try {
      const response = await fetch(`/api/Get/${pdfId}`);
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "DownloadedPdf";
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download Error",
        description: "Unable to download the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false); // Hide loader
    }
  };

  // Open PDF preview in a new tab (unchanged)
  const handleFilePreview = () => {

    const url = `/api/Get/${pdfId}`;
    window.open(url, '_blank');
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
    <div ref={topRef} className="min-h-screen bg-white text-black p-6">

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Total Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-blue-700">{totalCases}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Active Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-green-600">{activeCases}</p>
        </div>
        <div className="p-4 rounded-lg bg-white border border-gray-400 shadow-sm">
          <h3 className="text-sm font-medium text-black">Closed Cases</h3>
          <p className="text-2xl font-semibold mt-2 text-red-600">{closedCases}</p>
        </div>
      </div>

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
                <Button onClick={handleCloseFilterModal} className="hover:bg-gray-700 bg-gray-600 text-white  px-4 py-2 rounded">
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

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table ref={tableRef} className="w-full border-collapse table-fixed">
          <thead>
            <tr className={styles.hidden}>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 px-2 py-4 text-sm font-semibold text-black bg-gray-100 text-center break-words"
                  style={{
                    wordWrap: "break-word", // Allow wrapping within words
                    whiteSpace: "normal",  // Enable multi-line text
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
            <tr className='bg-gray-100'>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>SR. NO</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>DATE OF HEARING</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>CP/SA /SUIT</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>SUBJECT</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>PETITIONER</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>COURT</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>CONCERNED OFFICE</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>COMMENTS FILED (Y/N)</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>LAST HEARING DATE</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>REMARKS</th>
              <th className='py-3 px-4 text-left font-semibold border-b text-xs'>ATTACHMENT</th>
              {session?.user?.role && (

                <th className='py-3 px-4 text-left font-semibold border-b text-xs'>ACTIONS</th>
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
                {/* Dynamically generate SR. NO based on rowIndex */}
                <td className="border border-gray-300 p-2 text-sm text-black">
                  {rowIndex + 1}
                </td>
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


                {/* PDF Attachment Column */}
                {/* File Actions Column */}
                <td className="border border-gray-300 p-2 text-center">
                  {downloading ? (
                    <div className="flex justify-center items-center">
                      <FaSpinner className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <a onClick={handleFilePreview} className="cursor-pointer text-blue-600 hover:text-blue-800">
                        <FaEye className="h-4 w-4" title="View File" />
                      </a>
                      <a onClick={handleDownload} className="text-blue-600 hover:text-blue-800">
                        <FaDownload className="h-4 w-4" title="Download File" />
                      </a>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], row.cp_sa_suit)}
                          className="hidden"
                        />
                        <FaUpload
                          className="h-4 w-4 text-green-600 hover:text-green-800 cursor-pointer"
                          title="Upload File"
                        />
                      </label>
                    </div>
                  )}
                </td>

                {/* Actions Column (Edit and Delete) */}
                {session?.user?.role && (


                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center gap-2">
                      {editingRow === rowIndex ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSave(rowIndex)}
                          className="text-green-600 hover:text-green-800"
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
                )
                }
              </tr>
            ))}

          </tbody>



        </table>



      </div>

      <Button onClick={scrollToTop} className="bg-gray-600 pt-2 pb-2 gap-x-2 gap-y-2 hover:bg-gray-700 text-white px-4 py-2 rounded">
        Scroll to Top
      </Button>

    </div>

  );
};
// This website is proudly created by three dedicated individuals, Shaheer Yousuf (@shaheer__yousuf),Emroze Khan (@notemrozekhan) and Saim Khalid (@i_saim_khalid). Follow them on Instagram to visualize your dreams into!
export default ExcelComponent;
