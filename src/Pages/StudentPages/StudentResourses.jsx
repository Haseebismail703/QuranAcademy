import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileDown, Eye, Image as ImageIcon } from "lucide-react";
import axiosInstance from "../../Axios/axiosInstance";

export default function StudentResources() {
  const { classId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to handle file download
  const handleDownload = async (url, filename) => {
    try {
      // Fetch the file
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      // Add appropriate extension based on file type
      if (isPDF(url)) {
        a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      } else if (isImage(url)) {
        const extension = getImageExtension(url);
        a.download = filename.endsWith(extension) ? filename : `${filename}.${extension}`;
      } else {
        a.download = filename;
      }
      
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback to normal download if the above fails
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axiosInstance.get(`/getFilesByClassId/${classId}`);
        setResources(res.data || []);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [classId]);

  // Check if resource is PDF
  const isPDF = (url) => {
    return url.toLowerCase().endsWith('.pdf') || 
           (url.includes('cloudinary') && url.includes('/raw/'));
  };

  // Check if resource is an image
  const isImage = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // Get image extension from URL
  const getImageExtension = (url) => {
    const match = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)/);
    return match ? match[1] : 'png'; // default to png if extension not found
  };

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Resources for this course {resources[0]?.classId?.courseId?.courseName}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : resources.length === 0 ? (
        <p className="text-gray-600 text-center">No resources found for this course.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res._id}
              className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold mb-4">{res.title}</h2>
              
              {/* Show appropriate preview based on file type */}
              {isImage(res.url) ? (
                <img
                  src={res.url}
                  alt={res.title}
                  className="mb-4 rounded-md object-cover h-40 w-full"
                />
              ) : isPDF(res.url) ? (
                <div className="mb-4 h-40 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <FileDown size={48} className="text-gray-400" />
                  <span className="sr-only">PDF Document</span>
                </div>
              ) : (
                <div className="mb-4 h-40 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <FileDown size={48} className="text-gray-400" />
                  <span className="sr-only">Document</span>
                </div>
              )}
              
              <div className={`flex gap-2 mt-auto ${isImage(res.url) ? '' : 'justify-center'}`}>
                {/* Show View button only for images */}
                {isImage(res.url) && (
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-all duration-300"
                  >
                    <Eye className="mr-2" size={18} />
                    View
                  </a>
                )}
                
                {/* Download Button - handles all file types */}
                <button
                  onClick={() => handleDownload(res.url, res.title)}
                  className={`flex items-center justify-center cursor-pointer ${
                    isImage(res.url) ? 'flex-1' : 'w-full'
                  } bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition-all duration-300`}
                >
                  <FileDown className="mr-2" size={18} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}