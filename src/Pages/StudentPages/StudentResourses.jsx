import React, { useState } from "react";
import { Button, Card, message } from "antd";
import {  DownloadOutlined, DeleteOutlined } from "@ant-design/icons";

const dummyResources = [
    {
        id: 1,
        title: "JavaScript Basics",
        fileName: "js-basics.pdf",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
        id: 2,
        title: "React Guide",
        fileName: "react-guide.pdf",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
];

const StudentResourses = () => {
    const [resources, setResources] = useState(dummyResources);

    const handleDelete = (id) => {
        setResources(resources.filter((res) => res.id !== id));
        message.success("Resource deleted!");
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6 flex-col lg:flex-row ">
                <h2 className="text-3xl font-semibold text-blue-800 mb-5">📁 Resources</h2>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                {resources.map((res) => (
                    <Card
                        key={res.id}
                        className="w-72 shadow-md border border-gray-200 hover:shadow-lg transition-all"
                        title={res.title}
                    >
                        <p className="mb-4 text-gray-600 truncate">{res.fileName}</p>
                        <div className="flex justify-between">
                            <a href={res.fileUrl} download={res.fileName}>
                                <Button icon={<DownloadOutlined />} type="primary">Download</Button>
                            </a>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(res.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StudentResourses;
