import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Card, message, Tooltip, Empty, Select, Switch, Space, Avatar, Divider } from 'antd';
import { DeleteOutlined, EditOutlined, UserAddOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Axios/axiosInstance.js'
const { Option } = Select;

const ManageClass = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingClass, setEditingClass] = useState(null);
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
    const [courses, setCourses] = useState([]);
    let navigate = useNavigate()
    const [classes, setClasses] = useState([]);
    const [singleClass, setSingleClass] = useState(null)
    // Dummy data for dropdowns
    const teachers = ['681c8fec632958724453534e'];
    console.log(singleClass);

    const timings = [
        '3 PM to 7 PM (Afternoon)',
        '7 PM to 1 AM (Evening)',
        '2 AM to 8 AM (Night)'
    ];

    const themes = [
        { name: 'Theme 1', url: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608' },
        { name: 'Theme 2', url: 'https://storage.googleapis.com/kami-uploads-public/library-resource-egxYhSV74CxA-vdSy9m-google-classroom-banner-paint-splats-png' },
        { name: 'Theme 3', url: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mother%27s-day%2C-event%2C-greeting%2Cretail-design-template-3d3dbf8ff17ea5821edb60d082c02406_screen.jpg?ts=1698430100' }
    ];

    const showModal = (classToEdit = null) => {
        if (classToEdit) {
            form.setFieldsValue(classToEdit);
            setEditingClass(classToEdit);
        } else {
            form.resetFields();
            setEditingClass(null);
        }
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingClass) {
                const updatedClass = {
                    ...editingClass,
                    courseId: values.courseName,
                    classTiming: values.classTiming,
                    teacherId: values.teacher,
                    theme: values.theme,
                };

                await axiosInstance.put(`/updateClass/${editingClass._id}`, updatedClass);

                fetchClasses()
                message.success('Class updated successfully!');
            } else {
                const newClass = {
                    courseId: values.courseName,
                    classTiming: values.classTiming,
                    teacherId: values.teacher,
                    theme: values.theme,
                };

                const response = await axiosInstance.post('/createClass', newClass);
                fetchClasses()
                message.success('Class created successfully!');
            }

            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Error:", error);
            message.error('Something went wrong!');
        }
    };
    // get the class 
    const fetchClasses = async () => {
        try {
            const res = await axiosInstance.get('/getAllClasses');
            setClasses(res.data.classData);
            console.log('Classes fetched:', res.data.classData);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };
    const getCourses = async () => {
        try {
            const res = await axiosInstance.get('/getAllCourses');
            //   console.log('Courses fetched:', res.data);
            setCourses(res.data?.Courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchClasses()
        getCourses()
    }, [])

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDelete = async (classId) => {
        let res = await axiosInstance.delete(`/deleteClass/${classId}`)
        if (res.status === 200) {
            message.success('Class deleted successfully!');
            fetchClasses()
        } else {
            message.error('Failed to delete class!');
        }

    };
    const showDeleteConfirm = (classId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this class?',
            content: 'This action  will delete all associated data in this class.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => handleDelete(classId),
        });
    };

    return (
        <>
            <center>
                <h1 className="text-3xl font-bold text-gray-800">Manage Classes</h1>
            </center>

            <div className="container mx-auto px-4 py-8">
                <Button
                    type="primary"
                    onClick={() => showModal()}
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center mb-5"
                    size="large"
                >
                    Create New Class
                </Button>
                {/* Classes Grid */}
                {classes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls, index) => (
                            <Card
                                key={cls._id}
                                className={`transition-all duration-300 ${hoveredCardIndex === index ? 'transform scale-105 shadow-xl' : 'shadow-md'} rounded-2xl overflow-hidden border-0`}
                                onMouseEnter={() => setHoveredCardIndex(index)}
                                onMouseLeave={() => setHoveredCardIndex(null)}
                                cover={
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            alt="class theme"
                                            src={cls.theme}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <h3 className="text-xl font-bold">{cls.courseName}</h3>
                                            <p className="text-sm flex items-center">
                                                <UserOutlined className="mr-1" /> {cls.teacherId?.firstName}
                                            </p>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            <ClockCircleOutlined className="mr-2" />
                                            {cls.classTiming}
                                        </span>
                                    </div>

                                    <Divider className="my-2" />
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">
                                            Students ({cls.students?.length || 0})
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {cls.students?.length > 0 ? (
                                                <>
                                                    {cls.students.slice(0, 3).map((entry) => {
                                                        const student = entry.studentId; // populated student object
                                                        return (
                                                            <Tooltip title="Click to see all enrolled students" key={student._id}>
                                                                <Avatar
                                                                    onClick={() => navigate(`/admin/manage-class/all-students/${cls._id}`, { state: { singleClass: cls } })}
                                                                    style={{ cursor: "pointer" }}
                                                                    size="small"
                                                                    src={student.profileUrl || undefined}
                                                                    icon={
                                                                        !student.profileUrl &&
                                                                        (student.gender === "male"
                                                                            ? "👨"
                                                                            : student.gender === "female"
                                                                                ? "👩"
                                                                                : <UserOutlined />)
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        );
                                                    })}

                                                    <Tooltip title="Add student">
                                                        <Button
                                                            onClick={() =>
                                                                navigate(`/admin/manage-class/add-student/${cls.courseId._id}`, {
                                                                    state: { singleClass: cls }
                                                                })
                                                            }
                                                            type="dashed"
                                                            shape="circle"
                                                            icon={<UserAddOutlined />}
                                                            size="small"
                                                            className="text-indigo-500"
                                                        />
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <Button
                                                    onClick={() =>
                                                        navigate(`/admin/manage-class/add-student/${cls.courseId._id}`, {
                                                            state: { singleClass: cls }
                                                        })
                                                    }
                                                    type="dashed"
                                                    icon={<UserAddOutlined />}
                                                    className="text-indigo-500"
                                                >
                                                    Add Students
                                                </Button>
                                            )}
                                        </div>
                                    </div>


                                    <div className="flex justify-between">
                                        <Button
                                            type="primary"
                                            ghost
                                            icon={<EditOutlined />}
                                            onClick={() => showModal(cls)}
                                            className="border-indigo-500 text-indigo-600"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => showDeleteConfirm(cls._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Empty
                        description="No classes created yet"
                        className="flex flex-col items-center justify-center py-16"
                    >
                        <Button
                            type="primary"
                            onClick={() => showModal()}
                            className="bg-indigo-600 hover:bg-indigo-700 mt-4"
                        >
                            Create Your First Class
                        </Button>
                    </Empty>
                )}

                {/* Create/Edit Class Modal */}
                <Modal
                    title={editingClass ? 'Edit Class' : 'Create New Class'}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText={editingClass ? 'Update' : 'Create'}
                    cancelText="Cancel"
                    width={600}
                >
                    <Form form={form} layout="vertical" className="space-y-4">
                        <Form.Item
                            name="courseName"
                            label="Course Name"
                            rules={[{ required: true, message: 'Please select a course name' }]}
                        >
                            <Select
                                placeholder="Select course name"
                                className="w-full"
                                showSearch
                                optionFilterProp="children"
                            >
                                {courses.map(course => (
                                    <Option key={course._id} value={course._id}>{course.courseName}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="teacher"
                            label="Teacher"
                            rules={[{ required: true, message: 'Please select a teacher' }]}
                        >
                            <Select
                                placeholder="Select teacher"
                                className="w-full"
                                showSearch
                                optionFilterProp="children"
                            >
                                {teachers.map(teacher => (
                                    <Option key={teacher} value={teacher}>{teacher}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="classTiming"
                            label="Class Timing"
                            rules={[{ required: true, message: 'Please select a timing' }]}
                        >
                            <Select
                                placeholder="Select timing"
                                className="w-full"
                                showSearch
                                optionFilterProp="children"
                            >
                                {timings.map(time => (
                                    <Option key={time} value={time}>{time}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="theme"
                            label="Class Theme"
                            rules={[{ required: true, message: 'Please select a theme' }]}
                        >
                            <Select
                                placeholder="Select theme"
                                className="w-full"
                            >
                                {themes.map((theme, index) => (
                                    <Option key={index} value={theme.url}>
                                        <div className="flex items-center">
                                            <img
                                                src={theme.url}
                                                alt={theme.name}
                                                className="w-10 h-6 object-cover mr-2 rounded"
                                            />
                                            {theme.name}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

        </>
    );
};

export default ManageClass;