import React, { useState } from 'react';
import { Button, Modal, Form, Input, Card, message, Tooltip, Empty, Select, Switch, Space, Avatar, Divider } from 'antd';
import {  DeleteOutlined, EditOutlined, UserAddOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const ManageCourse = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingClass, setEditingClass] = useState(null);
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
    let navigate = useNavigate()
    // Dummy data for classes
    const [classes, setClasses] = useState([
        {
            id: '1',
            courseName: 'Hifz Class',
            teacher: 'Habib',
            timing: '9:00 AM - 10:00 AM',
            // classCode: 'ABC123',
            createdAt: '2023-10-01',
            theme: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608',
            students: [
                { id: 's1', name: 'Ahmed Khan', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
                { id: 's2', name: 'Fatima Ali', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }
            ],
            status: true
        },
        {
            id: '2',
            courseName: 'Nazra Class',
            teacher: 'Usama',
            timing: '11:00 AM - 12:00 PM',
            // classCode: 'DEF456',
            createdAt: '2023-10-02',
            theme: 'https://storage.googleapis.com/kami-uploads-public/library-resource-egxYhSV74CxA-vdSy9m-google-classroom-banner-paint-splats-png',
            students: [
                { id: 's3', name: 'Mohammed Hassan', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
                { id: 's4', name: 'Aisha Rahman', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }
            ],
            status: true
        },
        {
            id: '3',
            courseName: 'Tajweed Class',
            teacher: 'Haseeb',
            timing: '2:00 PM - 3:00 PM',
            // classCode: 'GHI789',
            createdAt: '2023-10-03',
            theme: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mother%27s-day%2C-event%2C-greeting%2Cretail-design-template-3d3dbf8ff17ea5821edb60d082c02406_screen.jpg?ts=1698430100',
            students: [
                { id: 's5', name: 'Ibrahim Malik', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
                { id: 's6', name: 'Zainab Omar', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' }
            ],
            status: false
        }
    ]);
    // Dummy data for dropdowns
    const courses = ['Hifz', 'Nazra', 'Tajweed', 'Fiqh', 'Arabic'];
    const teachers = ['Mr. John', 'Ms. Emma', 'Dr. Smith', 'Mr. Ahmed', 'Ms. Fatima'];
    const timings = [
        '9:00 AM - 10:00 AM',
        '11:00 AM - 12:00 PM',
        '2:00 PM - 3:00 PM',
        '4:00 PM - 5:00 PM',
        '6:00 PM - 7:00 PM'
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
                // Update existing class
                setClasses(classes.map(cls =>
                    cls.id === editingClass.id ? { ...cls, ...values } : cls
                ));
                message.success('Class updated successfully!');
            } else {
                // Add new class
                const newClass = {
                    id: (classes.length + 1).toString(),
                    ...values,
                    classCode: `CLS${Math.floor(100 + Math.random() * 900)}`,
                    createdAt: new Date().toISOString().split('T')[0],
                    students: [],
                    status: true
                };
                setClasses([...classes, newClass]);
                message.success('Class created successfully!');
            }

            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Validation Failed:", error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleDelete = (classId) => {
        setClasses(classes.filter(cls => cls.id !== classId));
        message.success('Class deleted successfully!');
    };

    const handleStatusChange = (classId, checked) => {
        setClasses(classes.map(cls =>
            cls.id === classId ? { ...cls, status: checked } : cls
        ));
        message.success(`Class ${checked ? 'activated' : 'deactivated'}!`);
    };


    const showDeleteConfirm = (classId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this class?',
            content: 'This action cannot be undone and will delete all associated data.',
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
                                key={cls.id}
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
                                                <UserOutlined className="mr-1" /> {cls.teacher}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={cls.status}
                                            onChange={(checked) => handleStatusChange(cls.id, checked)}
                                            className="absolute top-3 right-3"
                                        />
                                    </div>
                                }
                            >
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            <ClockCircleOutlined className="mr-2" />
                                            {cls.timing}
                                        </span>
                                    </div>

                                    <Divider className="my-2" />

                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Students ({cls.students.length})</h4>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {cls.students.length > 0 ? (
                                                <>
                                                    {cls.students.map(student => (
                                                        <Tooltip title={"Click to see All enrolled student"} key={student.id}>
                                                            <Avatar onClick={() => navigate('/admin/manage-class/all-students/1')}  style={{ cursor: "pointer" }} src={student.avatar} size="small" />
                                                        </Tooltip>
                                                    ))}
                                                    <Tooltip title="Add student">
                                                        <Button
                                                          onClick={() => navigate('/admin/manage-class/add-student/1')}
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
                                            onClick={() => showDeleteConfirm(cls.id)}
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
                                    <Option key={course} value={course}>{course}</Option>
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
                            name="timing"
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

export default ManageCourse;