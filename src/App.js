import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

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
      setMessage('wrong credentials')
      setMessageType('errorRed')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
  }

  const handleLogout = async (event) => {
    loginService.logout('loggedBlogappUser')
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }
    return (
      <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setLoginVisible(true)}>log in</button>
      </div>
      <div style={showWhenVisible}>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
        <button onClick={() => setLoginVisible(false)}>cancel</button>
      </div>
    </div>    
    )
  }

  const showBlogs = () => {
    blogs.sort((a, b) => b.likes - a.likes)
    return (
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog}
          handlelike={handlelike}
          handleDelete={handleDelete}
        />
        )}
      </div>
    )
  }

  const blogForm = () => (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm 
          createBlog={addblog}
        /> 
      </Togglable>
    </div>
  )

  const addblog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
        .then(returnedBlog => {
          returnedBlog.user = user
          setBlogs(blogs.concat(returnedBlog))
          setMessage(`new blog added: ${returnedBlog.title} by ${returnedBlog.author}`)
          setMessageType('errorGreen')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
  }

  const handlelike = id => {
    const likedblog = blogs.find(blog => blog.id === id)
    const newLikes = likedblog.likes + 1
    
    const changedblog = { ...likedblog, likes: newLikes }

    blogService
      .update(id, changedblog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
  }

  const handleDelete = id => {
    if (window.confirm('Do you really want to delete this blog?')) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          setMessage('Blog deleted')
          setMessageType('errorGreen')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage('Failed to delete blog')
          setMessageType('errorRed')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <Notification 
        message={message}
        type={messageType} />
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