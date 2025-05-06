import { useState, useEffect } from 'react';
import axiosInstance from '../../Axios/axiosInstance.js';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  ManOutlined,
  WomanOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  UploadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Input, Button, message, Upload, Spin, Divider } from 'antd';

const QuranAcademyProfile = () => {
  const [tab, setTab] = useState('profile');
  const [gender, setGender] = useState('male');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    profileUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/getProfile/6809e7a4ba4ffa4f777954b9')
      .then((response) => {
        setUser(response.data);
        setGender(response.data.gender);
      })
      .catch(() => {
        message.error('Failed to fetch user data');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('gender', gender);
    if (imageFile) {
      formData.append('file', imageFile);
    }

    axiosInstance
      .put('/updateUser/6809e7a4ba4ffa4f777954b9', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        message.success('Profile updated successfully');
      })
      .catch(() => {
        message.error('Failed to update profile');
      })
      .finally(() => setLoading(false));
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      return message.error('New passwords do not match');
    }
    if (newPassword.length < 8) {
      return message.error('Password must be at least 8 characters');
    }

    setPasswordLoading(true);
    axiosInstance
      .put('/update-password/6809e7a4ba4ffa4f777954b9', {
        currentPassword: oldPassword,
        newPassword: newPassword,
      })
      .then(() => {
        message.success('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(() => {
        message.error('Failed to update password');
      })
      .finally(() => setPasswordLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 flex flex-col items-center">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : user.profileUrl || 'https://via.placeholder.com/100'
                  }
                  alt="profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      if (file.size > 2 * 1024 * 1024) {
                        message.error('Image must be smaller than 2MB');
                        return false;
                      }
                      setImageFile(file);
                      return false;
                    }}
                    accept="image/*"
                  >
                    <Button 
                      type="text" 
                      icon={<UploadOutlined className="text-white" />}
                      className="!text-white !shadow-none"
                    />
                  </Upload>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold mt-4">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-green-100 flex items-center">
              <MailOutlined className="mr-1" /> {user.email}
            </p>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 flex gap-4 border-b border-gray-200 bg-white">
            {['profile', 'security'].map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`capitalize px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === item 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 bg-white">
            {tab === 'profile' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserOutlined className="mr-2 text-green-600" /> First Name
                    </label>
                    <Input
                      value={user.firstName}
                      onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                      className="h-10"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserOutlined className="mr-2 text-green-600" /> Last Name
                    </label>
                    <Input
                      value={user.lastName}
                      onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                      className="h-10"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <Divider className="my-2" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <ManOutlined className="text-blue-500" /> Male
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <WomanOutlined className="text-pink-500" /> Female
                    </label>
                  </div>
                </div>

                <Divider className="my-2" />

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    className="bg-green-600 hover:bg-green-700 px-6 h-10 font-medium"
                    onClick={handleSave}
                    loading={loading}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <LockOutlined className="mr-2 text-green-600" /> Current Password
                  </label>
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    placeholder="Enter your current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LockOutlined className="mr-2 text-green-600" /> New Password
                    </label>
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      placeholder="Enter new password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LockOutlined className="mr-2 text-green-600" /> Confirm New Password
                    </label>
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <Divider className="my-2" />

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    className="bg-green-600 hover:bg-green-700 px-6 h-10 font-medium"
                    onClick={handlePasswordChange}
                    loading={passwordLoading}
                    disabled={!oldPassword || !newPassword || !confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default QuranAcademyProfile;