import React, { useContext } from 'react'
import Notification from '../../Components/Notifications/Notifications'
import { UserContext } from '../../Context/UserContext'

function StudentNotification() {
  const {userData} = useContext(UserContext)
  return (
    <div>
      <Notification userId={userData.id} role={'students'}/>
    </div>
  )
}

export default StudentNotification
