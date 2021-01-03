import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

// Wrapping the component inside 'forwardRef' renders it able to access the assigned ref
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const { buttonLabel, id } = props

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // Make function available from outside
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div id={id}>
      <div style={hideWhenVisible}>
        <button className="toogle-button" onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button className="cancel-button" onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable