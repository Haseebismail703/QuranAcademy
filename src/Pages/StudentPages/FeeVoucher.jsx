import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axios/axiosInstance';
import { Modal, Spin } from 'antd';

// Separate Loader Component
const Loader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <Spin size="large" />
    <p className="mt-4 text-gray-600">{text}</p>
  </div>
);

const PaymentVoucher = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [file, setFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/generate-voucher/681c8fdc6329587244535349/680c80cce7e608bd31fa9983/6821a56262f5812015504e11');
      setApiData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setFile(null);
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedRecipe) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipeId', selectedRecipe._id);
    formData.append('packageId', selectedRecipe.packageId._id);
    formData.append('studentId', selectedRecipe.studentId);

    try {
      setUploading(true);
      await axiosInstance.put('/recipe/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowUploadModal(false);
      setFile(null);
      await fetchData();
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const showImagePreview = (url) => {
    setPreviewImage(url);
  };

  if (loading) return <Loader text="Loading recipes..." />;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!apiData) return <div className="text-center py-8">No data available</div>;

  const recipes = apiData.data?.vouchers || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Fee Voucher
          </h1>
          <p className="mt-3 text-xl text-gray-500">
           {apiData.message}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Packages Checked: {apiData.data?.packagesChecked || 0} | 
            Packages Due: {apiData.data?.packagesDue || 0}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white shadow rounded-lg overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
              <div className="px-6 py-4 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {recipe.packageId?.packageName || 'Package'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Course: {recipe.courseId?.courseName || 'Unknown'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    recipe.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : recipe.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(recipe.createdAt)}
                  </p>
                </div>

                {recipe.recipeUrl && recipe.recipeUrl !== "scs" ? (
                  <div className="mb-4 min-h-[80px]">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded File:</h4>
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden cursor-pointer border border-gray-200 flex-shrink-0"
                        onClick={() => showImagePreview(recipe.recipeUrl)}
                      >
                        {recipe.recipeUrl.match(/\.(jpeg|jpg|gif|png)$/) ? (
                          <img
                            src={recipe.recipeUrl}
                            alt="Recipe"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <a
                          href={recipe.recipeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm block"
                        >
                          {recipe.recipeUrl.split('/').pop()}
                        </a>
                        <span className="text-xs text-gray-500">Click to preview</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 min-h-[80px] flex items-center">
                    <p className="text-sm text-gray-500 italic">No file uploaded</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-100">
                <button
                  disabled={recipe.status === 'approved'}
                  onClick={() => handleEditRecipe(recipe)}
                  className={`w-full px-4 py-2 rounded-md focus:outline-none text-sm ${
                    recipe.status === 'approved'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600 transition-colors cursor-pointer'
                  }`}
                >
                  {recipe.recipeUrl && recipe.recipeUrl !== "scs" ? 'Update File' : 'Add File'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No recipes found</h3>
            <p className="mt-1 text-gray-500">You haven't submitted any recipes yet.</p>
          </div>
        )}
        
        {apiData.data?.newlyCreated && apiData.data.newlyCreated.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Newly Created Recipes</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {apiData.data.newlyCreated.map((recipe) => (
                <div key={recipe._id} className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-blue-500 h-full flex flex-col">
                  <div className="px-6 py-4 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {recipe.packageId?.packageName || 'New Package'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Course: {recipe.courseId?.courseName || 'Unknown'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        Created: {formatDate(recipe.createdAt)}
                      </p>
                    </div>
                    <div className="min-h-[80px] flex items-center">
                      <p className="text-sm text-gray-500 italic">No file uploaded</p>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditRecipe(recipe)}
                      className="w-full px-4 py-2 rounded-md focus:outline-none text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      Add File
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* File Upload Modal */}
      <Modal
        title={selectedRecipe ? 'Update Recipe File' : 'Add New Recipe File'}
        open={showUploadModal}
        onCancel={() => {
          setShowUploadModal(false);
          setFile(null);
        }}
        footer={[
          <button
            key="cancel"
            onClick={() => {
              setShowUploadModal(false);
              setFile(null);
            }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none mr-2 cursor-pointer"
            disabled={uploading}
          >
            Cancel
          </button>,
          <button
            key="submit"
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded-md focus:outline-none ${
              file && !uploading
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-blue-300 text-white cursor-not-allowed'
            }`}
          >
            {uploading ? 'Uploading...' : selectedRecipe ? 'Update' : 'Upload'}
          </button>
        ]}
      >
        {uploading ? (
          <Loader text="Uploading file..." />
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedRecipe?.recipeUrl && selectedRecipe.recipeUrl !== "scs" ? 'Update recipe file' : 'Upload recipe file'}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              key={file ? 'file-selected' : 'no-file'}
            />
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width="80%"
        style={{ maxWidth: '800px' }}
      >
        <img 
          alt="Preview" 
          style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} 
          src={previewImage || null} 
        />
      </Modal>
    </div>
  );
};

export default PaymentVoucher;