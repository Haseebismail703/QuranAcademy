import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Pages/AdminPages/AdminDashboard.jsx";
import AdminLayout from "./Components/AdminComponent/AdminLayout.jsx";
import ManageTaechers from "./Pages/AdminPages/ManageTaechers.jsx";
import ManageCourse from "./Pages/AdminPages/ManageCourse.jsx";
import ManageClass from "./Pages/AdminPages/ManageClass.jsx";
import AllStudent from "./Pages/AdminPages/AllStudent.jsx";
import AddStudent from "./Pages/AdminPages/AddStudent.jsx";
import ManagePackage from "./Pages/AdminPages/ManagePackage.jsx";
import SendNotification from "./Pages/AdminPages/SendNotification.jsx";
import TeacherLayout from "./Components/TeacherComponent/TeacherLayout.jsx";
import TeacherDashboard from './Pages/TeacherPages/TaecherDashboard.jsx'
import Class from "./Pages/TeacherPages/Class.jsx";
import AddResources from "./Pages/TeacherPages/AddResourses.jsx";
import ClassNotification from "./Pages/TeacherPages/ClassNotification.jsx";
import EnrolledStudent from "./Pages/TeacherPages/EnrolledStudent.jsx";
import MarkAttendence from "./Pages/TeacherPages/MarkAttendence.jsx";
import BasicQuranReading from "./Pages/HomePages/BasicQuranReading.jsx";
import Contact from './Pages/HomePages/Contact.jsx'
import QuranMemorization from './Pages/HomePages/QuranMemorization.jsx'
import QuranCourseForKids from './Pages/HomePages/QuranCourseForKids.jsx'
import LearnQuran from './Pages/HomePages/LearnQuran.jsx'
import StudentLayout from "./Components/StudentComponent/StudentLayout.jsx";
import StudentDashboard from './Pages/StudentPages/StudentDashboard.jsx'
import StudentClass from './Pages/StudentPages/StudentClass.jsx'
import TeacherProfile from "./Pages/TeacherPages/TeacherProfile.jsx";
import StudentProfile from './Pages/StudentPages/StudentProfile.jsx'
import CareersPage from "./Pages/HomePages/Career.jsx";
// auth
import Login from './Pages/Auth/Login.jsx'
import Register from './Pages/Auth/Register.jsx'
import StudentResourses from "./Pages/StudentPages/StudentResourses.jsx";
import StudentFee from "./Pages/StudentPages/StudentFee.jsx";
import AdminProfile from "./Pages/AdminPages/AdminProfile.jsx";
import FeeVoucher from "./Pages/StudentPages/FeeVoucher.jsx";
import AllCareer from "./Pages/AdminPages/ManageCareer.jsx";
import StudentNotification from "./Pages/StudentPages/StudentNotification.jsx";
import TeacherNoti from "./Pages/TeacherPages/TeacherNoti.jsx";
import AllVoucher from "./Pages/AdminPages/Allvoucher.jsx";

// Lazy load components
const Home = lazy(() => import("./Pages/HomePages/Home.jsx"));
const About = lazy(() => import("./Pages/HomePages/AboutUs.jsx"));
const Services = lazy(() => import("./Pages/HomePages/Services.jsx"));
const PageNotFound = lazy(() => import("./Pages/HomePages/PageNotFound.jsx"));

// context 
import UserProvider from "./Context/UserContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/basic-quran-reading" element={<BasicQuranReading />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quran-memorization-hifz" element={<QuranMemorization />} />
          <Route path="/quran-course-for-kids" element={<QuranCourseForKids />} />
          <Route path="/learn-islamic-concepts" element={<LearnQuran />} />
          <Route path="/career" element={<CareersPage />} />


          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />



          {/* Admin Routes with Sidebar */}
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="manage-teachers" element={<ManageTaechers />} />
                  <Route path="manage-course" element={<ManageCourse />} />
                  <Route path="manage-class" element={<ManageClass />} />
                  <Route path="manage-class/all-students/:classId" element={<AllStudent />} />
                  <Route path="manage-class/add-student/:courseId" element={<AddStudent />} />
                  <Route path="manage-package" element={<ManagePackage />} />
                  <Route path="notification" element={<SendNotification />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="career" element={<AllCareer />} />
                  <Route path="allvoucher" element={<AllVoucher />} />


                </Routes>
              </AdminLayout>
            }
          />
          {/* Teacher Routes */}
          <Route
            path="/teacher/*"
            element={
              <TeacherLayout>
                <Routes>
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  <Route path="class" element={<Class />} />
                  <Route path='class/add-resourse/:classId' element={<AddResources />} />
                  <Route path='class/send-notification/:classId' element={<ClassNotification />} />
                  <Route path='class/enrolled-student/:classId' element={<EnrolledStudent />} />
                  <Route path="class/mark-attendence/:classId" element={<MarkAttendence />} />
                  <Route path="profile" element={<TeacherProfile />} />
                  <Route path="notification" element={<TeacherNoti />} />
                </Routes>
              </TeacherLayout>
            }
          />

          {/* student Routes */}
          <Route
            path="/student/*"
            element={
              <UserProvider>
                <StudentLayout>
                  <Routes>

                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="class" element={<StudentClass />} />
                    <Route path="class/resources/:classId" element={<StudentResourses />} />
                    <Route path="fee" element={<StudentFee />} />
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="feevoucher" element={<FeeVoucher />} />
                    <Route path="notification" element={<StudentNotification />} />

                  </Routes>
                </StudentLayout>
              </UserProvider>
            }
          />

          {/* Page not found fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
