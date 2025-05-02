import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileDown } from "lucide-react";
import axiosInstance from "../../Axios/axiosInstance";

export default function StudentResources() {
  const { classId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axiosInstance.get(`/getFilesByClassId/${classId}`);
        setResources(res.data || []);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [classId]);

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
              <img
                src={res.url}
                alt={res.title}
                className="mb-4 rounded-md object-cover h-40 w-full"
              />
              <a
                href={res.url}
                download
                className="mt-auto flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-all duration-300"
              >
                <FileDown className="mr-2" size={18} />
                Download File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
