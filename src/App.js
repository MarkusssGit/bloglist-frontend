import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl]  = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
  }

  const handleLogout = async (event) => {
    loginService.logout('loggedBlogappUser')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Login</h2>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const showBlogs = () => (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
      )}
    </div>
    
  )

  const blogForm = () => (
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

  const addblog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setBlogTitle('')
        setBlogAuthor('')
        setBlogUrl('')
      })
  }

  const handleBlogTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }

  return (
    <div>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && <div>
       <p>{user.name} logged in</p> <form onSubmit={handleLogout}><button type="submit">log out</button></form>
      </div>
      }

      {user && blogForm()}
      {user && showBlogs()}

    </div>
  )
}

export default App