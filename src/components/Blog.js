import { useState } from 'react'

const Blog = ({ blog, handlelike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  }

  return (
  <div style={blogStyle}>
    {blog.title} by {blog.author} <button onClick={toggleDetails}>{showDetails ? 'hide info' : 'view more info'}</button>
    {showDetails && (
        <div>
          <p>URL: {blog.url}</p>
          <p>likes: {blog.likes} <button onClick={() => handlelike(blog.id)}>Like</button></p>
          <p>{blog.user.username}</p>
          <button onClick={() => handleDelete(blog.id)}>Delete</button>
        </div>
    )}
  </div>  
  )
}

export default Blog