import React, { useEffect, useState } from "react";
import { Card, Badge, Tooltip, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
    UserOutlined,
    ClockCircleOutlined,
    SendOutlined,
    FileAddOutlined,
    CheckOutlined
} from "@ant-design/icons";
import axiosInstance from '../../Axios/axiosInstance.js';

const Class = () => {
    const [classes, setClasses] = useState([]);
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();


    let fetchClass = async () => {
        setLoader(true)
        try {
            let res = await axiosInstance.get("/getClassByTeacherId/681c8fec632958724453534e")
            setClasses(res.data);
            console.log(res.data);
            setLoader(false)
        } catch (error) {
            console.log(error)
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchClass()
    }, []);

    const isClassFull = (students) => students.length >= 12;
    if (loader) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                <Spin size="large" />
            </div>
        );
    }
    return (
        <div className="p-6 min-h-screen bg-gradient-to-br ">
            <h2 className="text-4xl font-bold mb-12 text-center text-blue-900">
                🎓 All Classes
            </h2>

            <div className="flex flex-wrap justify-center gap-8">
                {classes.map((cls) => {
                    const isFull = isClassFull(cls.students);

                    return (
                        <Card
                            key={cls._id}
                            hoverable
                            className="w-[320px] transition-all duration-300 hover:scale-[1.02] bg-white"
                            style={{
                                borderRadius: "20px 41px 20px 41px",
                                border: "2px solid #e5e7eb",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                                overflow: "hidden"
                            }}
                            cover={
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        alt="class theme"
                                        src={cls.theme}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                        style={{ borderTopLeftRadius: "18px", borderTopRightRadius: "39px" }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
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
                                            navigate(`/teacher/class/send-notification/${cls._id}`, { state: { cls } })
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
                                            navigate(`/teacher/class/mark-attendence/${cls._id}`,
                                                {
                                                    state: { cls }
                                                })
                                        }
                                    />
                                </Tooltip>,
                            ]}
                        >
                            <div className="space-y-3 px-1">
                                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                                    {cls.courseId?.courseName || "Untitled Course"}
                                </h3>

                                <div className="flex items-center gap-2">
                                    <UserOutlined className="text-gray-400" />
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-700">
                                            {cls.teacherId?.firstName || "Unknown Teacher"}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <ClockCircleOutlined className="text-blue-400" />
                                        <span className="text-sm font-medium text-gray-700">
                                            {cls.classTiming}
                                        </span>
                                    </div>

                                    {isFull ? (
                                        <Badge
                                            count="Full"
                                            className="font-medium"
                                            style={{
                                                backgroundColor: "#ef4444",
                                                boxShadow: "0 0 0 1px #fee2e2"
                                            }}
                                        />
                                    ) : (
                                        <Badge
                                            count={`${cls.students.length}/12`}
                                            className="font-medium"
                                            style={{
                                                backgroundColor: "#22c55e",
                                                boxShadow: "0 0 0 1px #dcfce7"
                                            }}
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
