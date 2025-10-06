import React, { useState } from 'react';
import { 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFileImage, 
  FaDownload,
  FaSearch,
  FaFilter,
  FaRegStar,
  FaStar,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { BsThreeDotsVertical, BsGridFill } from 'react-icons/bs';
import { FiList } from 'react-icons/fi';

// Department images (would typically import from assets)
const departmentImages = {
  'Company Policy': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Training': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'HR': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Company': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  'Finance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
};

const Documents = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [downloading, setDownloading] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const documents = [
    { 
      id: 1,
      name: 'Employee Handbook 2023', 
      type: 'pdf', 
      category: 'Company Policy', 
      date: '2023-01-10', 
      size: '4.2 MB',
      description: 'Comprehensive guide covering all company policies, code of conduct, and employee benefits.',
      starred: false,
      downloadUrl: 'https://example.com/documents/employee-handbook.pdf',
      previewUrl: 'https://example.com/previews/employee-handbook-preview.pdf'
    },
    { 
      id: 2,
      name: 'New Hire Training Manual', 
      type: 'word', 
      category: 'Training', 
      date: '2023-02-15', 
      size: '2.8 MB',
      description: 'Step-by-step training materials for new employees covering all essential job functions.',
      starred: true,
      downloadUrl: 'https://example.com/documents/training-manual.docx',
      previewUrl: 'https://docs.google.com/document/d/1/preview'
    },
    { 
      id: 3,
      name: 'Benefits & Compensation Guide', 
      type: 'pdf', 
      category: 'HR', 
      date: '2023-03-05', 
      size: '3.1 MB',
      description: 'Detailed information about employee benefits packages, insurance options, and compensation structure.',
      starred: false,
      downloadUrl: 'https://example.com/documents/benefits-guide.pdf',
      previewUrl: 'https://example.com/previews/benefits-guide-preview.pdf'
    },
    { 
      id: 4,
      name: 'Organizational Structure', 
      type: 'image', 
      category: 'Company', 
      date: '2023-01-20', 
      size: '1.5 MB',
      description: 'Current organizational chart showing reporting structure and department relationships.',
      starred: false,
      downloadUrl: 'https://example.com/documents/org-chart.png',
      previewUrl: 'https://example.com/documents/org-chart.png'
    },
    { 
      id: 5,
      name: 'Financial Procedures Q3', 
      type: 'excel', 
      category: 'Finance', 
      date: '2023-04-18', 
      size: '2.1 MB',
      description: 'Updated financial procedures and expense reporting guidelines for Q3 2023.',
      starred: true,
      downloadUrl: 'https://example.com/documents/financial-procedures.xlsx',
      previewUrl: 'https://docs.google.com/spreadsheets/d/1/preview'
    },
  ];

  const categories = ['All', ...new Set(documents.map(doc => doc.category))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-500 text-xl" />;
      case 'word': return <FaFileWord className="text-blue-500 text-xl" />;
      case 'excel': return <FaFileExcel className="text-green-500 text-xl" />;
      default: return <FaFileImage className="text-purple-500 text-xl" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Download method with simulated delay
  const handleDownload = async (documentId, documentName, downloadUrl) => {
    setDownloading(documentId);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would fetch the file from the server
      // For demo purposes, we'll create a temporary anchor tag
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', documentName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Track download in analytics or log it
  
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  // Preview method
  const handlePreview = async (document) => {
    setPreviewLoading(true);
    setPreviewDocument(document);
    
    // Simulate loading the preview
    await new Promise(resolve => setTimeout(resolve, 800));
    setPreviewLoading(false);
  };

  const closePreview = () => {
    setPreviewDocument(null);
    setPreviewLoading(false);
  };

  const getPreviewComponent = (document) => {
    if (!document) return null;
    
    switch (document.type) {
      case 'pdf':
      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <iframe 
              src={document.previewUrl} 
              className="w-full h-full border-0"
              title={`Preview of ${document.name}`}
            />
          </div>
        );
      case 'word':
      case 'excel':
        return (
          <div className="w-full h-full">
            <iframe 
              src={document.previewUrl} 
              className="w-full h-full border-0"
              title={`Preview of ${document.name}`}
              allow="fullscreen"
            />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-6">
              <HiOutlineDocumentText className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Preview not available</h3>
              <p className="text-gray-500 mt-2">
                This document type doesn't support preview. Please download to view.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={closePreview}></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {previewDocument.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {previewDocument.category} • {formatDate(previewDocument.date)} • {previewDocument.size}
                    </p>
                  </div>
                  <button
                    onClick={closePreview}
                    className="ml-4 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FaTimes className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Preview content area */}
                <div className="mt-4 h-96 sm:h-[32rem] border border-gray-200 rounded-lg overflow-hidden">
                  {previewLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <FaSpinner className="animate-spin text-4xl text-indigo-600" />
                    </div>
                  ) : (
                    getPreviewComponent(previewDocument)
                  )}
                </div>
              </div>
              
              {/* Footer with actions */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDownload(previewDocument.id, previewDocument.name, previewDocument.downloadUrl)}
                  disabled={downloading === previewDocument.id}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    downloading === previewDocument.id ? 'opacity-75' : ''
                  }`}
                >
                  {downloading === previewDocument.id ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Downloading...
                    </>
                  ) : (
                    <>
                      <FaDownload className="mr-2" /> Download
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closePreview}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Company Documents</h1>
          <p className="text-gray-600 mt-2">
            Access all important company files, policies, and resources in one place
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-500'}`}
          >
            <BsGridFill className="text-lg" />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-500'}`}
          >
            <FiList className="text-lg" />
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search documents by name or description..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <FaFilter className="text-gray-500" />
              <select
                className="bg-transparent border-none focus:ring-0 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Documents</p>
          <h3 className="text-2xl font-bold">{documents.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Company Policies</p>
          <h3 className="text-2xl font-bold">{documents.filter(d => d.category === 'Company Policy').length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Training Materials</p>
          <h3 className="text-2xl font-bold">{documents.filter(d => d.category === 'Training').length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Favorites</p>
          <h3 className="text-2xl font-bold">{favorites.length}</h3>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={departmentImages[doc.category] || departmentImages['Company']} 
                  alt={doc.category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <button 
                    onClick={() => toggleFavorite(doc.id)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition"
                  >
                    {favorites.includes(doc.id) || doc.starred ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                    {doc.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{doc.name}</h3>
                      <p className="text-xs text-gray-500">{formatDate(doc.date)} • {doc.size}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <BsThreeDotsVertical />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{doc.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    onClick={() => handlePreview(doc)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                  >
                    <HiOutlineDocumentText className="mr-1" /> Preview
                  </button>
                  <button 
                    onClick={() => handleDownload(doc.id, doc.name, doc.downloadUrl)}
                    disabled={downloading === doc.id}
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm flex items-center ${
                      downloading === doc.id ? 'opacity-75' : ''
                    }`}
                  >
                    {downloading === doc.id ? (
                      <>
                        <FaSpinner className="animate-spin mr-1" /> Downloading...
                      </>
                    ) : (
                      <>
                        <FaDownload className="mr-1" /> Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{doc.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(doc.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => toggleFavorite(doc.id)}
                        className="text-gray-400 hover:text-yellow-400"
                      >
                        {favorites.includes(doc.id) || doc.starred ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar />
                        )}
                      </button>
                      <button 
                        onClick={() => handlePreview(doc)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <HiOutlineDocumentText />
                      </button>
                      <button 
                        onClick={() => handleDownload(doc.id, doc.name, doc.downloadUrl)}
                        disabled={downloading === doc.id}
                        className={`text-indigo-600 hover:text-indigo-900 flex items-center ${
                          downloading === doc.id ? 'opacity-75' : ''
                        }`}
                      >
                        {downloading === doc.id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaDownload />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <HiOutlineDocumentText className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default Documents;