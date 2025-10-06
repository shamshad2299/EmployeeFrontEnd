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
  FaCloudUploadAlt,
  FaEllipsisV
} from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';

const ProfileDocuments = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Document categories with cover images
  const categories = {
    'Employment': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Identification': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Financial': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Education': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  };

  const documents = [
    { 
      id: 1,
      name: 'Employment Contract', 
      type: 'pdf', 
      category: 'Employment', 
      date: '2023-01-15', 
      size: '2.4 MB',
      description: 'Signed agreement outlining terms of employment, benefits, and company policies.',
      starred: false
    },
    { 
      id: 2,
      name: 'Government ID', 
      type: 'image', 
      category: 'Identification', 
      date: '2023-01-10', 
      size: '1.2 MB',
      description: 'Scanned copy of passport/driver license for identity verification.',
      starred: true
    },
    { 
      id: 3,
      name: 'Professional Resume', 
      type: 'word', 
      category: 'Employment', 
      date: '2023-01-05', 
      size: '0.8 MB',
      description: 'Updated CV with work history, skills, and qualifications.',
      starred: false
    },
    { 
      id: 4,
      name: 'Tax Forms', 
      type: 'pdf', 
      category: 'Financial', 
      date: '2023-03-18', 
      size: '1.5 MB',
      description: 'Completed W-2 and 1099 forms for annual tax filing.',
      starred: true
    },
    { 
      id: 5,
      name: 'Degree Certificate', 
      type: 'image', 
      category: 'Education', 
      date: '2022-12-15', 
      size: '2.1 MB',
      description: 'Official university diploma for education verification.',
      starred: false
    },
    { 
      id: 6,
      name: 'Pay Stubs', 
      type: 'pdf', 
      category: 'Financial', 
      date: '2023-04-01', 
      size: '3.2 MB',
      description: 'Monthly salary statements for the current fiscal year.',
      starred: false
    }
  ];

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

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
          <p className="text-gray-600 mt-2">
            All your important files and records in one secure place
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500'}`}
          >
            Grid View
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-500'}`}
          >
            List View
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
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
                <option value="All">All Categories</option>
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <FaCloudUploadAlt className="mr-2" />
              Upload
            </button>
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
          <p className="text-sm text-gray-500">Favorites</p>
          <h3 className="text-2xl font-bold">{favorites.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Most Recent</p>
          <h3 className="text-2xl font-bold">{formatDate(documents[0].date)}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Total Storage</p>
          <h3 className="text-2xl font-bold">11.2 MB</h3>
        </div>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={categories[doc.category]} 
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
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
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
                    <FaEllipsisV />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{doc.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    <HiOutlineDocumentText className="mr-1" /> Preview
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center">
                    <FaDownload className="mr-1" /> Download
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
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
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
                      <button className="text-blue-600 hover:text-blue-800">
                        <HiOutlineDocumentText />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 flex items-center">
                        <FaDownload />
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
          <p className="text-gray-500 mt-2">
            {searchQuery ? 
              'Try adjusting your search query' : 
              'Upload your first document to get started'}
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaCloudUploadAlt className="inline mr-2" />
            Upload Document
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDocuments;