import React, { useState } from 'react'

let timer
let setter

const notify = (message, type = 'notification') => {
  setter({
    content: message,
    type: type
  })
  setTimeout(() => {
    setter(null)
  }, timer)
}


const Notification = ({ timeout }) => {
  const [notification, setNotification] = useState(null)
  setter = setNotification
  timer = timeout !== undefined ? timeout : 5000

  if (notification === null) {
    return null
  }

  return (
    <div id='notification' className={notification.type}>
      {notification.content}
    </div>
  )
}

export default { Notification, notify }
export { Notification, notify }