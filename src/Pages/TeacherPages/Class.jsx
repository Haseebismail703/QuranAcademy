import React, { useEffect, useState } from "react";
import { Card, Badge, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import {
    UserOutlined,
    ClockCircleOutlined,
    SendOutlined,
    FileAddOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import axiosInstance from '../../Axios/axiosInstance.js';

const Class = () => {
    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/getClassByTeacherId/681c8fec632958724453534e")
            .then((res) => {
                setClasses(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Failed to fetch classes:", err);
            });
    }, []);

    const isClassFull = (students) => students.length >= 12;

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br ">
            <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">
                🎓 All Courses
            </h2>

            <div className="flex flex-wrap justify-center gap-8">
                {classes.map((cls) => {
                    const isFull = isClassFull(cls.students);

                    return (
                        <Card
                            key={cls._id}
                            hoverable
                            className="w-[320px] shadow-lg border-none transition-transform duration-300 transform hover:scale-105 bg-white"
                            style={{ borderRadius: "25px" }}
                            cover={
                                <img
                                    alt="class theme"
                                    src={cls.theme}
                                    className="h-48 w-full object-cover rounded-t-[25px]"
                                />
                            }
                            actions={[
                                <Tooltip title="Add Resources">
                                    <FileAddOutlined
                                        style={{ color: "#3b82f6", fontSize: 20 }}
                                        onClick={() =>
                                            navigate(`/teacher/class/add-resourse/${cls._id}`)
                                        }
                                    />
                                </Tooltip>,
                                <Tooltip title="Send Notification">
                                    <SendOutlined
                                        style={{ color: "#10b981", fontSize: 20 }}
                                        onClick={() =>
                                            navigate(`/teacher/class/send-notification/${cls._id}`)
                                        }
                                    />
                                </Tooltip>,
                                <Tooltip title="View Students">
                                    <UserOutlined
                                        style={{ color: "#f59e0b", fontSize: 20 }}
                                        onClick={() =>
                                            navigate(`/teacher/class/enrolled-student/${cls._id}`)
                                        }
                                    />
                                </Tooltip>,
                                <Tooltip title="Mark Attendance">
                                    <CheckOutlined
                                        style={{ color: "#0ea5e9", fontSize: 20 }}
                                        onClick={() =>
                                            navigate(`/teacher/class/mark-attendence/${cls._id}`, {
                                                state: { classDetail: cls }
                                            })
                                        }
                                    />
                                </Tooltip>,
                            ]}
                        >
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-blue-700">
                                    {cls.courseId?.courseName || "Untitled Course"}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Teacher: <span className="font-medium">{cls.teacherId?.firstName || "Unknown"}</span>
                                </p>
                               

                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm text-gray-700 flex items-center gap-2">
                                        <ClockCircleOutlined className="text-blue-500" />
                                        {cls.classTiming}
                                    </span>
                                    {isFull ? (
                                        <Badge count="Full" style={{ backgroundColor: "#ef4444" }} />
                                    ) : (
                                        <Badge
                                            count={`${cls.students.length}/12`}
                                            style={{ backgroundColor: "#22c55e" }}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Class;
