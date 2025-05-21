import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axios/axiosInstance';
import { Modal, Spin, message } from 'antd';

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
  const [hasNewVouchers, setHasNewVouchers] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/generate-voucher/681c8fdc6329587244535349/680c80cce7e608bd31fa9983/6821a56262f5812015504e11');
      console.log(response.data);
      setApiData(response.data);

      // Check if there are newly created vouchers
      if (response.data.data?.newlyCreated?.length > 0) {
        setHasNewVouchers(true);
        message.success('New voucher(s) generated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      message.error('Failed to fetch voucher data');
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
      message.success('Recipe uploaded successfully!');
      await fetchData();
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('Failed to upload recipe. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const showImagePreview = (url) => {
    setPreviewImage(url);
  };

  if (loading) return <div className="flex justify-center items-center h-[50vh]">
    <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
  </div>
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!apiData) return <div className="text-center py-8">No data available</div>;

  const recipes = apiData.data?.vouchers || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Fee Voucher
          </h1>
          <p className="mt-3 text-xl text-blue-600">
            {apiData.message}
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Packages Checked: {apiData.data?.packagesChecked || 0}
            </span>
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              Packages Due: {apiData.data?.packagesDue || 0}
            </span>
          </div>
        </div>

        {hasNewVouchers && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-700">New voucher(s) have been generated. Please check below.</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl h-full flex flex-col border border-gray-200">
              <div className="px-6 py-4 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {recipe.packageId?.packageName || 'Package'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Course: {recipe.courseId?.courseName || 'Unknown'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${recipe.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : recipe.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Created: {formatDate(recipe.createdAt)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Fee: {recipe.packageId?.coursePrice || '0'}
                  </div>
                </div>

                {recipe.recipeUrl && recipe.recipeUrl !== "scs" ? (
                  <div className="mb-4 min-h-[80px]">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded File:</h4>
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden cursor-pointer border border-gray-200 flex-shrink-0 hover:border-blue-500 transition-colors"
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
                  <div className="mb-4 min-h-[80px] flex items-center justify-center bg-gray-50 rounded p-4 border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500 italic">No recipe uploaded yet</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  disabled={recipe.status === 'approved'}
                  onClick={() => handleEditRecipe(recipe)}
                  className={`w-full px-4 py-2 rounded-md focus:outline-none text-sm font-medium transition-colors ${recipe.status === 'approved'
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md'
                    }`}
                >
                  {recipe.recipeUrl && recipe.recipeUrl !== "scs" ? 'Update Recipe' : 'Upload Recipe'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {recipes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No vouchers found</h3>
            <p className="mt-1 text-gray-500">You don't have any active vouchers at this time.</p>
          </div>
        )}
      </div>

      {/* Recipe Upload Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-gray-800">
            {selectedRecipe?.recipeUrl && selectedRecipe.recipeUrl !== "scs"
              ? 'Update Voucher File'
              : 'Upload Voucher File'}
          </div>
        }
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
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none mr-2 cursor-pointer transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>,
          <button
            key="submit"
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded-md focus:outline-none font-medium transition-colors ${file && !uploading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md cursor-pointer'
                : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <Spin size="small" className="mr-2" />
                Uploading...
              </span>
            ) : selectedRecipe ? (
              'Update'
            ) : (
              'Upload'
            )}
          </button>
        ]}
      >
        {uploading ? (
          <Loader text="Uploading file..." />
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedRecipe?.recipeUrl && selectedRecipe.recipeUrl !== "scs"
                ? 'Update voucher file'
                : 'Upload voucher file (PDF, JPG, PNG)'}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      key={file ? 'file-selected' : 'no-file'}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG up to 10MB
                </p>
              </div>
            </div>
            {file && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-2 overflow-hidden">
                    <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</div>
                  </div>
                </div>
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
        centered
      >
        <div className="flex justify-center">
          <img
            alt="Preview"
            style={{ maxHeight: '70vh', objectFit: 'contain' }}
            src={previewImage || null}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PaymentVoucher;