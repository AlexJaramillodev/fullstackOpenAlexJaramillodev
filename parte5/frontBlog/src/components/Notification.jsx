import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if(message === null){
    return null
  }

  const notificationStyle = type === 'success' ? 'success' : 'error'

  return (
    <div className={notificationStyle}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string
}

export default Notification