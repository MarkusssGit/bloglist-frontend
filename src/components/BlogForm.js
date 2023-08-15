const BlogForm = ({ addblog, blogTitle, handleBlogTitleChange, blogAuthor, handleBlogAuthorChange, blogUrl, handleBlogUrlChange }) => (
    <form onSubmit={addblog}>
      <h2>Add blog</h2>
      <div>
        Title: <input
          value={blogTitle}
          onChange={handleBlogTitleChange}
        />
      </div>
      <div>
        Author: <input
          value={blogAuthor}
          onChange={handleBlogAuthorChange}
        />
      </div>
      <div>
        URL: <input
          value={blogUrl}
          onChange={handleBlogUrlChange}
        />
      </div>
      <div>
        <button type="submit">save</button>
      </div>
    </form>  
)

export default BlogForm