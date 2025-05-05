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
} from '@ant-design/icons';
import { Input, Button, message, Upload } from 'antd';

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

  useEffect(() => {
    axiosInstance
      .get('/getProfile/6809e7a4ba4ffa4f777954b9')
      .then((response) => {
        setUser(response.data);
        setGender(response.data.gender);
      })
      .catch(() => {
        message.error('Failed to fetch user data');
      });
  }, []);
  const handleSave = () => {
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
      .catch((error) => {
        message.error('Failed to update profile');
        console.error(error);
      });
  };
  

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      return message.error('New passwords do not match');
    }

    axiosInstance
      .post('/changePassword', {
        userId: '6809e7a4ba4ffa4f777954b9',
        oldPassword,
        newPassword,
      })
      .then(() => {
        message.success('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(() => {
        message.error('Failed to update password');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 flex flex-col items-center">
          <img
            src={imageFile}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-2 object-cover"
          />
          <h2 className="text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-green-100">{user.email}</p>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 flex gap-4 border-b border-gray-200 bg-white">
          {['profile', 'security'].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`capitalize px-4 py-2 rounded-md text-sm font-medium ${
                tab === item ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          {tab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserOutlined className="mr-2" /> First Name
                </label>
                <Input
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <UserOutlined className="mr-2" /> Last Name
                </label>
                <Input
                  value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="flex gap-6 mt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                    />
                    <ManOutlined className="text-blue-500" /> Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                    />
                    <WomanOutlined className="text-pink-500" /> Female
                  </label>
                </div>
              </div>


              <div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Upload Profile Image
  </label>
  <Input
    type="file"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
  />
</div>




            </div>
          )}

          {tab === 'security' && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <LockOutlined className="mr-2" /> Old Password
                </label>
                <Input.Password
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <LockOutlined className="mr-2" /> New Password
                </label>
                <Input.Password
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <LockOutlined className="mr-2" /> Confirm New Password
                </label>
                <Input.Password
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="col-span-2 text-right">
                <Button
                  type="primary"
                  className="bg-green-600 hover:bg-green-700 mt-4"
                  onClick={handlePasswordChange}
                >
                  Change Password
                </Button>
              </div>
            </div>
          )}

          {/* Save Button */}
          {tab === 'profile' && (
            <div className="text-right mt-6">
              <Button
                type="primary"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuranAcademyProfile;
