import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogAddForm from './components/BlogAddForm'
import LoginForm from './components/LoginForm'
import Tooglable from './components/Tooglable'
import { notify, Notification } from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs( blogs )
      } catch (exception) {
        console.log(exception.response)
        notify(`Could not fetch blogs: ${
          exception.response.data.error || exception.response.data
        }`, 'error')
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log(`Setting token: '${user.token}'`)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(`logging in with ${username}:${password}`)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify(`Could not login: ${exception?.response?.data?.error}`, 'error')
      console.log(exception.response)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('logging out..')
    window.localStorage.clear()
    setUser(null)
  }

  const createBlog = async (blogObject) => {

    try {
      const newBlog = await blogService.create(blogObject)

      console.log(newBlog)
      setBlogs(blogs.concat(newBlog))

      notify(`New blog '${title}' by '${author}' added successfully!`)
      setTitle('')
      setAuthor('')
      setUrl('')
      addBlogFormRef.current.toggleVisibility()
    } catch (exception) {
      notify(`Could not add blog: ${exception.response.data.error}`, 'error')
      console.log(exception.response)
    }
  }

  const handleClickLikeOf = async (event, id) => {
    event.preventDefault()
    console.log('Sending like:', id)

    const selectedBlog = blogs.find(blog => blog.id === id)
    const likedBlog = {
      ...selectedBlog,
      likes: selectedBlog.likes + 1
    }

    try {
      const updatedBlog = await blogService.update(likedBlog)

      console.log('Updated blog:', updatedBlog)
      setBlogs(blogs.map(blog => (
        blog.id === id ? likedBlog : blog
      )))

      const { title, author } = updatedBlog
      console.log(`Blog '${title}' by '${author}' liked successfully!`)
    } catch (exception) {
      notify(`Could not like blog: ${exception.response?.data?.error ?? exception}`, 'error')
    }
  }

  const handleClickDeleteOf = async (event, id) => {
    event.preventDefault()
    console.log('Sending DELETE:', id)

    const selectedBlog = blogs.find(blog => blog.id === id)
    const { title, author } = selectedBlog

    if (!window.confirm(`Do you really want to delete ${title} by ${author}?`)) {
      return
    }

    try {
      const deletedBlog = await blogService.delete(selectedBlog)

      console.log('Deleted blog:', deletedBlog)
      setBlogs(blogs.filter(blog => (blog.id !== id)))
      console.log(`Blog '${title}' by '${author}' deleted successfully!`)
    } catch (exception) {
      notify(`Could not delete blog: ${exception.response?.data?.error ?? exception}`, 'error')
    }
  }


  const addBlogFormRef = useRef()

  const addBlogForm = () => (
    <Tooglable id="toogle-blog-add-form" buttonLabel="Add blog" ref={addBlogFormRef}>
      <BlogAddForm
        id="blog-add-form"
        createBlog={createBlog}
        title={title} setTitle={setTitle}
        author={author} setAuthor={setAuthor}
        url={url} setUrl={setUrl}
      />
    </Tooglable>
  )

  return (
    <>
      <Notification timeout={5000}/>
      {(user === null)
        ? ( // No logged user
          <LoginForm id='login-form' handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        )
      // With logged user
        : (
          <div>
            <p>{user.name} logged-in</p>
            <button onClick={handleLogout}>Logout</button>
            {addBlogForm()}
            <h2>blogs</h2>
            <div id="blog-list">
              {blogs.sort((fst, snd) => snd.likes - fst.likes).map(blog =>
                <Blog key={blog.id} blog={blog}
                  handleClickLike={(event) => handleClickLikeOf(event, blog.id)}
                  handleClickDelete={(event) => handleClickDeleteOf(event, blog.id)}
                />
              )}
            </div>
          </div>
        )}
    </>
  )
}

export default App