import React, { useState } from 'react';
import { CameraIcon, PencilAltIcon, MailIcon, LockClosedIcon, UserIcon, SaveIcon, ShieldCheckIcon } from '@heroicons/react/outline';

const ProfilePage = () => {
  const [imageUrl, setImageUrl] = useState('https://randomuser.me/api/portraits/women/65.jpg');
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className=" bg-gradient-to-br  flex items-center justify-center">
      {/* Glass Container */}
      <div className="w-full max-w-5xl  bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl border border-white border-opacity-20 overflow-hidden">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white bg-opacity-30"></div>
            <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-white bg-opacity-20"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white">My Profile</h1>
            <p className="text-white text-opacity-90 mt-2 text-lg">Manage your personal information and account settings</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 bg-white bg-opacity-10 p-6 md:p-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center">
              <div className="relative group mb-6">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white border-opacity-50 shadow-lg">
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Camera upload button */}
                <label className="absolute bottom-0 right-0 bg-indigo-600 p-3 rounded-full cursor-pointer shadow-lg border-2 border-white transform transition-all duration-300 ">
                  <CameraIcon className="h-5 w-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {/* Glowing effect on hover */}
                <div className="absolute inset-0 rounded-full opacity-0  bg-opacity-20 transition-opacity duration-300"></div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800">Sarah Johnson</h2>
              <div className="flex items-center mt-1 text-gray-600">
                <MailIcon className="h-4 w-4 mr-1" />
                <span>sarah.johnson@example.com</span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 px-6 py-2 bg-white bg-opacity-30 hover:bg-opacity-40 rounded-full flex items-center justify-center text-gray-800 font-medium transition-all duration-300 border border-white border-opacity-30 shadow-sm hover:shadow"
              >
                {isEditing ? (
                  <>Cancel Editing</>
                ) : (
                  <>
                    <PencilAltIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-12 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'hover:bg-white hover:bg-opacity-30 text-gray-700'} transition-all duration-200`}
              >
                <UserIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">Personal Information</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center ${activeTab === 'security' ? 'bg-indigo-600 text-white' : 'hover:bg-white hover:bg-opacity-30 text-gray-700'} transition-all duration-200`}
              >
                <ShieldCheckIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">Security</span>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="w-full md:w-2/3 p-6 md:p-8">


            {activeTab === 'profile' && (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue="Sarah"
                          className="w-full px-4 py-3 bg-white bg-opacity-50 rounded-xl border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 bg-white bg-opacity-30 rounded-xl">Sarah</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue="Johnson"
                          className="w-full px-4 py-3 bg-white bg-opacity-50 rounded-xl border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 bg-white bg-opacity-30 rounded-xl">Johnson</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Gender</label>
                      {isEditing ? (
                        <select
                          defaultValue="female"
                          className="w-full px-4 py-3 bg-white bg-opacity-50 rounded-xl border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <div className="w-full px-4 py-3 bg-white bg-opacity-30 rounded-xl">Female</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Register Date</label>
                      <div className="w-full px-4 py-3 bg-white bg-opacity-30 rounded-xl">2024-01-15</div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Profile Updated</label>
                      <div className="w-full px-4 py-3 bg-white bg-opacity-30 rounded-xl">2025-04-25</div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <SaveIcon className="h-5 w-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                )}
              </>
            )}


            {activeTab === 'security' && (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white bg-opacity-50 rounded-xl border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10"
                      />
                      <LockClosedIcon className="h-5 w-5 text-gray-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white bg-opacity-50 rounded-xl border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10"
                      />
                      <LockClosedIcon className="h-5 w-5 text-gray-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white bg-opacity-50 rounded-xl border border-white border-opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10"
                      />
                      <LockClosedIcon className="h-5 w-5 text-gray-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-20 p-4 rounded-xl border border-white border-opacity-30">
                    <h4 className="font-medium text-gray-800 mb-2">Password Requirements</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                        At least 8 characters long
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                        At least one uppercase letter
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                        At least one number
                      </li>
                      <li className="flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                        At least one special character
                      </li>
                    </ul>
                  </div>

                  <button
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <LockClosedIcon className="h-5 w-5 mr-2" />
                    Update Password
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;