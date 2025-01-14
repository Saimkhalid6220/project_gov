'use client';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import React, { useRef, useState } from 'react';

const AddCaseModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    date_of_hearing: '',
    cp_sa_suit: '',
    subject: '',
    petitioner: '',
    court: '',
    concerned_office: '',
    comments: '',
    last_hearing_date: '',
    remarks: '',
  });

  const { toast } = useToast();
  const [error, setError] = useState('');

  const isFirstExecution = useRef(true)

  const handleNext = () => {
    if (step === 0 && !formData.cp_sa_suit.trim()) {
      toast({
        title: 'Validation Error',
        description: 'The CP/SA/Suit field is required.',
        variant: 'destructive',
      });
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final Validation before submission
    if (isFirstExecution.current) {
      isFirstExecution.current = false;
      return;
    } else if(!formData.cp_sa_suit.trim()) {
      toast({
        title: 'Validation Error',
        description: 'The CP/SA/SUIT field is required.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Creating case...',
      description: 'Please wait.',
    });

    try {
      await axios.post('/api/CourtCases', formData);
      console.log('Form data submitted:', formData);

      toast({
        title: 'Success',
        description: 'Case created successfully.',
        variant: 'success',
      });

      window.location.href = process.env.NEXT_PUBLIC_BASE_URL;
    } catch (err) {
      console.error(err);
      setError('Error creating case');
      toast({
        title: 'Failure',
        description: 'Error creating the case.',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-gray-50 rounded-lg p-8 w-full max-w-xl shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Add New Case</h2>

        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Date of Hearing:</label>
                <input
                  type="text"
                  name="date_of_hearing"
                  value={formData.date_of_hearing}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">CP/SA/Suit:</label>
                <input
                  type="text"
                  name="cp_sa_suit"
                  required
                  value={formData.cp_sa_suit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Petitioner:</label>
                <input
                  type="text"
                  name="petitioner"
                  value={formData.petitioner}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Court:</label>
                <input
                  type="text"
                  name="court"
                  value={formData.court}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Concerned Office:</label>
                <input
                  type="text"
                  name="concerned_office"
                  value={formData.concerned_office}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Last Hearing Date:</label>
                <input
                  type="text"
                  name="last_hearing_date"
                  value={formData.last_hearing_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Comments:</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Remarks:</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            {step <2 ? (
  <button
    type="button" // Change type to "button"
    onClick={handleNext}
    className="bg-blue-500 text-white text-sm py-2 px-8 rounded-lg hover:bg-blue-600"
  >
    Next
  </button>
) : (
  <button
    type="submit"
    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
  >
    Submit
  </button>
)}

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCaseModal;
