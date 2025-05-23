import React, { useContext } from 'react'
import Chat from '../Chat/Chat'
import StudentTone from '../../assets/Student.wav'
import useSound from 'use-sound';
import { UserContext } from '../../Context/UserContext';
function StudentChat() {
    const [playMessageTone] = useSound(StudentTone);
    const { userData } = useContext(UserContext)
    const userId = userData.id;
    let fetchStudentPath = '/api/getTeacherInChat'
    return (
        <div>
            <Chat id={userId} path={fetchStudentPath} sound={playMessageTone} />
        </div>
    )
}

export default StudentChat
