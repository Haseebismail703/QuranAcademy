import React from 'react'
import Chat from '../Chat/Chat'
import StudentTone from '../../assets/Student.wav'
import useSound from 'use-sound';
function StudentChat() {
    const [playMessageTone] = useSound(StudentTone);
    const userId = "681c8fdc6329587244535349";
    let fetchStudentPath = '/getTeacherInChat'
    return (
        <div>
            <Chat id={userId} path={fetchStudentPath} sound={playMessageTone} />
        </div>
    )
}

export default StudentChat
