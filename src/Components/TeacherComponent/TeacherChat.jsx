import React from 'react'
import Chat from '../Chat/Chat'
import messageTone from '../../assets/Teacher.wav';
import useSound from 'use-sound';
function TeacherChat() {
  const [playMessageTone] = useSound(messageTone);
  const userId = "681c8fec632958724453534e";
  // get student in the teacher chat 
  let fetchStudentPath = '/getStudentsInChat'
  return (
    <div>
      <Chat id={userId} path={fetchStudentPath} sound={playMessageTone} />
    </div>
  )
}

export default TeacherChat
