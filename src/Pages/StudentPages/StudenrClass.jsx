import React from "react";
import { Card, Badge, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
    ClockCircleOutlined,
    SendOutlined,
    FileAddOutlined,
} from "@ant-design/icons";

const classData = [
    {
        id: 1,
        className: "Web Development",
        teacherName: "Aslam",
        image:
            "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608",
        totalStudents: 30,
        maxStudents: 30,
        timing: "12:00 PM",
        link : "cvsdvsd"
    },
    {
        id: 2,
        className: "AI & ML",
        teacherName: "Aslam",
        image:
            "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608",
        totalStudents: 18,
        maxStudents: 25,
        timing: "12:00 PM",
        link : "cvsdvsd"
    },
    {
        id: 3,
        className: "UI/UX Design",
        teacherName: "Aslam",
        image:
            "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608",
        totalStudents: 12,
        maxStudents: 15,
        timing: "12:00 PM",
        // link : "cvsdvsd"
    },
];

const isClassCompleted = (endTime) => {
    // Simulated logic for demo purposes
    return false; // You can change this to true to test color change
};

const handleMarkAttendance = (id) => {
    console.log("Marking attendance for class:", id);
};

const StudentClass = () => {
    let navigate = useNavigate()
    return (
        <div className="p-6 min-h-screen  bg-gray-50">
            <h2 className="text-3xl font-semibold mb-10 text-center text-blue-900">
                📚 All Classes
            </h2>

            <div className="flex flex-wrap justify-center gap-6">
                {classData.map((cls) => {
                    const isFull = cls.totalStudents >= cls.maxStudents;
                    const completed = isClassCompleted(cls.endTime);
                    return (
                        <Card
                            key={cls.id}
                            hoverable
                            className={`w-[300px] transition-all duration-300 border border-gray-200 shadow-md ${completed ? "bg-red-50" : "bg-white"
                                }`}
                            style={{
                                borderRadius: "20px 41px 1px 41px",
                            }}
                            cover={
                                <img
                                    alt="class cover"
                                    src={cls.image}
                                    className="h-48 w-full object-cover rounded-t-2xl"
                                />
                            }
                            actions={[
                                <Tooltip title="See Resourses">
                                    <FileAddOutlined onClick={() => navigate('/student/class/resourses/:classId')} key="resourses" style={{ color: "#1890ff" }} />
                                </Tooltip>,
                                 <Tooltip title= {cls.link ? "Copy link" : "Not available"}>
                                 <button
                                 // disabled = {!cls.link}
                                     onClick={() => navigator.clipboard.writeText(cls.link)}
                                     style={{ background: "none", border: "none", cursor: "pointer", color: "#faad14" }}
                                 >
                                     {cls.link ? "Copy link" : "Not available"}
                                 </button>
                             </Tooltip>
                            ]}
                        >
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-blue-800">{cls.className}</h3>
                                <p className="text-gray-500">{cls.teacherName}</p>

                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <ClockCircleOutlined className="text-red-500" />
                                        {cls.timing}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentClass;
