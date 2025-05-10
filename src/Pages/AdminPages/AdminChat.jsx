import React from 'react'
import Chat from '../../Components/Chat/Chat'
import AdminTone from '../../assets/Admin.wav'
import useSound from 'use-sound';
function AdminChat() {
    const [playTone] = useSound(AdminTone);
    const userId = "681c8fc56329587244535343";
    let fetchAllUserPath = '/adminAllUserInchat'
  return (
    <div>
       <Chat id={userId} path={fetchAllUserPath} sound={playTone} />
    </div>
  )
}

export default AdminChat
