import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl]  = useState('')

  const handleBlogTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }

  const addblog = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <form onSubmit={addblog}>
      <h2>Add blog</h2>
      <div>
        Title: <input
          id = 'title'
          value={blogTitle}
          onChange={handleBlogTitleChange}
        />
      </div>
      <div>
        Author: <input
          id = 'author'
          value={blogAuthor}
          onChange={handleBlogAuthorChange}
        />
      </div>
      <div>
        URL: <input
          id = 'url'
          value={blogUrl}
          onChange={handleBlogUrlChange}
        />
      </div>
      <div>
        <button type="submit">save</button>
      </div>
    </form>  
  )
}

export default BlogForm