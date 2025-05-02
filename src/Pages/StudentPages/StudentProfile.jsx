import React, { useState } from "react";
import {
  User,
  BookOpen,
  Calendar,
  Edit,
  Lock,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Check,
  X,
} from "lucide-react";

const StudentProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "Ahmed",
    lastName: "Abdullah",
    email: "ahmed.abdullah@almadinah.edu",
    gender: "Male",
    registerDate: "2022-01-15",
    profileUpdateDate: "2023-06-20",
    classes: [
      {
        name: "Quran Memorization (Hifz)",
        timing: "Mon, Wed, Fri 5:00-6:30 PM",
        status: "Active",
        enrollmentDate: "2022-01-20",
      },
      {
        name: "Tajweed Rules",
        timing: "Tue, Thu 4:00-5:00 PM",
        status: "Completed",
        enrollmentDate: "2022-03-10",
      },
    ],
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [imageSrc, setImageSrc] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      profileUpdateDate: new Date().toISOString().split("T")[0],
    }));
    setEditMode(false);
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden w-full ">
      <div className="bg-black p-4 md:p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Student Profile</h1>
            <p className="text-gray-300 flex items-center mt-1">
              <MapPin size={16} className="mr-1" />
              Al-Madinah Quran Academy
            </p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-md font-medium text-sm md:text-base ${
              editMode
                ? "bg-white text-black hover:bg-gray-200"
                : "border border-white text-white hover:bg-gray-900"
            } transition-colors`}
          >
            {editMode ? (
              <>
                <X size={16} className="mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit size={16} className="mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-6 border-b border-gray-200 pb-6">
          <button
            className="w-full flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("personal")}
            aria-expanded={activeSection === "personal"}
            aria-controls="personal-section"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
              <User className="mr-2 text-gray-600" size={20} />
              Personal Information
            </h2>
            {activeSection === "personal" ? <ChevronUp /> : <ChevronDown />}
          </button>

          <div 
            id="personal-section" 
            className={`mt-4 ${activeSection !== "personal" ? "hidden" : ""}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={36} className="text-gray-500" />
                    )}
                  </div>
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                      <Edit size={14} className="text-gray-700" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        aria-label="Upload profile picture"
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  {editMode ? (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="firstName" className="block text-sm text-gray-600 mb-1">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-black focus:border-black outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm text-gray-600 mb-1">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-black focus:border-black outline-none transition"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                        {formData.firstName} {formData.lastName}
                      </h3>
                      <p className="text-gray-600">Quranic Student</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center text-gray-600 mb-1 sm:mb-0">
                    <Mail size={16} className="mr-2" />
                    <span>Email</span>
                  </div>
                  <span className="font-medium text-gray-800 break-all">
                    {formData.email}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center text-gray-600 mb-1 sm:mb-0">
                    <User size={16} className="mr-2" />
                    <span>Gender</span>
                  </div>
                  {editMode ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-1 focus:ring-1 focus:ring-black focus:border-black outline-none transition"
                      aria-label="Select gender"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span className="font-medium text-gray-800">
                      {formData.gender}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-200">
                  <div className="flex items-center text-gray-600 mb-1 sm:mb-0">
                    <Calendar size={16} className="mr-2" />
                    <span>Registered</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {formData.registerDate}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2">
                  <div className="flex items-center text-gray-600 mb-1 sm:mb-0">
                    <Calendar size={16} className="mr-2" />
                    <span>Last Updated</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {formData.profileUpdateDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 border-b border-gray-200 pb-6">
          <button
            className="w-full flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("classes")}
            aria-expanded={activeSection === "classes"}
            aria-controls="classes-section"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
              <BookOpen className="mr-2 text-gray-600" size={20} />
              Classes & Courses
            </h2>
            {activeSection === "classes" ? <ChevronUp /> : <ChevronDown />}
          </button>

          <div 
            id="classes-section" 
            className={`mt-4 ${activeSection !== "classes" ? "hidden" : ""}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.classes.map((cls, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-md border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {cls.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock size={14} className="mr-1 flex-shrink-0" />
                        <span>{cls.timing}</span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                        cls.status === "Active"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {cls.status}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 flex items-center">
                    <Calendar size={14} className="mr-2 flex-shrink-0" />
                    <span>Enrolled on: {cls.enrollmentDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            className="w-full flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("password")}
            aria-expanded={activeSection === "password"}
            aria-controls="password-section"
          >
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
              <Lock className="mr-2 text-gray-600" size={20} />
              Change Password
            </h2>
            {activeSection === "password" ? <ChevronUp /> : <ChevronDown />}
          </button>

          <div 
            id="password-section" 
            className={`mt-4 ${activeSection !== "password" ? "hidden" : ""}`}
          >
            <div className="bg-gray-50 p-4 md:p-6 rounded-md border border-gray-200">
              <form className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="block text-gray-700 mb-2 font-medium">
                    Old Password
                  </label>
                  <input
                    id="oldPassword"
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-black focus:border-black outline-none transition"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-gray-700 mb-2 font-medium">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-black focus:border-black outline-none transition"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-medium">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-black focus:border-black outline-none transition"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="button"
                  className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center order-1 sm:order-2"
            >
              <Check size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;