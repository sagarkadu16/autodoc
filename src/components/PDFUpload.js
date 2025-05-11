import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { auth } from '../firebase';

const PDFUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfList, setPdfList] = useState([]);
  const [error, setError] = useState('');

  const storage = getStorage();

  useEffect(() => {
    fetchPdfList();
  }, []);

  const fetchPdfList = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const listRef = ref(storage, `pdfs/${user.uid}`);
      const res = await listAll(listRef);
      
      const pdfs = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            url,
            path: itemRef.fullPath
          };
        })
      );
      
      setPdfList(pdfs);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      setError('Failed to fetch PDFs');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please select a PDF file');
      setPdfFile(null);
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    try {
      setUploading(true);
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const storageRef = ref(storage, `pdfs/${user.uid}/${pdfFile.name}`);
      await uploadBytes(storageRef, pdfFile);
      
      // Refresh the PDF list
      await fetchPdfList();
      
      setPdfFile(null);
      setError('');
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload PDF</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>
          
          {pdfFile && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{pdfFile.name}</span>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
      </div>

      {/* PDF List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your PDFs</h2>
        {pdfList.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No PDFs uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {pdfList.map((pdf) => (
              <div key={pdf.path} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">{pdf.name}</span>
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  View PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUpload; 