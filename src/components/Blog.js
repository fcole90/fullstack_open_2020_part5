import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleClickLike, handleClickDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const style = {
    backgroundColor: 'azure',
    margin: 0.4 + 'em'
  }

  return (
    <div style={style} className="blog">
      {blog.title} by {blog.author}
      <button className='view-button' onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'hide' : 'view'}</button>
      {
        isExpanded && (
          <>
            <div>{blog.url}</div>
            <div>Likes:<span className='likes-amount'>{blog.likes}</span> <button className='like-button' onClick={handleClickLike}>Like</button></div>
            <div>{blog.author}</div>
            <button className='delete-button' onClick={handleClickDelete}>Delete</button>
          </>
        )
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleClickLike: PropTypes.func.isRequired,
  handleClickDelete: PropTypes.func.isRequired
}

export default Blog